"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { createTrack } from "@/lib/actions";
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_BYTES } from "@/lib/validation";
import { input, label as labelClass, button, card } from "@/lib/ui";
import { UploadIcon } from "@/components/icons";

export default function UploadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
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
    <form onSubmit={handleSubmit} className={card("p-6 flex flex-col gap-4")}>
      <label className={labelClass()}>
        Title
        <input name="title" required maxLength={120} className={input()} />
      </label>

      <label className={labelClass()}>
        Genre (optional)
        <input name="genre" maxLength={40} placeholder="Hip-Hop, Lo-fi, Rock..." className={input()} />
      </label>

      <label className={labelClass()}>
        Description (optional)
        <textarea name="description" rows={3} maxLength={2000} className={input()} />
      </label>

      <div className={labelClass()}>
        Audio file
        <label
          htmlFor="audio-input"
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-8 text-center cursor-pointer hover:border-primary/50 hover:bg-surface-hover transition-colors"
        >
          <UploadIcon className="size-6 text-muted" />
          <span className="text-sm">
            {fileName ? (
              <span className="font-medium">{fileName}</span>
            ) : (
              <>
                <span className="text-primary font-medium">Choose a file</span> or drag it here
              </>
            )}
          </span>
          <span className="text-xs text-muted">MP3, WAV, OGG, FLAC, AAC — up to 30MB</span>
        </label>
        <input
          id="audio-input"
          type="file"
          name="audio"
          required
          accept="audio/*"
          className="sr-only"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="seekingHelp" className="size-4 rounded border-border accent-[var(--primary)]" />
        I&apos;m seeking production help on this track
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button type="submit" disabled={pending} className={button({ className: "mt-1" })}>
        {uploading ? "Uploading..." : saving ? "Saving..." : "Upload track"}
      </button>
    </form>
  );
}
