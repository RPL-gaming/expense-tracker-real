import prisma from "../../../../lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";

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

    const { advisorId, amount } = await req.json();

    try {
        const newTransaction = await prisma.transaction.create({
            data: {
                amount: amount,
                status: 'successful',
                advisorId: advisorId,
                userId: decoded.id,
            },
        });

        return NextResponse.json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
    }
}
