import { NextRequest, NextResponse } from "next/server";
import { searchServices } from "@/lib/services-data";

type AgentIntentPayload = {
  intent?: string;
  siteId?: string;
  dryRun?: boolean;
};

type AgentTraceStep = {
  step_index: number;
  action_id: string;
  action_kind: string;
  status: string;
  message: string;
};

function buildTrace(intent: string, navigationUrl: string | null): AgentTraceStep[] {
  const steps: AgentTraceStep[] = [
    {
      step_index: 1,
      action_id: "receive_intent",
      action_kind: "input",
      status: "done",
      message: "Intent received by site backend.",
    },
    {
      step_index: 2,
      action_id: "match_site_content",
      action_kind: "search",
      status: "done",
      message: "Matched the request against the Easy Approval service catalog.",
    },
  ];

  if (navigationUrl) {
    steps.push({
      step_index: 3,
      action_id: "navigate_to_service",
      action_kind: "navigation",
      status: "done",
      message: `Open the service page for "${intent}".`,
    });
  } else {
    steps.push({
      step_index: 3,
      action_id: "return_plan",
      action_kind: "response",
      status: "done",
      message: "Return the matched result to the widget.",
    });
  }

  return steps;
}

function resolveNavigationUrl(intent: string): string | null {
  const matches = searchServices(intent);

  if (matches.length === 0) {
    return null;
  }

  const exactMatch = matches.find((service) => {
    const value = intent.toLowerCase();
    return (
      service.name.toLowerCase() === value ||
      service.slug.toLowerCase() === value ||
      service.id.toLowerCase() === value
    );
  });

  const service = exactMatch || matches[0];

  return service ? `/services/${service.slug}` : null;
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
  const trace = buildTrace(intent, navigationUrl);

  return NextResponse.json({
    success: true,
    siteId: payload.siteId ?? "easy-approval",
    dryRun: payload.dryRun ?? true,
    intent,
    navigationUrl,
    response: {
      type: navigationUrl ? "navigation" : "execution_steps",
      message: navigationUrl
        ? "Matched to a site service page"
        : "Intent received",
      navigationUrl,
    },
    result: {
      trace,
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
