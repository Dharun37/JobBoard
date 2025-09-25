import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { auth } from "@/app/utils/auth";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Reset user's onboarding status so they can complete it again
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingCompleted: false,
        userType: null,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Onboarding reset successfully. You can now complete it again." 
    });
    
  } catch (error) {
    console.error("Reset onboarding error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}