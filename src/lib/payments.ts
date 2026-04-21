import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { db } from "./db";
import { env } from "./env";

type RazorpayPaymentStatus = "authorized" | "captured";

type VerifiedPaymentDetails = {
  amount: number;
  currency: string;
  orderId: string;
  paymentId: string;
  status: RazorpayPaymentStatus;
};

function getRazorpayInstance() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    throw new Error("Razorpay credentials are not configured.");
  }

  return new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  });
}

function createHexDigest(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function equalSignatures(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(received, "utf8");

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  const expected = createHexDigest(payload, secret);
  return equalSignatures(expected, signature);
}

export function verifyCheckoutSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
) {
  const expected = createHexDigest(`${orderId}|${paymentId}`, secret);
  return equalSignatures(expected, signature);
}

async function fetchVerifiedPayment(paymentId: string): Promise<VerifiedPaymentDetails> {
  const payment = await getRazorpayInstance().payments.fetch(paymentId);

  if (
    payment.status !== "authorized" &&
    payment.status !== "captured"
  ) {
    throw new Error("Payment is not in a payable status.");
  }

  if (!payment.order_id) {
    throw new Error("Payment is not associated with an order.");
  }

  return {
    amount: Number(payment.amount),
    currency: String(payment.currency),
    orderId: String(payment.order_id),
    paymentId: String(payment.id),
    status: payment.status,
  };
}

export async function finalizePaidOrder(input: {
  providerOrderId: string;
  providerPaymentId: string;
  expectedUserId?: string;
  verifiedPayment?: VerifiedPaymentDetails;
}) {
  const order = await db.order.findUnique({
    where: { providerOrderId: input.providerOrderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (input.expectedUserId && order.userId !== input.expectedUserId) {
    throw new Error("Unauthorized");
  }

  if (
    order.status === "paid" &&
    order.providerPaymentId &&
    order.providerPaymentId !== input.providerPaymentId
  ) {
    throw new Error("Order is already linked to another payment.");
  }

  const payment =
    input.verifiedPayment ?? (await fetchVerifiedPayment(input.providerPaymentId));

  if (payment.orderId !== order.providerOrderId) {
    throw new Error("Payment does not belong to the requested order.");
  }

  if (payment.amount !== order.amount || payment.currency !== order.currency) {
    throw new Error("Payment amount mismatch.");
  }

  const result = await db.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        providerPaymentId: payment.paymentId,
      },
    });

    const unlock = await tx.resumeUnlock.upsert({
      where: { orderId: order.id },
      update: {
        status: "paid",
        resumeId:
          order.productType === "single_resume_unlock" ? order.resumeId : null,
        unlockType:
          order.productType === "single_resume_unlock" ? "single" : "lifetime",
        unlockedAt: new Date(),
      },
      create: {
        userId: order.userId,
        resumeId:
          order.productType === "single_resume_unlock" ? order.resumeId : null,
        unlockType:
          order.productType === "single_resume_unlock" ? "single" : "lifetime",
        status: "paid",
        orderId: order.id,
        unlockedAt: new Date(),
      },
    });

    return { order: updatedOrder, unlock };
  });

  return {
    orderId: result.order.id,
    providerOrderId: result.order.providerOrderId,
    providerPaymentId: result.order.providerPaymentId,
    status: result.order.status,
    unlockType: result.unlock.unlockType,
  };
}
