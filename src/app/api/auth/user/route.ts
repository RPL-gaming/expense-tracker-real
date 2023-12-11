import { NextRequest, NextResponse } from "next/server";
import { isTokenValid } from "../../../../../utils/auth/is-token-valid";

export async function GET(req: NextRequest) {
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

  const userId = decoded.id;
  const isAdvisor = decoded.isAdvisor;

  return NextResponse.json(
    {
      userId,
      isAdvisor,
    },
    { status: 200 },
  );
}
