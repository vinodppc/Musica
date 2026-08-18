"use client";

import { useActionState } from "react";
import { createOffer, type ActionState } from "@/lib/actions";

export default function OfferForm({ trackId }: { trackId: string }) {
  const action = createOffer.bind(null, trackId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  if (state?.success) {
    return (
      <p className="text-sm text-green-700 dark:text-green-400">
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
        className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent text-sm"
      />
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-amber-600 text-white px-3 py-1.5 text-sm hover:bg-amber-700 disabled:opacity-60"
      >
        {pending ? "Sending..." : "Offer production help"}
      </button>
    </form>
  );
}
