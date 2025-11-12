import { verifyPaymentSignature } from "@/app/utils/razorpay";
import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      jobId,
    } = await req.json();

    console.log("🧪 Verifying Razorpay payment for job:", jobId, "in", process.env.NODE_ENV);

    // Verify payment signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update job post status to ACTIVE
    const updatedJob = await prisma.jobPost.update({
      where: {
        id: jobId,
      },
      data: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        listingDuration: true,
      },
    });

    // Trigger Inngest job expiration event
    console.log("🔄 Triggering Inngest event for job:", updatedJob.id);
    
    try {
      const { inngest } = await import("@/app/utils/inngest/client");
      const inngestResult = await inngest.send({
        name: "job/created",
        data: {
          jobId: updatedJob.id,
          expirationDays: updatedJob.listingDuration,
        },
      });
      
      console.log("✅ Inngest event sent successfully:", inngestResult);
    } catch (inngestError) {
      console.error("❌ Failed to send Inngest event:", inngestError);
    }

    console.log("✅ TEST payment verified and job activated:", jobId);

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      testMode: true,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}