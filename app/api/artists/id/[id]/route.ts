import { NextResponse } from "next/server";
import { getArtistById, updateArtist, deleteArtist } from "@/lib/services/artistService";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const artist = await getArtistById(id);
    if (!artist) return apiError("Artist not found", 404);
    return apiSuccess(artist);
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return apiError("Unauthorized", 401);
    }

    const data = await request.json();
    const artist = await updateArtist(id, data);
    return apiSuccess(artist);
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

    await deleteArtist(id);
    return apiSuccess({ message: "Artist deleted successfully" });
  } catch (error: any) {
    return apiError(error.message, 500);
  }
}
