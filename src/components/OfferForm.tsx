"use client";

import { useActionState } from "react";
import { createOffer, type ActionState } from "@/lib/actions";
import { input, button, badge } from "@/lib/ui";
import { CheckCircleIcon } from "@/components/icons";

export default function OfferForm({ trackId }: { trackId: string }) {
  const action = createOffer.bind(null, trackId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  if (state?.success) {
    return (
      <p className={badge("success")}>
        <CheckCircleIcon className="size-3.5" />
        Your offer was sent to the artist.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <textarea
        name="message"
        required
        rows={3}
        maxLength={1000}
        placeholder="Introduce yourself and explain how you could help produce this track..."
        className={input("text-sm")}
      />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className={button({ variant: "secondary", size: "sm", className: "self-start" })}>
        {pending ? "Sending..." : "Offer production help"}
      </button>
    </form>
  );
}
