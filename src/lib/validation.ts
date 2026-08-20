import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  role: z.enum(["ARTIST", "PRODUCER"]),
});

export const trackSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  genre: z.string().trim().max(40).optional().or(z.literal("")),
  seekingHelp: z.boolean().optional(),
  audioUrl: z.string().trim().url("Missing uploaded audio file"),
  audioFileName: z.string().trim().min(1).max(255),
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, "Comment can't be empty").max(1000),
});

export const offerSchema = z.object({
  message: z.string().trim().min(1, "Add a short message").max(1000),
});

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
  "audio/mp4",
  "audio/aac",
  "audio/webm",
];

export const MAX_AUDIO_BYTES = 30 * 1024 * 1024; // 30MB
