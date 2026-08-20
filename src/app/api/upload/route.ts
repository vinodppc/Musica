import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_BYTES } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user || session.user.role !== "ARTIST") {
          throw new Error("Only artists can upload tracks");
        }

        return {
          allowedContentTypes: ALLOWED_AUDIO_TYPES,
          maximumSizeInBytes: MAX_AUDIO_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Track rows are created by the client after upload() resolves,
        // once it has the final blob URL to hand to createTrack.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
