import type { MetadataRoute } from "next";

/**
 * Only lists what's actually reachable by an anonymous crawler. Everything
 * past the landing page requires a signed-in session (see
 * app/(app)/layout.tsx), so there's no stage/business-plan content to list
 * here — if that ever changes (e.g. un-gating some stages for SEO), add
 * those URLs here too.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/signup`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.1 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
