import Script from "next/script";

/** Renders nothing until NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set — no analytics account required to run this app. */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
