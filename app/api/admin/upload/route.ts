import { NextRequest, NextResponse } from "next/server";
import ImageKit, { toFile } from "@imagekit/nodejs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "/uploads";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadResponse = await imagekit.files.upload({
      file: await toFile(buffer, file.name),
      fileName: file.name,
      folder: folder,
      useUniqueFileName: true,
    });

    return NextResponse.json({ 
      success: true, 
      filePath: uploadResponse.filePath,
      url: uploadResponse.url 
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
