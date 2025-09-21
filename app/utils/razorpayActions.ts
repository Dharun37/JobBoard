"use server";

import { z } from "zod";
import { requireUser } from "./hooks";
import { jobSchema } from "./zodSchemas";
import { prisma } from "./db";
import { redirect } from "next/navigation";
import { jobListingDurationPricing } from "./pricingTiers";

// Razorpay-specific payment action
export async function createRazorpayPayment(
  data: z.infer<typeof jobSchema>,
  listingDuration: number
) {
  const user = await requireUser();

  const validatedData = jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  // Create job post first
  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      location: validatedData.location,
      benefits: validatedData.benefits,
      expiresAt: new Date(Date.now() + listingDuration * 24 * 60 * 60 * 1000),
      status: "DRAFT", // Will be updated after successful payment
    },
  });

  // Find pricing tier
  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration selected");
  }

  // Return data needed for frontend Razorpay integration
  return {
    jobId: jobPost.id,
    amount: pricingTier.price,
    description: `Job Posting - ${pricingTier.days} Days`,
    userId: user.id,
  };
}