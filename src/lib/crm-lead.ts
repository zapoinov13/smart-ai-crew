import { captureAttribution, getAttribution, getUtms } from "@/lib/wa-registration";

export const CRM_WEBHOOK_URL =
  "https://szfgdruhlebfvcmlvxdk.supabase.co/functions/v1/lead-intake";
/** MarkVision AI CRM project token */
export const CRM_PROJECT_TOKEN = "MkcXbUBfd7ObDBy7";

export type CrmLeadInput = {
  name: string;
  phone: string;
  /** Honeypot — if filled, skip send */
  company?: string;
  email?: string;
  message?: string;
};

/**
 * Send lead to MarkVision CRM (project «MarkVision AI», stage «Новая»).
 * Returns false on network/API failure; true if accepted or honeypot.
 */
export async function sendCrmLead(input: CrmLeadInput): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Bot honeypot
  if (input.company?.trim()) return true;

  captureAttribution();
  const att = getAttribution();
  const utms = getUtms();

  // Mirror UTM keys for CRM snippet compatibility
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const value = utms[key];
    if (value) {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // ignore
      }
    }
  }

  const payload: Record<string, string> = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    token: CRM_PROJECT_TOKEN,
    referrer: document.referrer || att.entry_referrer || "",
    landing_url: att.entry_page || window.location.href,
    source: "site",
    ...utms,
  };

  if (input.email?.trim()) payload.email = input.email.trim();
  if (input.message?.trim()) payload.message = input.message.trim();
  if (att.fbclid) payload.fbclid = att.fbclid;
  if (att.gclid) payload.gclid = att.gclid;

  try {
    const response = await fetch(CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
