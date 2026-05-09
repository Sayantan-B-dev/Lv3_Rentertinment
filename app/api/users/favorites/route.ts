import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { connectToDatabase } from "@/lib/db/connect";
import User from "@/lib/models/User";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    await connectToDatabase();
    const user = await User.findById((session.user as any).id).populate("favorites").lean();
    
    return apiSuccess(user?.favorites || []);
  } catch (error: any) {
    return apiError(error.message || "Failed to fetch favorites", 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    const { artistId } = await request.json();
    await connectToDatabase();

    const user = await User.findById((session.user as any).id);
    if (!user) return apiError("User not found", 404);

    const index = user.favorites.indexOf(artistId);
    if (index > -1) {
      user.favorites.splice(index, 1); // Remove if exists
    } else {
      user.favorites.push(artistId); // Add if not exists
    }

    await user.save();
    return apiSuccess(user.favorites, "Favorites updated");
  } catch (error: any) {
    return apiError(error.message || "Failed to update favorites", 500);
  }
}
