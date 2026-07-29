import { captureAttribution, getAttribution, getUtms } from "@/lib/wa-registration";

export const CRM_WEBHOOK_URL =
  "https://szfgdruhlebfvcmlvxdk.supabase.co/functions/v1/lead-intake";
/** MarkVision AI CRM project token */
export const CRM_PROJECT_TOKEN = "MkcXbUBfd7ObDBy7";

export type CrmLeadInput = {
  name: string;
  phone: string;
  /** Honeypot — if filled, skip send */
  honeypot?: string;
  email?: string;
  message?: string;
};

/** Normalize KZ/RU phones to +7XXXXXXXXXX when possible. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return phone.trim();
  if (digits.length === 11 && digits.startsWith("8")) return `+7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith("7")) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  if (phone.trim().startsWith("+")) return `+${digits}`;
  return phone.trim();
}

/**
 * Send lead to MarkVision CRM (project «MarkVision AI», stage «Новая»).
 * Returns false on network/API failure; true if accepted or honeypot.
 */
export async function sendCrmLead(input: CrmLeadInput): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Bot honeypot (do not use name="company" — browsers autofill it)
  if (input.honeypot?.trim()) return true;

  captureAttribution();
  const att = getAttribution();
  const utms = getUtms();

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
    phone: normalizePhone(input.phone),
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
      keepalive: true,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.warn("[crm-lead] rejected", response.status, text.slice(0, 200));
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[crm-lead] network error", err);
    return false;
  }
}
