import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/models/User";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return apiError("Email and code are required", 400);
    }

    await connectToDatabase();

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() }
    });

    if (!user) {
      return apiError("Invalid or expired verification code", 400);
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return apiSuccess(null, "Email verified successfully. You can now log in.");
  } catch (error: any) {
    return apiError(error.message || "Verification failed", 500);
  }
}
