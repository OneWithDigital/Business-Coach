"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

/** Only ever rendered inside the signed-in app zone (see app/(app)/layout.tsx). */
export function AccountNav() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return <div className="h-9" />;
  }

  return (
    <div className="space-y-1 border-t border-slate-200 pt-3">
      <Link
        href="/business-plan"
        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        Business Plan
      </Link>
      {session.user?.isAdmin && (
        <Link
          href="/admin"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Admin
        </Link>
      )}
      <Link
        href="/account"
        className="block truncate rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        {session.user?.name || session.user?.email}
      </Link>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
      >
        Log out
      </button>
    </div>
  );
}
