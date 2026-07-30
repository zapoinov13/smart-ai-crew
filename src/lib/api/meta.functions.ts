import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

import { getServerConfig } from "../config.server";
import { sendMetaCapiEvent } from "../meta-capi.server";

const eventInputSchema = z.object({
  eventId: z.string().min(8),
  eventName: z.enum(["Lead", "Contact"]).default("Lead"),
  contentName: z.string().min(1),
  eventSourceUrl: z.string().url(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  userAgent: z.string().optional(),
  customData: z.record(z.union([z.string(), z.number()])).optional(),
});

export const trackMetaCapiEvent = createServerFn({ method: "POST" })
  .inputValidator(eventInputSchema)
  .handler(async ({ data }) => {
    const { metaPixelId, metaCapiAccessToken } = getServerConfig();

    if (!metaCapiAccessToken) {
      return { ok: false as const, reason: "missing_token" as const };
    }

    const result = await sendMetaCapiEvent({
      pixelId: metaPixelId,
      accessToken: metaCapiAccessToken,
      eventName: data.eventName,
      eventId: data.eventId,
      eventSourceUrl: data.eventSourceUrl,
      contentName: data.contentName,
      clientIpAddress: getRequestIP({ xForwardedFor: true }) ?? undefined,
      clientUserAgent: data.userAgent ?? getRequestHeader("user-agent") ?? undefined,
      fbp: data.fbp,
      fbc: data.fbc,
      customData: data.customData,
    });

    return result;
  });
