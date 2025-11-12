import { NextRequest, NextResponse } from "next/server";
import arcjet, { detectBot, shield } from "@/app/utils/arcjet";
import { request } from "@arcjet/next";

// Create Arcjet instance with bot detection
const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [], // Block all bots
    })
  );

export async function GET(req: NextRequest) {
  // Get the Arcjet request object
  const arcjetReq = await request();
  
  // Protect the endpoint
  const decision = await aj.protect(arcjetReq);

  // Log the decision for debugging
  console.log("🔍 Arcjet Decision:", {
    conclusion: decision.conclusion,
    reason: decision.reason,
    ip: decision.ip,
    isBot: decision.isBot,
    botCategories: decision.botCategories,
    userAgent: arcjetReq.headers.get("user-agent"),
  });

  // If denied, return forbidden
  if (decision.isDenied()) {
    return NextResponse.json(
      {
        blocked: true,
        reason: decision.reason,
        message: "Access denied by Arcjet security",
        details: {
          isBot: decision.isBot,
          botCategories: decision.botCategories,
          ip: decision.ip,
        },
      },
      { status: 403 }
    );
  }

  // If allowed, return success
  return NextResponse.json({
    allowed: true,
    message: "✅ Access granted! You are not detected as a bot.",
    details: {
      ip: decision.ip,
      userAgent: arcjetReq.headers.get("user-agent"),
      isBot: decision.isBot,
      conclusion: decision.conclusion,
    },
  });
}
