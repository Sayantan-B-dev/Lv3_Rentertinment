import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    
    let filter: any = {};
    if (q) {
      filter = {
        $or: [
          { clientName: { $regex: q, $options: "i" } },
          { clientEmail: { $regex: q, $options: "i" } },
          { artistName: { $regex: q, $options: "i" } }
        ]
      };
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();
    return apiSuccess(inquiries);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const { ids } = await request.json();
    await connectToDatabase();
    await Inquiry.deleteMany({ _id: { $in: ids } });
    
    return apiSuccess({ message: "Inquiries deleted successfully" });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
