import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { inquirySchemaValidation } from "@/lib/utils/validators";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

// PUBLIC: Submit a new inquiry
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsedData = inquirySchemaValidation.parse(body);
    
    const inquiry = await Inquiry.create(parsedData);
    return apiSuccess(inquiry, "Inquiry submitted successfully", 201);
  } catch (error: any) {
    return apiError(error.message || "Failed to submit inquiry", 400);
  }
}

// ADMIN ONLY: List all inquiries
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
    return apiSuccess(inquiries);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch inquiries", 500);
  }
}
