import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { connectToDatabase } from "@/lib/db/connect";
import Artist from "@/lib/models/Artist";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    await connectToDatabase();

    const [totalArtists, totalInquiries, newInquiries, contactedInquiries, closedInquiries, recentInquiries] = await Promise.all([
      Artist.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: "New" }),
      Inquiry.countDocuments({ status: "Contacted" }),
      Inquiry.countDocuments({ status: "Closed" }),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const stats = {
      artists: { total: totalArtists },
      inquiries: {
        total: totalInquiries,
        byStatus: {
          New: newInquiries,
          Contacted: contactedInquiries,
          Closed: closedInquiries
        },
        recent: recentInquiries
      }
    };

    return apiSuccess(stats);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch dashboard stats", 500);
  }
}
