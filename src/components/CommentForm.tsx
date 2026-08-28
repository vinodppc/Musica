"use client";

import { useActionState, useEffect, useRef } from "react";
import { createComment, type ActionState } from "@/lib/actions";
import { input, button } from "@/lib/ui";

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
        className={input("text-sm")}
      />
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
      <button type="submit" disabled={pending} className={button({ size: "sm", className: "self-start" })}>
        {pending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
