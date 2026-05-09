import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

// ADMIN ONLY: Update inquiry status
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    await connectDB();
    const body = await request.json();
    const { status } = body;

    if (!["New", "Contacted", "Closed"].includes(status)) {
      return apiError("Invalid status", 400);
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!inquiry) return apiError("Inquiry not found", 404);

    return apiSuccess(inquiry, "Status updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update inquiry", 500);
  }
}

// ADMIN ONLY: Delete inquiry
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    await connectDB();
    const inquiry = await Inquiry.findByIdAndDelete(params.id);
    
    if (!inquiry) return apiError("Inquiry not found", 404);

    return apiSuccess(null, "Inquiry deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete inquiry", 500);
  }
}
