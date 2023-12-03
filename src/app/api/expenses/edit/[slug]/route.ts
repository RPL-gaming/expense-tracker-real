import { NextRequest, NextResponse } from "next/server";
import ExpenseService from "../../expense-service";

export async function PUT(req: NextRequest) {
  const expenseService = new ExpenseService();
  const response = await expenseService.editExpense(req);
  return response;
}
