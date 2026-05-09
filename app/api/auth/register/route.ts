import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/models/User";
import { sendVerificationEmail } from "@/lib/utils/email";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: Request) {
  try {
    const { name, email, password, username } = await request.json();

    if (!email || !password || !username) {
      return apiError("Missing required fields", 400);
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] 
    });

    if (existingUser) {
      return apiError("User with this email or username already exists", 400);
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
      role: "user"
    });

    await sendVerificationEmail(newUser.email, verificationCode);

    return apiSuccess({ email: newUser.email }, "Verification code sent to your email", 201);
  } catch (error: any) {
    return apiError(error.message || "Registration failed", 500);
  }
}
