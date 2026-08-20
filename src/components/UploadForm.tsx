"use client";

import { useActionState } from "react";
import { createTrack } from "@/lib/actions";

export default function UploadForm() {
  const [state, formAction, pending] = useActionState(createTrack, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
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

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-violet-600 text-white px-4 py-2 hover:bg-violet-700 disabled:opacity-60"
      >
        {pending ? "Uploading..." : "Upload track"}
      </button>
    </form>
  );
}
