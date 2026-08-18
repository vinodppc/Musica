"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/lib/auth";
import {
  registerSchema,
  trackSchema,
  commentSchema,
  offerSchema,
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_BYTES,
} from "@/lib/validation";

export type ActionState = { error?: string; success?: boolean } | undefined;

export async function registerUser(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Account created, but sign-in failed. Please log in." };
    }
    throw err;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}

async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function createTrack(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  if (session.user.role !== "ARTIST") {
    return { error: "Only artists can upload tracks" };
  }

  const parsed = trackSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    genre: formData.get("genre") ?? "",
    seekingHelp: formData.get("seekingHelp") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const file = formData.get("audio");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an audio file" };
  }
  if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return { error: "Unsupported audio format" };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return { error: "File is too large (max 30MB)" };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".mp3";
  const safeName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, safeName), buffer);

  const track = await prisma.track.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      genre: parsed.data.genre || null,
      seekingHelp: parsed.data.seekingHelp ?? false,
      filePath: `/uploads/${safeName}`,
      fileName: file.name,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect(`/track/${track.id}`);
}

export async function createComment(
  trackId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();

  const parsed = commentSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.comment.create({
    data: {
      content: parsed.data.content,
      trackId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/track/${trackId}`);
  return { success: true };
}

export async function createOffer(
  trackId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await requireSession();
  if (session.user.role !== "PRODUCER") {
    return { error: "Only producers can send production offers" };
  }

  const parsed = offerSchema.safeParse({ message: formData.get("message") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await prisma.productionOffer.findUnique({
    where: { trackId_producerId: { trackId, producerId: session.user.id } },
  });
  if (existing) {
    return { error: "You already sent an offer for this track" };
  }

  await prisma.productionOffer.create({
    data: {
      trackId,
      producerId: session.user.id,
      message: parsed.data.message,
    },
  });

  revalidatePath(`/track/${trackId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateOfferStatus(
  offerId: string,
  status: "ACCEPTED" | "DECLINED"
) {
  const session = await requireSession();

  const offer = await prisma.productionOffer.findUnique({
    where: { id: offerId },
    include: { track: true },
  });

  if (!offer || offer.track.userId !== session.user.id) {
    throw new Error("Not authorized to update this offer");
  }

  await prisma.productionOffer.update({
    where: { id: offerId },
    data: { status },
  });

  revalidatePath(`/track/${offer.trackId}`);
  revalidatePath("/dashboard");
}

export async function toggleFollow(targetUserId: string) {
  const session = await requireSession();
  if (session.user.id === targetUserId) return;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followedId: {
        followerId: session.user.id,
        followedId: targetUserId,
      },
    },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId: session.user.id, followedId: targetUserId },
    });
  }

  revalidatePath(`/u/${targetUserId}`);
}
