/**
 * Quick fix script to update user type to JOB_SEEKER
 * Run this with: npx tsx fix-user-type.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUserType() {
  try {
    // Get the user's email (you'll need to replace this with your actual email)
    const userEmail = "your-email@example.com"; // REPLACE WITH YOUR ACTUAL EMAIL
    
    console.log(`Looking for user with email: ${userEmail}`);
    
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        JobSeeker: true,
        Company: true,
      }
    });

    if (!user) {
      console.log("User not found! Please check the email address.");
      return;
    }

    console.log("Current user data:", {
      id: user.id,
      email: user.email,
      userType: user.userType,
      onboardingCompleted: user.onboardingCompleted,
      hasJobSeekerProfile: !!user.JobSeeker,
      hasCompanyProfile: !!user.Company,
    });

    // If user has completed onboarding but userType is not set correctly
    if (user.onboardingCompleted && user.JobSeeker && user.userType !== "JOB_SEEKER") {
      console.log("Fixing user type to JOB_SEEKER...");
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          userType: "JOB_SEEKER"
        }
      });
      
      console.log("✅ User type updated to JOB_SEEKER successfully!");
    } else if (!user.onboardingCompleted) {
      console.log("⚠️ User hasn't completed onboarding. Please complete onboarding first.");
    } else if (!user.JobSeeker) {
      console.log("⚠️ User doesn't have a JobSeeker profile. Please complete onboarding as a job seeker.");
    } else {
      console.log("✅ User type is already correct!");
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserType();