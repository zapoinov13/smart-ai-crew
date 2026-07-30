/** WhatsApp redirect with ad attribution via ref: + Meta Pixel/CAPI. */

import { trackMetaCapiEvent } from "@/lib/api/meta.functions";
import {
  CONTENT_NAME,
  ensureFbcFromFbclid,
  ensurePixel,
  getFbIds,
  newEventId,
  trackViewContent,
  trackWhatsAppCta,
} from "@/lib/meta-pixel";

export const SITE = "zapoinovai";
export const WA_PHONE = "77776290913";

/** Build `ref:zapoinovai[.cid][.asid][.adid]` from URL params. */
export function buildAdRef(search = typeof window !== "undefined" ? window.location.search : ""): string {
  const p = new URLSearchParams(search);
  const cid = p.get("cid") || "";
  const asid = p.get("asid") || "";
  const adid = p.get("adid") || "";
  return `ref:${SITE}${cid ? `.${cid}` : ""}${asid ? `.${asid}` : ""}${adid ? `.${adid}` : ""}`;
}

export function buildWaAccessText(search?: string): string {
  return `Хочу получить доступ\n${buildAdRef(search)}`;
}

export function buildWaUrl(search?: string): string {
  const text = buildWaAccessText(search);
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(text)}`;
}

function adCustomData(search = typeof window !== "undefined" ? window.location.search : "") {
  const p = new URLSearchParams(search);
  const cid = p.get("cid") || "";
  const asid = p.get("asid") || "";
  const adid = p.get("adid") || "";
  return {
    site: SITE,
    ...(cid ? { campaign_id: cid } : {}),
    ...(asid ? { adset_id: asid } : {}),
    ...(adid ? { ad_id: adid } : {}),
  };
}

/** Capture fbclid → _fbc and fire ViewContent once per page load. */
export function initLandingPixel(): void {
  if (typeof window === "undefined") return;
  ensureFbcFromFbclid();
  ensurePixel();
  try {
    if (sessionStorage.getItem("za_vc")) return;
    sessionStorage.setItem("za_vc", "1");
  } catch {
    // ignore
  }
  trackViewContent();
}

async function sendCapiLead(eventId: string): Promise<void> {
  if (typeof window === "undefined") return;
  const { fbp, fbc } = getFbIds();
  const customData = adCustomData(window.location.search);

  const payload = {
    data: {
      eventId,
      eventName: "Lead" as const,
      contentName: CONTENT_NAME,
      eventSourceUrl: window.location.href,
      fbp,
      fbc,
      userAgent: navigator.userAgent,
      customData,
    },
  };

  try {
    await Promise.race([
      trackMetaCapiEvent(payload),
      new Promise((resolve) => window.setTimeout(resolve, 1500)),
    ]);
  } catch {
    // Don't block WhatsApp on CAPI failure
  }
}

/**
 * Pixel Lead/Contact/WhatsAppClick + CAPI Lead (same event_id) → open WA with ref.
 */
export async function openWhatsAppAccess(): Promise<void> {
  if (typeof window === "undefined") return;

  ensureFbcFromFbclid();
  ensurePixel();

  const eventId = newEventId("za");
  const extra = adCustomData(window.location.search);

  // Browser Pixel first (queued even if fbevents still loading)
  trackWhatsAppCta(eventId, extra);

  // Server CAPI with identical event_id for dedup
  await sendCapiLead(eventId);

  window.location.href = buildWaUrl(window.location.search);
}
