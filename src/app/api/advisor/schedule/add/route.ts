import { NextRequest, NextResponse } from 'next/server';
import { isTokenValid } from '../../../../../../utils/auth/is-token-valid';
import prisma from '../../../../../../lib/prisma';
import { differenceInHours, parseISO } from 'date-fns';

export async function POST(req: NextRequest) {
  if (req.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Invalid content-type. Must be application/json" },
      { status: 400 },
    );
  }

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

  const { dateTime } = await req.json();
  const userId = decoded.id;
  const isAdvisor = decoded.isAdvisor;

  // Validate data before saving
  if (!dateTime || !userId) {
    return NextResponse.json(
      { error: "Incomplete data provided" },
      { status: 400 },
    );
  }

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

  // Check if new schedule clash with others
  const schedules = await prisma.schedule.findMany({ where: { advisorId: user.id } });
  if (schedules) {
    for (let i = 0; i < schedules.length; i++) {
      // New Schedule is invalid if within 2 hours from existing schedule
      if (Math.abs(differenceInHours(schedules[i].dateTime, new Date(dateTime))) < 2) {
        return NextResponse.json({ error: "New schedule clash with existing schedule" }, { status: 400 });
      }
    }
  }

  try {
    const newSchedule = await prisma.schedule.create({
      data: {
        dateTime: new Date(dateTime),
        advisorId: user.id
      },
    });

    return NextResponse.json(newSchedule);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while adding the new schedule" },
      { status: 500 },
    );
  }
}
