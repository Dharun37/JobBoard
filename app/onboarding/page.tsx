import React from "react";

import { prisma } from "../utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/hooks";
import OnboardingForm from "@/components/forms/onboarding/OnboardingForm";

async function checkIfOnboardingCompleted(userId: string, returnTo?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      onboardingCompleted: true,
      userType: true,
      Company: {
        select: {
          id: true,
        },
      },
    },
  });

  console.log("Onboarding check:", {
    userId,
    onboardingCompleted: user?.onboardingCompleted,
    userType: user?.userType,
    hasCompany: !!user?.Company,
    returnTo
  });

  // If user is fully set up (has userType and company profile if they're a company)
  const isFullySetup = user?.onboardingCompleted === true && 
                      user?.userType && 
                      (user.userType === "JOB_SEEKER" || (user.userType === "COMPANY" && user.Company));

  if (isFullySetup) {
    console.log("User fully set up, redirecting to:", returnTo || "/");
    redirect(returnTo || "/");
  }

  // If user is trying to go to post-job but is a job seeker
  if (returnTo === "/post-job" && user?.userType === "JOB_SEEKER") {
    console.log("Job seeker trying to post job, redirecting to home");
    redirect("/");
  }
}

const OnboardingPage = async ({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) => {
  const session = await requireUser();
  const params = await searchParams;

  await checkIfOnboardingCompleted(session.id as string, params.returnTo);
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnboardingForm returnTo={params.returnTo} />
    </div>
  );
};

export default OnboardingPage;
