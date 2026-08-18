"use client";

import { useTransition } from "react";
import { updateOfferStatus } from "@/lib/actions";

export default function OfferActions({ offerId }: { offerId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => updateOfferStatus(offerId, "ACCEPTED"))}
        className="rounded-md bg-green-600 text-white px-3 py-1 text-xs hover:bg-green-700 disabled:opacity-60"
      >
        Accept
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => updateOfferStatus(offerId, "DECLINED"))}
        className="rounded-md border border-black/10 dark:border-white/20 px-3 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-60"
      >
        Decline
      </button>
    </div>
  );
}
