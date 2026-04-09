import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event;

    if (eventType === "payment.captured") {
      const payment = event.payload.payment.entity;
      const providerOrderId = payment.order_id;
      const providerPaymentId = payment.id;

      const order = await db.order.findUnique({
        where: { providerOrderId },
      });

      if (!order) {
        console.error("Order not found for:", providerOrderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (payment.amount !== order.amount) {
        console.error("Amount mismatch:", payment.amount, order.amount);
        return NextResponse.json(
          { error: "Amount mismatch" },
          { status: 400 }
        );
      }

      await db.$transaction([
        db.order.update({
          where: { id: order.id },
          data: {
            status: "paid",
            providerPaymentId,
          },
        }),

        db.resumeUnlock.create({
          data: {
            userId: order.userId,
            resumeId: order.productType === "single_resume_unlock" ? order.resumeId : null,
            unlockType:
              order.productType === "single_resume_unlock" ? "single" : "lifetime",
            status: "paid",
            orderId: order.id,
            unlockedAt: new Date(),
          },
        }),
      ]);

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
