export const META_PIXEL_ID = "2826237244414415";

const PIXEL_BOOTSTRAP = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

/** @deprecated use META_PIXEL_DEFERRED_LOADER */
export const META_PIXEL_INIT_SCRIPT = PIXEL_BOOTSTRAP;

/**
 * Defer Pixel until idle / first interaction so it does not block LCP.
 */
export const META_PIXEL_DEFERRED_LOADER = `(function(){if(window.__mvPixelScheduled)return;window.__mvPixelScheduled=1;function load(){if(window.__mvPixelLoaded)return;window.__mvPixelLoaded=1;${PIXEL_BOOTSTRAP}}function arm(){if(window.__mvPixelArmed)return;window.__mvPixelArmed=1;if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:2500});else setTimeout(load,1200)}if(document.readyState==='complete')arm();else window.addEventListener('load',arm,{once:true});['scroll','pointerdown','keydown','touchstart'].forEach(function(e){window.addEventListener(e,load,{once:true,passive:true})})})();`;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __mvPixelScheduled?: number;
    __mvPixelLoaded?: number;
    __mvPixelArmed?: number;
  }
}

function ensurePixel() {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") return;
  try {
    // eslint-disable-next-line no-new-func
    new Function(PIXEL_BOOTSTRAP)();
  } catch {
    // ignore
  }
}

/**
 * Fire Meta Lead (WA CTA click).
 * Ensures pixel bootstrap ran; queues if script still loading.
 */
export function trackMetaLead(eventId?: string, extra: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  try {
    ensurePixel();
    if (typeof window.fbq !== "function") return;
    const payload = {
      content_name: "workshop-marketologi",
      segment: "marketologi",
      ...extra,
    };
    if (eventId) {
      window.fbq("track", "Lead", payload, { eventID: eventId });
    } else {
      window.fbq("track", "Lead", payload);
    }
  } catch {
    // ignore
  }
}
