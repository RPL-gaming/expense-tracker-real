import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../../lib/prisma";
import { isTokenValid } from "../../../../../../utils/auth/is-token-valid";

export async function DELETE(req: NextRequest) {
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
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Missing parameter ID" }, { status: 403 });
  }

  // Validate only advisor
  if (!isAdvisor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Find Advisor
  const user = await prisma.financialAdvisor.findUnique({ where: { userId } });
  if (!user) {
    return NextResponse.json({ error: "Advisor not found" }, { status: 404 });
  }
  
  // Find Schedule
  const schedule = await prisma.schedule.findUnique({ where: { id } });
  if (!schedule) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  try {
    const oldSchedule = await prisma.schedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while adding the expense" },
      { status: 500 },
    );
  }
}
