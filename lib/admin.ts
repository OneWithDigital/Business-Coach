/**
 * Admin access is granted by email, via the ADMIN_EMAILS env var
 * (comma-separated) — no DB flag, no separate admin-signup flow. Add or
 * remove an admin by editing .env and restarting, same as any other config.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS;
  if (!raw) return false;
  const admins = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.trim().toLowerCase());
}
