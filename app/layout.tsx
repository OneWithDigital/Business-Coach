import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { StageNav } from "@/components/StageNav";
import { AccountNav } from "@/components/AccountNav";
import { SessionProviderWrapper } from "@/components/SessionProviderWrapper";
import { ProgressProvider } from "@/lib/useProgress";

export const metadata: Metadata = {
  title: "Business Formation Coach",
  description:
    "A guided path from business idea to running, banked, credentialed business — free education, honest recommendations, and clearly-marked affiliate links.",
};

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
            <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
              <aside className="hidden w-64 shrink-0 flex-col md:flex print:hidden">
                <Link href="/" className="mb-6 block text-lg font-bold text-slate-900">
                  Business Formation Coach
                </Link>
                <StageNav />
                <div className="mt-auto pt-6">
                  <AccountNav />
                </div>
              </aside>
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </ProgressProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
