import { razorpay } from "@/app/utils/razorpay";
import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR", jobId, userId } = await req.json();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency,
      receipt: `job_${jobId}_${Date.now()}`,
      notes: {
        jobId,
        userId,
      },
    });

    // Store order details in database (optional)
    // You can create a separate Order model in Prisma schema if needed

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}