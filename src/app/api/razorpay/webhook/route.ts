import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { finalizePaidOrder, verifyWebhookSignature } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = env.razorpayWebhookSecret;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity;
      const providerOrderId = payment.order_id;
      const providerPaymentId = payment.id;

      await finalizePaidOrder({
        providerOrderId,
        providerPaymentId,
        verifiedPayment: {
          amount: payment.amount,
          currency: payment.currency,
          orderId: providerOrderId,
          paymentId: providerPaymentId,
          status: "captured",
        },
      });

      return NextResponse.json({ status: "ok" });
    }

    if (eventType === "payment.failed") {
      const payment = event.payload.payment.entity;
      const providerOrderId = payment.order_id;

      await db.order.updateMany({
        where: { providerOrderId },
        data: { status: "failed" },
      });

      return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
