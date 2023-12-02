import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";
import prisma from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  if (request.headers.get("content-type") !== "application/json") {
    return NextResponse.json(
      { error: "Invalid content-type. Must be application/json" },
      { status: 400 },
    );
  }
  const { email, password, username } = await request.json();

  // Validate user input
  if (!username || !password || !email) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
