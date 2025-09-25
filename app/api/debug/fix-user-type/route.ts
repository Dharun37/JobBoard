import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        JobSeeker: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user has a JobSeeker profile but userType is not set correctly
    if (user.JobSeeker && user.userType !== "JOB_SEEKER") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          userType: "JOB_SEEKER",
          onboardingCompleted: true,
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: "User type updated to JOB_SEEKER successfully!",
        updatedUser: {
          userType: "JOB_SEEKER",
          onboardingCompleted: true,
        }
      });
    } else if (!user.JobSeeker) {
      return NextResponse.json({ 
        error: "No JobSeeker profile found. Please complete onboarding first.",
        needsOnboarding: true 
      }, { status: 400 });
    } else {
      return NextResponse.json({ 
        success: true, 
        message: "User type is already correct!",
        currentUserType: user.userType 
      });
    }
    
  } catch (error) {
    console.error("Fix user type error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}