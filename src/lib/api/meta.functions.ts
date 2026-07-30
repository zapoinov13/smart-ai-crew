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
  fbp: z.string().nullish(),
  fbc: z.string().nullish(),
  userAgent: z.string().nullish(),
  customData: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});

export const trackMetaCapiEvent = createServerFn({ method: "POST" })
  .inputValidator(eventInputSchema)
  .handler(async ({ data }) => {
    try {
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
        fbp: data.fbp ?? undefined,
        fbc: data.fbc ?? undefined,
        customData: data.customData,
      });

      return result;
    } catch (err) {
      console.error("[meta-capi]", err instanceof Error ? err.message : err);
      return {
        ok: false as const,
        reason: "capi_error" as const,
        message: err instanceof Error ? err.message : "unknown",
      };
    }
  });
