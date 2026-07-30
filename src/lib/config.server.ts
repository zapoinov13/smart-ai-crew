import process from "node:process";

// Server-only config. Read process.env INSIDE the function (Cloudflare/Vercel).

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    metaPixelId: process.env.META_PIXEL_ID ?? "2826237244414415",
    metaCapiAccessToken: process.env.META_CAPI_ACCESS_TOKEN,
  };
}
