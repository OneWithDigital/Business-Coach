import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/requireAdmin";
import { AFFILIATE_LINKS, getAffiliateUrl } from "@/lib/affiliateLinks";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const overrides = await prisma.affiliateOverride.findMany();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));

  const links = AFFILIATE_LINKS.map((link) => {
    const override = overrideMap.get(link.id);
    if (override) {
      return { id: link.id, name: link.name, category: link.category, url: override.url, source: "override" as const };
    }
    const envUrl = getAffiliateUrl(link);
    return {
      id: link.id,
      name: link.name,
      category: link.category,
      url: envUrl ?? "",
      source: envUrl ? ("env" as const) : ("none" as const),
    };
  });

  return NextResponse.json({ links });
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (admin instanceof NextResponse) return admin;

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  const url = typeof body?.url === "string" ? body.url.trim() : null;
  if (!id || !AFFILIATE_LINKS.some((l) => l.id === id)) {
    return NextResponse.json({ error: "Unknown affiliate link id." }, { status: 400 });
  }

  if (!url) {
    // Blank clears the override and reverts to the env var fallback.
    await prisma.affiliateOverride.deleteMany({ where: { id } });
    const link = AFFILIATE_LINKS.find((l) => l.id === id)!;
    const envUrl = getAffiliateUrl(link);
    return NextResponse.json({
      id,
      url: envUrl ?? "",
      source: envUrl ? "env" : "none",
    });
  }

  const saved = await prisma.affiliateOverride.upsert({
    where: { id },
    create: { id, url },
    update: { url },
  });

  return NextResponse.json({ id: saved.id, url: saved.url, source: "override" });
}
