export const META_PIXEL_ID = "2826237244414415";
export const CONTENT_NAME = "workshop-marketologi";
export const SEGMENT = "zapoinovai";

const PIXEL_BOOTSTRAP = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

/**
 * Load Pixel ASAP for ad traffic (fbclid / Meta ids), otherwise defer for LCP.
 */
export const META_PIXEL_DEFERRED_LOADER = `(function(){if(window.__mvPixelScheduled)return;window.__mvPixelScheduled=1;function load(){if(window.__mvPixelLoaded)return;window.__mvPixelLoaded=1;${PIXEL_BOOTSTRAP}}function isAd(){try{var q=location.search||'';return /[?&](fbclid|cid|asid|adid|utm_source)=/.test(q)}catch(e){return false}}function arm(){if(window.__mvPixelArmed)return;window.__mvPixelArmed=1;if(isAd()){load();return}if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:2500});else setTimeout(load,1200)}if(document.readyState==='complete')arm();else window.addEventListener('load',arm,{once:true});['scroll','pointerdown','keydown','touchstart'].forEach(function(e){window.addEventListener(e,load,{once:true,passive:true})})})();`;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __mvPixelScheduled?: number;
    __mvPixelLoaded?: number;
    __mvPixelArmed?: number;
  }
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const i = part.trim().indexOf("=");
    if (i < 0) continue;
    if (part.trim().slice(0, i) === name) {
      return decodeURIComponent(part.trim().slice(i + 1));
    }
  }
  return "";
}

/** Ensure _fbc exists when Meta sends fbclid (needed for CAPI match quality). */
export function ensureFbcFromFbclid(): string {
  if (typeof window === "undefined") return "";
  const existing = readCookie("_fbc");
  if (existing) return existing;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return "";
  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  try {
    const maxAge = 90 * 24 * 60 * 60;
    document.cookie = `_fbc=${encodeURIComponent(fbc)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    // ignore
  }
  return fbc;
}

export function getFbIds(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  ensureFbcFromFbclid();
  const fbp = readCookie("_fbp") || undefined;
  const fbc = readCookie("_fbc") || undefined;
  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
}

export function ensurePixel() {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") return;
  try {
    // eslint-disable-next-line no-new-func
    new Function(PIXEL_BOOTSTRAP)();
  } catch {
    // ignore
  }
}

export function newEventId(prefix = "za"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`;
}

function basePayload(extra: Record<string, string> = {}) {
  const params =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const adid = params?.get("adid") || params?.get("ad_id") || "";
  const cid = params?.get("cid") || params?.get("campaign_id") || "";
  const asid = params?.get("asid") || params?.get("adset_id") || "";
  return {
    content_name: CONTENT_NAME,
    segment: SEGMENT,
    ...(cid ? { campaign_id: cid } : {}),
    ...(asid ? { adset_id: asid } : {}),
    ...(adid ? { ad_id: adid } : {}),
    ...extra,
  };
}

function track(
  event: string,
  payload: Record<string, string>,
  eventId?: string,
  custom = false,
) {
  if (typeof window === "undefined") return;
  try {
    ensurePixel();
    if (typeof window.fbq !== "function") return;
    const method = custom ? "trackCustom" : "track";
    if (eventId) {
      window.fbq(method, event, payload, { eventID: eventId });
    } else {
      window.fbq(method, event, payload);
    }
  } catch {
    // ignore
  }
}

export function trackViewContent(extra: Record<string, string> = {}) {
  track("ViewContent", basePayload(extra));
}

export function trackMetaContact(eventId: string, extra: Record<string, string> = {}) {
  track("Contact", basePayload(extra), eventId);
}

export function trackMetaLead(eventId: string, extra: Record<string, string> = {}) {
  track("Lead", basePayload(extra), eventId);
}

export function trackWhatsAppClick(eventId: string, extra: Record<string, string> = {}) {
  track("WhatsAppClick", basePayload(extra), `${eventId}:wa`, true);
}

/**
 * CTA bundle: Contact + Lead + WhatsAppClick with shared event id for CAPI dedup.
 */
export function trackWhatsAppCta(eventId: string, extra: Record<string, string> = {}) {
  ensureFbcFromFbclid();
  trackMetaContact(eventId, extra);
  trackMetaLead(eventId, extra);
  trackWhatsAppClick(eventId, extra);
}
