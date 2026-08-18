"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(registerUser, undefined);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-black/60 dark:text-white/60 mb-6">
        Join as an artist to share your music, or a producer to help others finish theirs.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="name"
            required
            className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
          />
        </label>

        <fieldset className="flex flex-col gap-2 text-sm">
          <legend className="mb-1">I am a...</legend>
          <label className="flex items-center gap-2 rounded-md border border-black/10 dark:border-white/20 px-3 py-2 cursor-pointer">
            <input type="radio" name="role" value="ARTIST" defaultChecked />
            Artist — I make music and want to share it
          </label>
          <label className="flex items-center gap-2 rounded-md border border-black/10 dark:border-white/20 px-3 py-2 cursor-pointer">
            <input type="radio" name="role" value="PRODUCER" />
            Producer — I want to discover artists and help produce their music
          </label>
        </fieldset>

        {state?.error && (
          <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-violet-600 text-white px-4 py-2 hover:bg-violet-700 disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-600 dark:text-violet-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
