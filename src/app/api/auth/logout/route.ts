import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // You may want to check if the user is already logged in before proceeding.
  // This can be done by verifying the JWT token in the request cookies.

  // Clear the JWT token from the cookies
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.delete("token");

  return response;
}
