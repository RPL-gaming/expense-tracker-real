import { NextRequest, NextResponse } from "next/server";
import { createGoogleMeetEvent } from "../../../../utils/googleCalendar";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";
import prisma from "../../../../lib/prisma";

// POST /api/meeting (create a meeting)
export async function POST(req: NextRequest) {
  // Handle authentication
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

  const body = await req.json();
  const customer_email = decoded.email;
  const advisor_email = body.advisorEmail;
  const advisor_name = body.advisorName;
  const schedule = body.schedule;

  try {
    const meetUrl = await createGoogleMeetEvent(
      customer_email,
      advisor_email,
      advisor_name,
        schedule,
    );
    if (meetUrl) {
      const newAppointment = await prisma.appointment.create({
        data: {
          dateTime: schedule,
          userId: decoded.id,
          advisorId: body.advisorId,
        },
      });

      await prisma.schedule.deleteMany({
        where: {
          AND: [
            { id: body.scheduleId },
            { advisorId: body.advisorId },
          ],
        },
      });

      return NextResponse.json({ success: true, meetingDetails: { meetUrl } });
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to create meeting",
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
