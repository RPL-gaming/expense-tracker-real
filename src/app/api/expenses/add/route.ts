import { NextRequest, NextResponse } from "next/server";
import ExpenseService from "../expense-service";

export async function POST(req: NextRequest) {
    const expenseService = new ExpenseService();
    const response = await expenseService.addExpense(req);
    return response;
}