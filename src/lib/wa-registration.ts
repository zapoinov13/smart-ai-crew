/** WA-first CTA + first-touch attribution for workshop-marketologi */

export const CLICK_ENDPOINT = "https://n8n.zapoinov.com/webhook/event-hub-click";
export const WA_PHONE = "77776290913";
export const SEGMENT = "marketologi";
export const PROJECT = "marketologi";
export const CONTENT_NAME = "workshop-marketologi";
export const TRACK_KEY = "mv_marketologi_track";
export const CLICK_KEY = "mv_marketologi_click";

type Attribution = Record<string, string>;

/** UTM + click ids + Meta ad ids from URL */
const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "fbclid",
  "gclid",
  "ad_id",
  "adid",
  "adset_id",
  "campaign_id",
  "ad_name",
  "adset_name",
  "campaign_name",
  "placement",
  "site_source_name",
] as const;

function readStore(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(TRACK_KEY) || "{}") as Attribution;
  } catch {
    return {};
  }
}

function writeStore(stored: Attribution) {
  try {
    sessionStorage.setItem(TRACK_KEY, JSON.stringify(stored));
  } catch {
    // ignore
  }
}

/** Resolve Meta ad id from common URL / UTM shapes. */
export function resolveAdId(att: Attribution = getAttribution()): string {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    for (const key of ["ad_id", "adid", "utm_content", "utm_term"]) {
      const value = params.get(key);
      if (value) {
        // utm_content often is the ad id or {{ad.id}}
        if (key === "utm_content" || key === "utm_term") {
          if (/^\d{5,}$/.test(value)) return value;
        } else {
          return value;
        }
      }
    }
  }
  if (att.ad_id) return att.ad_id;
  if (att.adid) return att.adid;
  if (att.utm_content && /^\d{5,}$/.test(att.utm_content)) return att.utm_content;
  if (att.utm_term && /^\d{5,}$/.test(att.utm_term)) return att.utm_term;
  return "";
}

/** First-touch: capture UTM/fbclid/ad ids once. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const stored = readStore();

  for (const key of ATTR_KEYS) {
    const value = params.get(key);
    if (value && !stored[key]) stored[key] = value;
  }

  // Meta dynamic URL macros sometimes arrive as h_ad_id etc.
  for (const [key, value] of params.entries()) {
    if (!value) continue;
    if (/^(h_)?(ad|adset|campaign)(_?id|_?name)?$/i.test(key) && !stored[key]) {
      stored[key] = value;
    }
  }

  let ig = params.get("ig") || params.get("ig_source") || "";
  if (
    !ig &&
    /instagram/i.test(params.get("utm_source") || stored.utm_source || "")
  ) {
    ig = params.get("utm_content") || stored.utm_content || "";
  }
  if (ig && !stored.source_ig) stored.source_ig = ig.replace(/^@+/, "").trim();

  const adId = resolveAdId(stored);
  if (adId && !stored.ad_id) stored.ad_id = adId;

  if (document.referrer && !stored.entry_referrer) {
    stored.entry_referrer = document.referrer;
  }
  if (!stored.entry_page) stored.entry_page = window.location.href;

  writeStore(stored);
  return stored;
}

export function getAttribution(): Attribution {
  return readStore();
}

export function getUtms(): Attribution {
  const out: Attribution = {};
  const att = getAttribution();
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    if (att[key]) out[key] = att[key];
  }
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
      const value = params.get(key);
      if (value) out[key] = value;
    }
  }
  return out;
}

export function getFbIds(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const out: { fbp?: string; fbc?: string } = {};
  document.cookie.split(";").forEach((part) => {
    const i = part.trim().indexOf("=");
    if (i < 0) return;
    const key = part.trim().slice(0, i);
    const value = decodeURIComponent(part.trim().slice(i + 1));
    if (key === "_fbp") out.fbp = value;
    if (key === "_fbc") out.fbc = value;
  });
  return out;
}

export function pixelPayload(extra: Record<string, string> = {}) {
  const adId = resolveAdId();
  return {
    content_name: CONTENT_NAME,
    segment: SEGMENT,
    ...(adId ? { ad_id: adId } : {}),
    ...getUtms(),
    ...extra,
  };
}

function accessText(code?: string) {
  return code ? `Хочу получить доступ\nкод ${code}` : "Хочу получить доступ";
}

export function buildWaUrl(code?: string) {
  return `https://api.whatsapp.com/send?phone=${WA_PHONE}&text=${encodeURIComponent(accessText(code))}`;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Lead on WhatsApp CTA click (no form).
 * eventID = hub code when available for CAPI dedup.
 */
export function trackWhatsAppLead(code: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const att = getAttribution();
  const extra: Record<string, string> = {};
  if (att.source_ig) extra.source_ig = att.source_ig;
  const adId = resolveAdId(att);
  if (adId) extra.ad_id = adId;
  const eventId = code || `wa_lead_${Date.now()}`;
  try {
    window.fbq("track", "Lead", pixelPayload(extra), { eventID: eventId });
    window.fbq("trackCustom", "WhatsAppClick", pixelPayload(extra), {
      eventID: `${eventId}:wa`,
    });
  } catch {
    // ignore
  }
}

type ClickResponse = {
  ok?: boolean;
  code?: string;
  wa_url?: string;
};

/** Request hub click-code; sends ad attribution to n8n. */
export async function requestWaAccessCode(): Promise<{ code: string; href: string }> {
  if (typeof window === "undefined") {
    return { code: "", href: buildWaUrl() };
  }

  captureAttribution();
  const att = getAttribution();
  const utms = getUtms();
  const fb = getFbIds();
  const fbclid =
    att.fbclid || new URLSearchParams(window.location.search).get("fbclid") || "";
  const landing = att.entry_page || window.location.href;
  const adId = resolveAdId(att);

  let code = "";
  let href = buildWaUrl();

  try {
    const response = await fetch(CLICK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: PROJECT,
        segment: SEGMENT,
        landing_url: landing,
        page_url: window.location.href,
        entry_page: att.entry_page || landing,
        referrer: document.referrer || att.entry_referrer || "",
        source_ig: att.source_ig || "",
        fbclid,
        gclid: att.gclid || "",
        utm_id: att.utm_id || "",
        ad_id: adId || att.ad_id || "",
        adset_id: att.adset_id || "",
        campaign_id: att.campaign_id || "",
        ad_name: att.ad_name || "",
        adset_name: att.adset_name || "",
        campaign_name: att.campaign_name || "",
        placement: att.placement || "",
        site_source_name: att.site_source_name || "",
        ...fb,
        ...utms,
      }),
      keepalive: true,
    });
    const data = (await response.json().catch(() => ({}))) as ClickResponse;
    if (response.ok && data?.code) {
      code = String(data.code);
      href = data.wa_url || buildWaUrl(code);
    }
  } catch {
    // fallback without code
  }

  try {
    sessionStorage.setItem(
      CLICK_KEY,
      JSON.stringify({ code, ad_id: adId, ts: Date.now() }),
    );
  } catch {
    // ignore
  }

  return { code, href };
}

/**
 * CTA: hub click (ad attribution) → Lead pixel → WhatsApp.
 * On API failure still opens WA with «Хочу получить доступ».
 */
export async function openWhatsAppAccess(): Promise<void> {
  if (typeof window === "undefined") return;
  const { code, href } = await requestWaAccessCode();
  trackWhatsAppLead(code);
  window.location.href = href;
}
