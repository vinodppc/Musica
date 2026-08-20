"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { createTrack } from "@/lib/actions";
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_BYTES } from "@/lib/validation";

export default function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, startSaving] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("audio") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError("Please choose an audio file");
      return;
    }
    if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
      setError("Unsupported audio format");
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      setError("File is too large (max 30MB)");
      return;
    }

    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      const formData = new FormData(form);
      formData.set("audioUrl", blob.url);
      formData.set("audioFileName", file.name);

      startSaving(async () => {
        const result = await createTrack(formData);
        if ("error" in result) {
          setError(result.error);
        } else {
          router.push(`/track/${result.trackId}`);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const pending = uploading || saving;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          name="title"
          required
          maxLength={120}
          className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Genre (optional)
        <input
          name="genre"
          maxLength={40}
          placeholder="Hip-Hop, Lo-fi, Rock..."
          className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Description (optional)
        <textarea
          name="description"
          rows={3}
          maxLength={2000}
          className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Audio file
        <input
          type="file"
          name="audio"
          required
          accept="audio/*"
          className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent file:mr-3 file:rounded file:border-0 file:bg-violet-600 file:text-white file:px-3 file:py-1.5 file:cursor-pointer"
        />
        <span className="text-xs text-black/50 dark:text-white/50">
          MP3, WAV, OGG, FLAC, AAC — up to 30MB
        </span>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="seekingHelp" />
        I&apos;m seeking production help on this track
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-violet-600 text-white px-4 py-2 hover:bg-violet-700 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : saving ? "Saving..." : "Upload track"}
      </button>
    </form>
  );
}
