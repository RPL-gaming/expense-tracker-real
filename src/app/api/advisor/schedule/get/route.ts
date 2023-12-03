import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';
import { isTokenValid } from '../../../../../../utils/auth/is-token-valid';

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  let decoded;
  if (token) {
    decoded = isTokenValid(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
  } else {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const userId = decoded.id;
  const isAdvisor = decoded.isAdvisor;

  // Validate only advisor
  if (!isAdvisor) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    )
  }

  // Find Advisor
  const user = await prisma.financialAdvisor.findUnique({ where: { userId } });
  if (!user) {
    return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
  }

  try {
    const newSchedule = await prisma.schedule.findMany({ where: { advisorId: user.id } });

    return NextResponse.json(newSchedule);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while adding the expense" },
      { status: 500 },
    );
  }
}