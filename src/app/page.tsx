import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TrackCard from "@/components/TrackCard";
import { EmptyMusicIllustration, SparkIcon } from "@/components/icons";
import { button } from "@/lib/ui";

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

  const isFiltering = Boolean(genre || seekingHelp);

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-14 sm:py-20 text-center">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
        />
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -translate-x-1/2 size-72 rounded-full bg-primary/15 blur-3xl -z-10"
        />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
          <SparkIcon className="size-3.5 text-primary" />
          For artists &amp; producers
        </span>

        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-balance">
          Connect through music
        </h1>
        <p className="mt-4 text-muted max-w-xl mx-auto text-balance">
          Upload your tracks, share them with the world, and get matched with
          producers who can help take your sound to the next level.
        </p>

        {!session?.user && (
          <div className="mt-7 flex justify-center gap-3">
            <Link href="/signup" className={button({ size: "lg" })}>
              Get started
            </Link>
            <Link href="/login" className={button({ variant: "secondary", size: "lg" })}>
              Log in
            </Link>
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-2 text-sm">
        <FilterChip href="/" active={!isFiltering}>
          All tracks
        </FilterChip>
        <FilterChip href="/?seekingHelp=1" active={seekingHelp === "1"}>
          Seeking production help
        </FilterChip>
        {genres.map(
          (g) =>
            g.genre && (
              <FilterChip key={g.genre} href={`/?genre=${encodeURIComponent(g.genre)}`} active={genre === g.genre}>
                {g.genre}
              </FilterChip>
            )
        )}
      </section>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <EmptyMusicIllustration />
          <p className="text-muted">
            {isFiltering ? (
              "No tracks match these filters yet."
            ) : (
              <>
                No tracks yet. Be the first to{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  upload one
                </Link>
                .
              </>
            )}
          </p>
        </div>
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

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full px-3.5 py-1.5 bg-primary text-primary-foreground font-medium"
          : "rounded-full px-3.5 py-1.5 border border-border hover:bg-surface-hover transition-colors"
      }
    >
      {children}
    </Link>
  );
}
