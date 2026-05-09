import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import Artist from "@/lib/models/Artist";
import Inquiry from "@/lib/models/Inquiry";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    await connectToDatabase();
    
    const [totalArtists, mediaStats, totalInquiries] = await Promise.all([
      Artist.countDocuments(),
      Artist.aggregate([
        {
          $group: {
            _id: null,
            totalImages: { $sum: { $size: { $ifNull: ["$media.images", []] } } },
            totalVideos: { $sum: { $size: { $ifNull: ["$media.videos", []] } } }
          }
        }
      ]),
      Inquiry.countDocuments()
    ]);

    return apiSuccess({
      totalArtists,
      totalImages: mediaStats[0]?.totalImages || 0,
      totalVideos: mediaStats[0]?.totalVideos || 0,
      totalInquiries: totalInquiries || 0
    });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

import mongoose from "mongoose";
