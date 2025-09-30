import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/app/utils/inngest/client";
import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { jobId, paymentId } = await req.json();

    console.log("🔄 Manual payment confirmation received:", { jobId, paymentId });

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Update job status to ACTIVE
    const updatedJob = await prisma.jobPost.update({
      where: {
        id: jobId,
        companyId: {
          in: await prisma.company
            .findMany({
              where: { userId: user.id },
              select: { id: true }
            })
            .then(companies => companies.map(c => c.id))
        }
      },
      data: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        listingDuration: true,
      },
    });

    // Trigger Inngest event for job expiration
    console.log("🔄 Triggering Inngest event for job:", updatedJob.id);
    
    const inngestResult = await inngest.send({
      name: "job/created",
      data: {
        jobId: updatedJob.id,
        expirationDays: updatedJob.listingDuration,
      },
    });

    console.log("✅ Job activated and Inngest event triggered:", inngestResult);

    return NextResponse.json({ 
      success: true, 
      jobId: updatedJob.id,
      inngestEventId: inngestResult.ids[0]
    });

  } catch (error) {
    console.error("❌ Error in manual payment confirmation:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}