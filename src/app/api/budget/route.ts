import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";

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

  const { amount, date } = await req.json();
  const userId = decoded.id;

  if (!amount || !date || !userId) {
    return NextResponse.json(
      { error: "Incomplete data provided" },
      { status: 400 },
    );
  }

  try {
    const parsedDate = new Date(date);
    const month = parsedDate.getMonth() + 1;

    const existingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
      },
    });

    let newBudget;

    if (existingBudget) {
      // If budget for the current month already exists, update it by incrementing the amount
      newBudget = await prisma.budget.update({
        where: {
          id: existingBudget.id,
        },
        data: {
          amount: existingBudget.amount + parseFloat(amount),
        },
      });
    } else {
      // If budget for the current month doesn't exist, create a new budget
      newBudget = await prisma.budget.create({
        data: {
          amount: parseFloat(amount),
          date: new Date(date),
          userId: userId,
        },
      });
    }
    return NextResponse.json(newBudget);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while setting the budget" },
      { status: 500 },
    );
  }
}
