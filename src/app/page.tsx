import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TrackCard from "@/components/TrackCard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; seekingHelp?: string }>;
}) {
  const session = await auth();
  const { genre, seekingHelp } = await searchParams;

  const tracks = await prisma.track.findMany({
    where: {
      genre: genre ? { equals: genre } : undefined,
      seekingHelp: seekingHelp === "1" ? true : undefined,
    },
    orderBy: { createdAt: "desc" },
    take: 30,
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  const genres = await prisma.track.findMany({
    where: { genre: { not: null } },
    select: { genre: true },
    distinct: ["genre"],
  });

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Connect through music
        </h1>
        <p className="mt-3 text-black/60 dark:text-white/60 max-w-xl mx-auto">
          Upload your tracks, share them with the world, and get matched with
          producers who can help take your sound to the next level.
        </p>
        {!session?.user && (
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-violet-600 text-white px-4 py-2 hover:bg-violet-700"
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-black/10 dark:border-white/20 px-4 py-2 hover:bg-black/5 dark:hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/"
          className={`rounded-full px-3 py-1 border ${
            !genre && !seekingHelp
              ? "bg-violet-600 text-white border-violet-600"
              : "border-black/10 dark:border-white/20"
          }`}
        >
          All
        </Link>
        <Link
          href="/?seekingHelp=1"
          className={`rounded-full px-3 py-1 border ${
            seekingHelp === "1"
              ? "bg-violet-600 text-white border-violet-600"
              : "border-black/10 dark:border-white/20"
          }`}
        >
          Seeking production help
        </Link>
        {genres.map(
          (g) =>
            g.genre && (
              <Link
                key={g.genre}
                href={`/?genre=${encodeURIComponent(g.genre)}`}
                className={`rounded-full px-3 py-1 border ${
                  genre === g.genre
                    ? "bg-violet-600 text-white border-violet-600"
                    : "border-black/10 dark:border-white/20"
                }`}
              >
                {g.genre}
              </Link>
            )
        )}
      </section>

      {tracks.length === 0 ? (
        <p className="text-center text-black/50 dark:text-white/50 py-12">
          No tracks yet. Be the first to{" "}
          <Link href="/signup" className="text-violet-600 dark:text-violet-400 hover:underline">
            upload one
          </Link>
          .
        </p>
      ) : (
        <section className="grid sm:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              id={track.id}
              title={track.title}
              genre={track.genre}
              filePath={track.filePath}
              seekingHelp={track.seekingHelp}
              createdAt={track.createdAt}
              artist={track.user}
              commentCount={track._count.comments}
            />
          ))}
        </section>
      )}
    </div>
  );
}
