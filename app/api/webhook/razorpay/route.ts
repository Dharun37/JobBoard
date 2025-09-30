import { prisma } from "@/app/utils/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  try {
    console.log("🔔 Razorpay webhook received!");
    const body = await req.text();
    const headersList = await headers();
    
    const signature = headersList.get("x-razorpay-signature") as string;
    
    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment.captured event
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      
      // Extract job ID from order notes (we set this when creating the order)
      const orderDetails = await fetch(
        `https://api.razorpay.com/v1/orders/${orderId}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
            ).toString("base64")}`,
          },
        }
      );
      
      const order = await orderDetails.json();
      const jobId = order.notes?.jobId;
      const userId = order.notes?.userId;

      if (!jobId || !userId) {
        console.error("No job ID or user ID found in order notes");
        return NextResponse.json(
          { error: "No job ID or user ID found" },
          { status: 400 }
        );
      }

      // Update the job post status to ACTIVE
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
      console.log("🔄 Attempting to trigger Inngest event...", {
        jobId: updatedJob.id,
        expirationDays: updatedJob.listingDuration
      });

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

      // Optional: Store payment details
      // You can create a Payment model in Prisma schema to store payment information
      
      console.log(`Payment successful for job ${jobId}, payment ID: ${paymentId}`);
      console.log(`Inngest event triggered for job expiration in ${updatedJob.listingDuration} days`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}