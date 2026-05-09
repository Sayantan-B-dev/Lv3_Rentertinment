import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { status, notes } = await request.json();
    await connectToDatabase();
    
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { $set: { status, notes } },
      { new: true }
    );

    if (!updatedInquiry) return apiError("Inquiry not found", 404);
    
    return apiSuccess(updatedInquiry);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();
    await Inquiry.findByIdAndDelete(id);
    return apiSuccess({ message: "Inquiry deleted successfully" });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
