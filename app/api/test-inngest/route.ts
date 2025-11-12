import { NextResponse } from "next/server";
import { inngest } from "@/app/utils/inngest/client";

export async function GET() {
  try {
    // Send a test event
    const result = await inngest.send({
      name: "job/created",
      data: {
        jobId: "test-job-123",
        expirationDays: 1, // 1 day for testing
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test event sent to Inngest",
      eventIds: result.ids,
      note: "Check your Inngest dashboard or logs to see if it was received"
    });
  } catch (error) {
    console.error("Inngest test error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
