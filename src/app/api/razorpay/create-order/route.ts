import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRODUCTS } from "@/lib/types";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { productType, resumeId } = body;

    if (!productType || !["single_resume_unlock", "lifetime_unlimited"].includes(productType)) {
      return NextResponse.json(
        { error: "Invalid product type" },
        { status: 400 }
      );
    }

    if (productType === "single_resume_unlock" && !resumeId) {
      return NextResponse.json(
        { error: "Resume ID required for single unlock" },
        { status: 400 }
      );
    }

    if (resumeId) {
      const resume = await db.resume.findUnique({ where: { id: resumeId } });
      if (!resume || resume.userId !== user.id) {
        return NextResponse.json(
          { error: "Resume not found" },
          { status: 404 }
        );
      }
    }

    const product = PRODUCTS[productType as keyof typeof PRODUCTS];

    const razorpayOrder = await razorpay.orders.create({
      amount: product.price,
      currency: product.currency,
      receipt: `order_${Date.now()}`,
      notes: {
        userId: user.id,
        resumeId: resumeId || "",
        productType,
      },
    });

    const order = await db.order.create({
      data: {
        userId: user.id,
        resumeId: productType === "single_resume_unlock" ? resumeId : null,
        provider: "razorpay",
        providerOrderId: razorpayOrder.id,
        productType: productType as "single_resume_unlock" | "lifetime_unlimited",
        amount: product.price,
        currency: product.currency,
        status: "created",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      providerOrderId: razorpayOrder.id,
      amount: product.price,
      currency: product.currency,
      email: user.email,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
