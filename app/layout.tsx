import type { Metadata } from "next";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { ProgressProvider } from "@/lib/useProgress";
import { BusinessPlanInputProvider } from "@/lib/useBusinessPlanInput";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { PlausibleScript } from "@/components/PlausibleScript";

const DESCRIPTION =
  "A guided path from business idea to running, banked, credentialed business — free education, real tools, and a business plan built from your own answers.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: {
    default: "Business Formation Coach",
    template: "%s — Business Formation Coach",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Business Formation Coach",
    description: DESCRIPTION,
    type: "website",
    siteName: "Business Formation Coach",
  },
  twitter: {
    card: "summary",
    title: "Business Formation Coach",
    description: DESCRIPTION,
  },
};

/**
 * Deliberately minimal — no app chrome (sidebar/stage nav) here. The
 * marketing pages (/, /login, /signup) render directly under this layout,
 * full-width. The gated app experience (stages, business plan, account,
 * admin) lives under app/(app)/layout.tsx, which adds the sidebar and
 * requires a signed-in session.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleScript />
      </head>
      <body className="bg-paper text-ink min-h-screen antialiased overflow-x-hidden">
        <SessionProviderWrapper>
          <ProgressProvider>
            <BusinessPlanInputProvider>
              {children}
              <FeedbackWidget />
            </BusinessPlanInputProvider>
          </ProgressProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
