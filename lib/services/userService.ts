import User from "@/lib/models/User";
import { connectToDatabase } from "@/lib/db/connect";

export async function getUserFavorites(userId: string) {
  await connectToDatabase();
  const user = await User.findById(userId).select("favorites").lean();
  return user?.favorites?.map((f: any) => f.toString()) || [];
}
