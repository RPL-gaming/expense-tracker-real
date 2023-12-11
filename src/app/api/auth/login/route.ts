import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";
export async function POST(request: NextRequest) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Invalid content-type. Must be application/json" },
      { status: 400 },
    );
  }

  const { email, password } = await request.json();

  // Validate user input
  if (!password || !email) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  // Create a JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, isAdvisor: user.isAdvisor },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  ); // You should use a more secure secret

  const response = NextResponse.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
  });
  return response;
}
