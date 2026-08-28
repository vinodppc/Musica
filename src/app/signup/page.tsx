"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/lib/actions";
import { input, label as labelClass, button, card } from "@/lib/ui";
import { LogoMark, MicIcon, UsersIcon } from "@/components/icons";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(registerUser, undefined);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <LogoMark className="size-10" />
      </div>
      <h1 className="text-2xl font-bold text-center">Create your account</h1>
      <p className="text-muted text-center mt-1.5">
        Join as an artist to share your music, or a producer to help others finish theirs.
      </p>

      <form action={formAction} className={card("mt-6 p-6 flex flex-col gap-4")}>
        <label className={labelClass()}>
          Name
          <input name="name" required className={input()} />
        </label>

        <label className={labelClass()}>
          Email
          <input type="email" name="email" required className={input()} />
        </label>

        <label className={labelClass()}>
          Password
          <input type="password" name="password" required minLength={8} className={input()} />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium mb-1">I am a...</legend>
          <RoleOption
            name="role"
            value="ARTIST"
            defaultChecked
            icon={<MicIcon className="size-5" />}
            title="Artist"
            description="I make music and want to share it"
          />
          <RoleOption
            name="role"
            value="PRODUCER"
            icon={<UsersIcon className="size-5" />}
            title="Producer"
            description="I want to discover artists and help produce their music"
          />
        </fieldset>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}

        <button type="submit" disabled={pending} className={button({ className: "mt-1" })}>
          {pending ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function RoleOption({
  name,
  value,
  defaultChecked,
  icon,
  title,
  description,
}: {
  name: string;
  value: string;
  defaultChecked?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label className="group flex items-start gap-3 rounded-xl border border-border p-3.5 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5 hover:bg-surface-hover">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="sr-only" />
      <span className="mt-0.5 text-muted group-has-[:checked]:text-primary">{icon}</span>
      <span>
        <span className="block font-medium text-sm">{title}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
    </label>
  );
}
