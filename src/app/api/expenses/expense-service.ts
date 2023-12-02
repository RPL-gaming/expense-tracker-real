import { NextRequest, NextResponse } from "next/server";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";
import prisma from "../../../../lib/prisma";

class ExpenseService {
  async addExpense(req: NextRequest) {
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

    const { amount, date, category, description } = await req.json();
    const userId = decoded.id;

    // Validate data before saving
    if (!amount || !date || !category || !userId) {
      return NextResponse.json(
        { error: "Incomplete data provided" },
        { status: 400 },
      );
    }

    try {
      const newExpense = await prisma.expense.create({
        data: {
          amount: parseFloat(amount),
          date: new Date(date),
          category,
          description,
          userId: userId,
        },
      });

      return NextResponse.json(newExpense);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "An error occurred while adding the expense" },
        { status: 500 },
      );
    }
  }
}

export default ExpenseService;
