import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/lib/actions";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="border-b border-black/10 dark:border-white/10 sticky top-0 z-10 bg-[var(--background)]/90 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight text-violet-600 dark:text-violet-400">
          🎵 Musica
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400">
            Discover
          </Link>

          {session?.user ? (
            <>
              {session.user.role === "ARTIST" && (
                <Link href="/upload" className="hover:text-violet-600 dark:hover:text-violet-400">
                  Upload
                </Link>
              )}
              <Link href="/dashboard" className="hover:text-violet-600 dark:hover:text-violet-400">
                Dashboard
              </Link>
              <Link
                href={`/u/${session.user.id}`}
                className="hover:text-violet-600 dark:hover:text-violet-400"
              >
                {session.user.name}
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md border border-black/10 dark:border-white/20 px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-violet-600 dark:hover:text-violet-400">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-violet-600 text-white px-3 py-1.5 hover:bg-violet-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
