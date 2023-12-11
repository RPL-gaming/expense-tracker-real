import { MidtransClient } from "midtrans-node-client";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { isTokenValid } from "../../../../utils/auth/is-token-valid";

// POST /api/midtrans (create a transaction)
export async function POST(req: NextRequest, res: NextResponse) {
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

  // Initialize Midtrans client
  const snap = new MidtransClient.Snap({
    isProduction: true, // Change to true in production environment
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });

  const requestBody = await req.json();

  // Create transaction parameters
  const parameter = {
    transaction_details: {
      order_id: uuidv4(),
      gross_amount: requestBody.gross_amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: decoded.email,
      email: decoded.email,
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the transaction" },
      { status: 500 },
    );
  }
}
