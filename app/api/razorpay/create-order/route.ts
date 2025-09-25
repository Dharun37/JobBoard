import { razorpay } from "@/app/utils/razorpay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("🔧 API Request - Environment:", process.env.NODE_ENV);
  
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    console.error("❌ Not in development mode");
    return NextResponse.json(
      { error: "Razorpay is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { amount, currency = "INR", jobId, userId } = await req.json();

    console.log("🧪 Creating Razorpay TEST order:", {
      jobId,
      amount,
      currency,
      userId,
      razorpayInitialized: !!razorpay
    });

    if (!razorpay) {
      const error = "Razorpay not initialized - check environment variables";
      console.error("❌", error);
      return NextResponse.json(
        { 
          error,
          debug: {
            NODE_ENV: process.env.NODE_ENV,
            RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? "Present" : "Missing",
            RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? "Present" : "Missing"
          }
        },
        { status: 500 }
      );
    }

    // Create short receipt (max 40 chars for Razorpay)
    const shortJobId = jobId.slice(-8); // Last 8 chars of jobId
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const receipt = `job_${shortJobId}_${timestamp}`; // Format: job_12345678_123456
    
    console.log("📝 Receipt generated:", receipt, "Length:", receipt.length);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency,
      receipt,
      notes: {
        jobId,
        userId,
        mode: "TEST", // Mark as test transaction
      },
    });

    console.log("✅ Order created successfully:", order.id);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      testMode: true,
    });
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    return NextResponse.json(
      { 
        error: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}