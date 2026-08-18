"use client";

import { useActionState, useEffect, useRef } from "react";
import { createComment, type ActionState } from "@/lib/actions";

export default function CommentForm({ trackId }: { trackId: string }) {
  const action = createComment.bind(null, trackId);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <textarea
        name="content"
        required
        rows={2}
        maxLength={1000}
        placeholder="Leave feedback for the artist..."
        className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent text-sm"
      />
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-violet-600 text-white px-3 py-1.5 text-sm hover:bg-violet-700 disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
