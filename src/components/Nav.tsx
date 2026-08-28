import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/lib/actions";
import { LogoMark, UploadIcon } from "@/components/icons";
import { button } from "@/lib/ui";

export default async function Nav() {
  const session = await auth();

  const links = session?.user
    ? [
        { href: "/", label: "Discover" },
        ...(session.user.role === "ARTIST" ? [{ href: "/upload", label: "Upload" }] : []),
        { href: "/dashboard", label: "Dashboard" },
        { href: `/u/${session.user.id}`, label: session.user.name ?? "Profile" },
      ]
    : [{ href: "/", label: "Discover" }];

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight shrink-0">
          <LogoMark className="size-7" />
          <span>Musica</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {session?.user ? (
            <form action={logout}>
              <button type="submit" className={button({ variant: "secondary", size: "sm" })}>
                Log out
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className={button({ variant: "ghost", size: "sm" })}>
                Log in
              </Link>
              <Link href="/signup" className={button({ variant: "primary", size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu (no JS — native <details> disclosure) */}
        <details className="md:hidden group relative ml-auto">
          <summary className="list-none cursor-pointer rounded-lg border border-border p-2 hover:bg-surface-hover [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-surface shadow-lg p-2 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm hover:bg-surface-hover flex items-center gap-2"
              >
                {l.href === "/upload" && <UploadIcon className="size-4" />}
                {l.label}
              </Link>
            ))}
            <div className="h-px bg-border my-1" />
            {session?.user ? (
              <form action={logout}>
                <button type="submit" className="w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-surface-hover">
                  Log out
                </button>
              </form>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2 text-sm hover:bg-surface-hover">
                  Log in
                </Link>
                <Link href="/signup" className="rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-surface-hover">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
