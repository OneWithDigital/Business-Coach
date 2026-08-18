"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function AccountNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9" />;
  }

  if (!session) {
    return (
      <div className="space-y-1 border-t border-slate-200 pt-3">
        <Link
          href="/login"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Sign up to save progress
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1 border-t border-slate-200 pt-3">
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
