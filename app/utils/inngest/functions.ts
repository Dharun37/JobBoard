import { inngest } from "./client";
import { prisma } from "../db";

export const handleJobExpiration = inngest.createFunction(
  { id: "job-expiration" },
  { event: "job/created" },
  async ({ event, step }) => {
    const { jobId, expirationDays } = event.data;

    // Validate event data - skip if invalid (handles old queued events)
    if (!jobId || !expirationDays) {
      console.warn("⚠️ Skipping job expiration - invalid event data:", { jobId, expirationDays });
      return { 
        skipped: true, 
        reason: "Invalid event data - likely from old queued event",
        jobId,
        expirationDays 
      };
    }

    // Wait for the specified duration
    await step.sleep("wait-for-expiration", `${expirationDays}d`);

    // Update job status to expired
    await step.run("update-job-status", async () => {
      // Check if job exists before updating
      const job = await prisma.jobPost.findUnique({
        where: { id: jobId },
        select: { id: true, status: true }
      });

      if (!job) {
        console.warn(`⚠️ Job ${jobId} not found - may have been deleted`);
        return { skipped: true, reason: "Job not found" };
      }

      if (job.status === "EXPIRED") {
        console.log(`ℹ️ Job ${jobId} already expired - skipping`);
        return { skipped: true, reason: "Already expired" };
      }

      await prisma.jobPost.update({
        where: { id: jobId },
        data: { status: "EXPIRED" },
      });

      console.log(`✅ Job ${jobId} marked as expired`);
    });

    return { jobId, message: "Job marked as expired" };
  }
);
