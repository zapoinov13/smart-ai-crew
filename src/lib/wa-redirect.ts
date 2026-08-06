/** WhatsApp redirect with ad attribution via ref: + Meta Pixel (no Lead on click). */

import {
  ensureFbcFromFbclid,
  ensurePixel,
  newEventId,
  trackViewContent,
  trackWhatsAppCta,
} from "@/lib/meta-pixel";

export const SITE = "zapoinovai";
export const WA_PHONE = "77472842595";

/** Build `ref:zapoinovai[.cid][.asid][.adid]` from URL params. */
export function buildAdRef(search = typeof window !== "undefined" ? window.location.search : ""): string {
  const p = new URLSearchParams(search);
  const cid = p.get("cid") || "";
  const asid = p.get("asid") || "";
  const adid = p.get("adid") || "";
  return `ref:${SITE}${cid ? `.${cid}` : ""}${asid ? `.${asid}` : ""}${adid ? `.${adid}` : ""}`;
}

export function buildWaAccessText(search?: string): string {
  return `Хочу научится создавать приложения с помощью AI\n${buildAdRef(search)}`;
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

/**
 * Pixel Contact/WhatsAppClick (NOT Lead) → open WA with ref.
 * Meta Lead is sent by the bot via CAPI after the first WhatsApp message.
 */
export async function openWhatsAppAccess(): Promise<void> {
  if (typeof window === "undefined") return;

  ensureFbcFromFbclid();
  ensurePixel();

  const eventId = newEventId("za");
  trackWhatsAppCta(eventId, adCustomData(window.location.search));

  window.location.href = buildWaUrl(window.location.search);
}
