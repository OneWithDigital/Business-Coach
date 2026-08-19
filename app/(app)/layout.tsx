import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { StageNav } from "@/components/StageNav";
import { AccountNav } from "@/components/AccountNav";
import { EmailVerifyBanner } from "@/components/EmailVerifyBanner";

/**
 * Everything under this route group requires a signed-in session — the
 * whole point of the landing page is to get someone to sign up before they
 * reach any of this. Checked once, server-side, here rather than in every
 * individual page.
 */
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerifiedAt: true },
  });

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8">
      <aside className="hidden w-64 shrink-0 flex-col md:flex print:hidden">
        <Link href="/overview" className="mb-6 block text-lg font-bold text-slate-900">
          Business Formation Coach
        </Link>
        <StageNav />
        <div className="mt-auto pt-6">
          <AccountNav />
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        {user && !user.emailVerifiedAt && <EmailVerifyBanner />}
        {children}
      </main>
    </div>
  );
}
