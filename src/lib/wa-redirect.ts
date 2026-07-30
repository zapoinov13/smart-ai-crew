/** WhatsApp redirect with ad attribution via ref: line (bot creates CRM lead). */

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

/** Open WhatsApp bot with attribution ref (no form, no hub). */
export function openWhatsAppAccess(): void {
  if (typeof window === "undefined") return;
  window.location.href = buildWaUrl(window.location.search);
}
