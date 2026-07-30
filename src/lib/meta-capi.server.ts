const META_GRAPH_API_VERSION = "v21.0";

export type MetaCapiEventInput = {
  pixelId: string;
  accessToken: string;
  eventName: "Lead" | "Contact" | "ViewContent" | "PageView";
  eventId: string;
  eventSourceUrl: string;
  contentName: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, string | number>;
};

export async function sendMetaCapiEvent(input: MetaCapiEventInput) {
  const url = `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${input.pixelId}/events?access_token=${encodeURIComponent(input.accessToken)}`;

  const userData: Record<string, string> = {};
  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress;
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent;
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          action_source: "website",
          event_source_url: input.eventSourceUrl,
          user_data: userData,
          custom_data: {
            content_name: input.contentName,
            content_category: "whatsapp",
            ...(input.customData || {}),
          },
        },
      ],
      // Enable better EMQ in Events Manager test/prod
      partner_agent: "zapoinovai-landing",
    }),
  });

  const payload = (await response.json()) as {
    events_received?: number;
    fbtrace_id?: string;
    error?: { message?: string; type?: string; code?: number };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `Meta CAPI error: ${response.status}`);
  }

  return {
    ok: true as const,
    eventsReceived: payload.events_received ?? 0,
    fbtraceId: payload.fbtrace_id,
  };
}
