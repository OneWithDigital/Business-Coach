import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything under here requires a signed-in session (see
      // app/(app)/layout.tsx) — a crawler hitting these just gets bounced
      // to /login, so keep it out of the crawl budget entirely.
      disallow: ["/api/", "/overview", "/stage/", "/business-plan", "/account", "/admin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
