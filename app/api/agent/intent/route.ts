import { NextRequest, NextResponse } from "next/server";

type AgentIntentPayload = {
  intent?: string;
  siteId?: string;
  dryRun?: boolean;
};

export async function POST(request: NextRequest) {
  let payload: AgentIntentPayload;

  try {
    payload = (await request.json()) as AgentIntentPayload;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON payload",
      },
      { status: 400 }
    );
  }

  const intent = payload.intent?.trim();

  if (!intent) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing intent",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    siteId: payload.siteId ?? "easy-approval",
    dryRun: payload.dryRun ?? true,
    intent,
    response: {
      type: "acknowledgement",
      message: "Intent received",
    },
  });
}

export function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed",
    },
    { status: 405 }
  );
}
