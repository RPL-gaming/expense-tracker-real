import prisma from "../../../../lib/prisma";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    let decoded;
  
    if (token) {
      decoded = isTokenValid(token);
  
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
  
    const userId = decoded.id;
  
    try {
        let expenses
        let budget
        
        expenses = await prisma.expense.findMany({
            where: {
              userId: userId,
            },
          });
    
        budget = await prisma.budget.findFirst({
            where: {
            userId: userId,
            },
        });
  
        const totalExpenseAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
        return NextResponse.json({
            expenses: expenses,
            budget: budget ? budget : 0,
            totalExpenseAmount: totalExpenseAmount
        });
        } 
  
    catch (error) {
      return NextResponse.json({ error: 'An error occurred while fetching expenses' }, { status: 500 });
    }
  }