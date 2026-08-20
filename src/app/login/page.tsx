"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-black/60 dark:text-white/60 mb-6">
        Log in to keep sharing and connecting.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="rounded-md border border-black/10 dark:border-white/20 px-3 py-2 bg-transparent"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-violet-600 text-white px-4 py-2 hover:bg-violet-700 disabled:opacity-60"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-violet-600 dark:text-violet-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
