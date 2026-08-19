import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Everything we hold on the signed-in user, as a downloadable JSON file — never their password hash. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      stageProgress: true,
      businessProfile: true,
      businessPlanInput: true,
      businessPlanDocument: true,
      feedback: true,
      planReviewOrders: true,
    },
  });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  const { hashedPassword: _hashedPassword, ...safeUser } = user;

  return new NextResponse(JSON.stringify(safeUser, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="business-formation-coach-data-${user.id}.json"`,
    },
  });
}
