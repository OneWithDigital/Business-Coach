import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

export interface AdminSession {
  user: { id: string; email: string };
}

/** Returns the session if the caller is an admin, or a ready-to-return 401/403 NextResponse otherwise. */
export async function requireAdmin(): Promise<AdminSession | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return { user: { id: session.user.id, email: session.user.email ?? "" } };
}
