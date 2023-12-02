import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { isTokenValid } from "../../../../../utils/auth/is-token-valid";

// GET /api/advisor/[id] (get advisor by ID)
export async function GET(req: NextRequest) {
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

  const id = req.nextUrl.pathname.split("/").at(-1);

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  // Fetch advisor
  try {
    const advisor = await prisma.financialAdvisor.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(advisor);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching the advisor" },
      { status: 500 },
    );
  }
}
