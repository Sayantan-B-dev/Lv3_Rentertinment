import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

// ADMIN ONLY: Update inquiry status
export async function PUT(request: any, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    await connectToDatabase();
    const body = await request.json();
    const { status } = body;

    if (!["New", "Contacted", "Closed"].includes(status)) {
      return apiError("Invalid status", 400);
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
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
export async function DELETE(request: any, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    await connectToDatabase();
    const inquiry = await Inquiry.findByIdAndDelete(id);
    
    if (!inquiry) return apiError("Inquiry not found", 404);

    return apiSuccess(null, "Inquiry deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete inquiry", 500);
  }
}
