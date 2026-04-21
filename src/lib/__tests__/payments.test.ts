import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const baseOrder = {
  id: "order_db_1",
  userId: "user_1",
  resumeId: "resume_1",
  provider: "razorpay",
  providerOrderId: "order_razorpay_1",
  providerPaymentId: null,
  productType: "single_resume_unlock",
  amount: 299,
  currency: "USD",
  status: "created",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const { findUnique, orderUpdate, unlockUpsert, transaction } = vi.hoisted(() => {
  const findUnique = vi.fn();
  const orderUpdate = vi.fn();
  const unlockUpsert = vi.fn();
  const transaction = vi.fn(async (callback: (tx: unknown) => unknown) =>
    callback({
      order: { update: orderUpdate },
      resumeUnlock: { upsert: unlockUpsert },
    })
  );

  return {
    findUnique,
    orderUpdate,
    unlockUpsert,
    transaction,
  };
});

vi.mock("../db", () => ({
  db: {
    order: {
      findUnique,
    },
    $transaction: transaction,
  },
}));

import {
  finalizePaidOrder,
  verifyCheckoutSignature,
  verifyWebhookSignature,
} from "../payments";

describe("payment helpers", () => {
  beforeEach(() => {
    findUnique.mockReset();
    orderUpdate.mockReset();
    unlockUpsert.mockReset();
    transaction.mockClear();
  });

  it("verifies checkout signatures", () => {
    const signature = createHmac("sha256", "secret")
      .update("order_razorpay_1|pay_1")
      .digest("hex");

    expect(
      verifyCheckoutSignature(
        "order_razorpay_1",
        "pay_1",
        signature,
        "secret"
      )
    ).toBe(true);
  });

  it("verifies webhook signatures", () => {
    const payload = JSON.stringify({ event: "payment.captured" });
    const signature = createHmac("sha256", "secret")
      .update(payload)
      .digest("hex");

    expect(verifyWebhookSignature(payload, signature, "secret")).toBe(true);
  });

  it("finalizes a paid order exactly once per order id", async () => {
    findUnique.mockResolvedValue(baseOrder);
    orderUpdate.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      ...baseOrder,
      ...data,
    }));
    unlockUpsert.mockResolvedValue({
      orderId: baseOrder.id,
      unlockType: "single",
      status: "paid",
    });

    const result = await finalizePaidOrder({
      providerOrderId: baseOrder.providerOrderId,
      providerPaymentId: "pay_123",
      expectedUserId: baseOrder.userId,
      verifiedPayment: {
        amount: 299,
        currency: "USD",
        orderId: baseOrder.providerOrderId,
        paymentId: "pay_123",
        status: "captured",
      },
    });

    expect(orderUpdate).toHaveBeenCalledTimes(1);
    expect(unlockUpsert).toHaveBeenCalledTimes(1);
    expect(result.status).toBe("paid");
  });

  it("treats duplicate verification for the same paid order as idempotent", async () => {
    findUnique.mockResolvedValue({
      ...baseOrder,
      status: "paid",
      providerPaymentId: "pay_123",
    });
    orderUpdate.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      ...baseOrder,
      status: "paid",
      providerPaymentId: "pay_123",
      ...data,
    }));
    unlockUpsert.mockResolvedValue({
      orderId: baseOrder.id,
      unlockType: "single",
      status: "paid",
    });

    const result = await finalizePaidOrder({
      providerOrderId: baseOrder.providerOrderId,
      providerPaymentId: "pay_123",
      expectedUserId: baseOrder.userId,
      verifiedPayment: {
        amount: 299,
        currency: "USD",
        orderId: baseOrder.providerOrderId,
        paymentId: "pay_123",
        status: "captured",
      },
    });

    expect(unlockUpsert).toHaveBeenCalledTimes(1);
    expect(result.providerPaymentId).toBe("pay_123");
  });

  it("rejects attempts to relink an already-paid order to another payment", async () => {
    findUnique.mockResolvedValue({
      ...baseOrder,
      status: "paid",
      providerPaymentId: "pay_original",
    });

    await expect(
      finalizePaidOrder({
        providerOrderId: baseOrder.providerOrderId,
        providerPaymentId: "pay_other",
        expectedUserId: baseOrder.userId,
        verifiedPayment: {
          amount: 299,
          currency: "USD",
          orderId: baseOrder.providerOrderId,
          paymentId: "pay_other",
          status: "captured",
        },
      })
    ).rejects.toThrow("already linked");
  });
});
