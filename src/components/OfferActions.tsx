"use client";

import { useTransition } from "react";
import { updateOfferStatus } from "@/lib/actions";
import { button } from "@/lib/ui";
import { CheckCircleIcon, XCircleIcon } from "@/components/icons";

export default function OfferActions({ offerId }: { offerId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => updateOfferStatus(offerId, "ACCEPTED"))}
        className={button({ variant: "success", size: "sm" })}
      >
        <CheckCircleIcon className="size-3.5" />
        Accept
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => updateOfferStatus(offerId, "DECLINED"))}
        className={button({ variant: "secondary", size: "sm" })}
      >
        <XCircleIcon className="size-3.5" />
        Decline
      </button>
    </div>
  );
}
