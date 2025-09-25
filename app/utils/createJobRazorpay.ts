"use server";

import { z } from "zod";
import { requireUser } from "./hooks";
import { jobSchema } from "./zodSchemas";
import { prisma } from "./db";
import { jobListingDurationPricing } from "./pricingTiers";

// Simplified Razorpay payment action
export async function createJobWithRazorpay(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();
  const validatedData = jobSchema.parse(data);

  // Find the company
  const company = await prisma.company.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  if (!company?.id) {
    return { error: "Company not found" };
  }

  // Create job post as DRAFT
  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
      status: "DRAFT", // Will be activated after payment
    },
  });

  // Get pricing info
  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    return { error: "Invalid listing duration" };
  }

  // Return data for Razorpay payment
  return {
    success: true,
    jobId: jobPost.id,
    amount: pricingTier.price,
    description: `Job Posting - ${pricingTier.days} Days`,
    userId: user.id || "", // Ensure it's always a string
  };
}