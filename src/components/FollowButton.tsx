"use client";

import { useTransition } from "react";
import { toggleFollow } from "@/lib/actions";
import { button } from "@/lib/ui";

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
      className={button({ variant: isFollowing ? "secondary" : "primary", size: "sm" })}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
