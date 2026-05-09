import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { updateArtist, deleteArtist } from "@/lib/services/artistService";
import { artistSchemaValidation } from "@/lib/utils/validators";
import { apiSuccess, apiError } from "@/lib/utils/apiResponse";

export async function PUT(request: any, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    const body = await request.json();
    const parsedData = artistSchemaValidation.parse(body);
    
    const artist = await updateArtist(id, parsedData);
    return apiSuccess(artist, "Artist updated successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to update artist", 400);
  }
}

export async function DELETE(request: any, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
    const session = await getServerSession(authOptions);
    if (!session) return apiError("Unauthorized", 401);

    const result = await deleteArtist(id);
    if (!result) return apiError("Artist not found", 404);

    return apiSuccess(null, "Artist deleted successfully");
  } catch (error: any) {
    return apiError(error.message || "Failed to delete artist", 500);
  }
}
