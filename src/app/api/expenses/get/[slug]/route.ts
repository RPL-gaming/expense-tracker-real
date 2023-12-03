import { NextRequest, NextResponse } from "next/server";
import ExpenseService from "../../expense-service";

export async function GET(req: NextRequest) {
  const expenseService = new ExpenseService();
  const response = await expenseService.getExpenseByID(req);
  return response;
}
