import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import {
  finalizePaidOrder,
  verifyCheckoutSignature,
} from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const {
      orderId,
      razorpay_order_id: providerOrderId,
      razorpay_payment_id: providerPaymentId,
      razorpay_signature: signature,
    } = body ?? {};

    if (!orderId || !providerOrderId || !providerPaymentId || !signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!env.razorpayKeySecret) {
      return NextResponse.json(
        { error: "Payment verification is not configured" },
        { status: 500 }
      );
    }

    const validSignature = verifyCheckoutSignature(
      order.providerOrderId,
      providerPaymentId,
      signature,
      env.razorpayKeySecret
    );

    if (!validSignature || order.providerOrderId !== providerOrderId) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const result = await finalizePaidOrder({
      providerOrderId,
      providerPaymentId,
      expectedUserId: user.id,
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
