import type { Metadata } from "next";
import "./globals.css";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { ProgressProvider } from "@/lib/useProgress";
import { BusinessPlanInputProvider } from "@/lib/useBusinessPlanInput";
import { FeedbackWidget } from "@/components/FeedbackWidget";

export const metadata: Metadata = {
  title: "Business Formation Coach",
  description:
    "A guided path from business idea to running, banked, credentialed business — free education, honest recommendations, and clearly-marked affiliate links.",
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
