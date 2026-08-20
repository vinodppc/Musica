"use client";

import { useTransition } from "react";
import { toggleFollow } from "@/lib/actions";

export default function FollowButton({
  targetUserId,
  isFollowing,
}: {
  targetUserId: string;
  isFollowing: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleFollow(targetUserId))}
      className={
        isFollowing
          ? "rounded-md border border-black/10 dark:border-white/20 px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-60"
          : "rounded-md bg-violet-600 text-white px-3 py-1.5 text-sm hover:bg-violet-700 disabled:opacity-60"
      }
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
