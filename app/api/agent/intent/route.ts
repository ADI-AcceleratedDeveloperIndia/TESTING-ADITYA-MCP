import { NextRequest, NextResponse } from "next/server";

type AgentIntentPayload = {
  intent?: string;
  siteId?: string;
  dryRun?: boolean;
};

const PRIVATE_LIMITED_SERVICE_URL = "/services/private-limited-company-registration";

function resolveNavigationUrl(intent: string): string | null {
  const normalized = intent.toLowerCase();

  if (
    normalized.includes("private limited company") ||
    normalized.includes("private limited") ||
    normalized.includes("pvt ltd") ||
    normalized.includes("private ltd")
  ) {
    return PRIVATE_LIMITED_SERVICE_URL;
  }

  return null;
}

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

  const navigationUrl = resolveNavigationUrl(intent);

  return NextResponse.json({
    success: true,
    siteId: payload.siteId ?? "easy-approval",
    dryRun: payload.dryRun ?? true,
    intent,
    navigationUrl,
    response: {
      type: navigationUrl ? "navigation" : "acknowledgement",
      message: navigationUrl
        ? "Opening the Private Limited Company service page"
        : "Intent received",
      navigationUrl,
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
