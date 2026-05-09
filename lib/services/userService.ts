import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db/connect";
import mongoose from "mongoose";

export async function getUserFavorites(userId: string) {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return [];
  }
  await connectToDatabase();
  const user = await User.findById(userId).select("favorites").lean();
  return user?.favorites?.map((f: any) => f.toString()) || [];
}
