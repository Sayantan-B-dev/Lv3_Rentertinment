import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db/connect";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ ok: true, message: "Database connection successful" });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
