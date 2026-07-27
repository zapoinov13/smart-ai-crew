export const META_PIXEL_ID = "2826237244414415";

export const META_PIXEL_INIT_SCRIPT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`.trim();

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Fire Meta Lead after form submit (name/phone).
 * eventID ties to WA code when available for dedup with CAPI later.
 */
export function trackMetaLead(eventId?: string, extra: Record<string, string> = {}) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
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
