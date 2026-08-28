"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { input, label as labelClass, button, card } from "@/lib/ui";
import { LogoMark } from "@/components/icons";

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
      <div className="flex justify-center mb-6">
        <LogoMark className="size-10" />
      </div>
      <h1 className="text-2xl font-bold text-center">Welcome back</h1>
      <p className="text-muted text-center mt-1.5">Log in to keep sharing and connecting.</p>

      <form onSubmit={handleSubmit} className={card("mt-6 p-6 flex flex-col gap-4")}>
        <label className={labelClass()}>
          Email
          <input type="email" name="email" required className={input()} />
        </label>

        <label className={labelClass()}>
          Password
          <input type="password" name="password" required className={input()} />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button type="submit" disabled={pending} className={button({ className: "mt-1" })}>
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
