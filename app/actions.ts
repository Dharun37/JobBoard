"use server";

import { z } from "zod";
import { requireUser } from "./utils/hooks";
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export async function createCompany(data: z.infer<typeof companySchema>) {
  const user = await requireUser();

  // Access the request object so Arcjet can analyze it
  const req = await request();
  // Call Arcjet protect
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  // Server-side validation
  const validatedData = companySchema.parse(data);

  console.log(validatedData);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();

  // Access the request object so Arcjet can analyze it
  const req = await request();
  // Call Arcjet protect
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function updateJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  const user = await requireUser();

  const validatedData = jobSchema.parse(data);

  await prisma.jobPost.update({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });

  return redirect("/my-jobs");
}

export async function deleteJobPost(jobId: string) {
  const user = await requireUser();

  await prisma.jobPost.delete({
    where: {
      id: jobId,
      company: {
        userId: user.id,
      },
    },
  });

  return redirect("/my-jobs");
}

export async function saveJobPost(jobId: string) {
  const user = await requireUser();

  await prisma.savedJobPost.create({
    data: {
      jobId: jobId,
      userId: user.id as string,
    },
  });

  revalidatePath(`/job/${jobId}`);
}

export async function unsaveJobPost(savedJobPostId: string) {
  const user = await requireUser();

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string,
    },
    select: {
      jobId: true,
    },
  });

  revalidatePath(`/job/${data.jobId}`);
}

export async function applyToJob(formData: FormData) {
  try {
    const user = await requireUser();
    const jobId = formData.get("jobId") as string;
    const coverLetter = formData.get("coverLetter") as string | null;

    // Check if user completed onboarding
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        onboardingCompleted: true,
        userType: true,
      },
    });

    if (!userData?.onboardingCompleted) {
      redirect("/onboarding");
    }

    if (userData.userType !== "JOB_SEEKER") {
      // Redirect to onboarding to complete/update profile
      redirect("/onboarding");
    }

    // Check if user is a job seeker
    const jobSeeker = await prisma.jobSeeker.findUnique({
      where: { userId: user.id },
    });

    if (!jobSeeker) {
      // User marked as job seeker but profile doesn't exist, redirect to onboarding
      redirect("/onboarding");
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: user.id as string,
          jobId: jobId,
        },
      },
    });

    if (existingApplication) {
      throw new Error("You have already applied to this job.");
    }

    // Create the application
    await prisma.jobApplication.create({
      data: {
        jobId: jobId,
        userId: user.id as string,
        coverLetter: coverLetter || null,
      },
    });

    // Increment the applications count
    await prisma.jobPost.update({
      where: { id: jobId },
      data: {
        applications: {
          increment: 1,
        },
      },
    });

    revalidatePath(`/job/${jobId}`);
    redirect(`/job/${jobId}?applied=true`);
    
  } catch (error) {
    console.error("Failed to apply to job:", error);
    throw error; // Re-throw to be handled by the form
  }
}
