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

  async editExpense(req: NextRequest) {
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
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const expenseId = req.nextUrl.pathname.split("/").at(-1)!;
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
      const updatedExpense = await prisma.expense.update({
        where: {
          id: expenseId,
        },
        data: {
          amount: parseFloat(amount),
          date: new Date(date),
          category,
          description,
          userId,
        },
      });

      return NextResponse.json(updatedExpense);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "An error occurred while adding the expense" },
        { status: 500 },
      );
    }
  }
  async getExpenseByID(req: NextRequest) {
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
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const expenseId = req.nextUrl.pathname.split("/").at(-1)!;
    const userId = decoded.id;

    try {
      const getExpense = await prisma.expense.findUnique({
        where: {
          id: expenseId,
        },
      });

      if (getExpense?.userId !== userId) {
        return NextResponse.json(
          {
            error:
              "You are not eligible to edit the expense because you are not the owner",
          },
          { status: 401 },
        );
      }

      return NextResponse.json(getExpense);
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
