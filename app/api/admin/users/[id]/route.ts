import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  if (params.id === admin.user.id) {
    return NextResponse.json({ error: "You can't delete your own account from here." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: params.id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}
