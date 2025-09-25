import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        JobSeeker: true,
        Company: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      onboardingCompleted: user.onboardingCompleted,
      hasJobSeekerProfile: !!user.JobSeeker,
      hasCompanyProfile: !!user.Company,
      jobSeekerData: user.JobSeeker ? {
        id: user.JobSeeker.id,
        name: user.JobSeeker.name,
        about: user.JobSeeker.about?.substring(0, 100) + "..." || null,
      } : null,
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}