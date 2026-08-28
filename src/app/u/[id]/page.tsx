import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TrackCard from "@/components/TrackCard";
import FollowButton from "@/components/FollowButton";
import { EmptyMusicIllustration, MicIcon, UsersIcon } from "@/components/icons";
import { badge } from "@/lib/ui";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      tracks: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { comments: true } },
        },
      },
      _count: { select: { follows: true, followedBy: true } },
    },
  });

  if (!user) notFound();

  const isFollowing = session?.user
    ? Boolean(
        await prisma.follow.findUnique({
          where: {
            followerId_followedId: {
              followerId: session.user.id,
              followedId: user.id,
            },
          },
        })
      )
    : false;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-4">
        <div className="shrink-0 size-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white/90 shadow-sm text-xl font-semibold">
          {user.name.slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className={badge(user.role === "ARTIST" ? "primary" : "accent")}>
                  {user.role === "ARTIST" ? <MicIcon className="size-3.5" /> : <UsersIcon className="size-3.5" />}
                  {user.role === "ARTIST" ? "Artist" : "Producer"}
                </span>
                <span className="text-sm text-muted">
                  {user._count.followedBy} follower{user._count.followedBy === 1 ? "" : "s"}
                </span>
              </div>
              {user.bio && <p className="mt-3 text-sm text-muted whitespace-pre-wrap">{user.bio}</p>}
            </div>

            {session?.user && session.user.id !== user.id && (
              <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
            )}
          </div>
        </div>
      </div>

      {user.role === "ARTIST" && (
        <section>
          <h2 className="font-semibold mb-3">Tracks ({user.tracks.length})</h2>
          {user.tracks.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <EmptyMusicIllustration className="size-12" />
              <p className="text-sm text-muted">No tracks uploaded yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {user.tracks.map((track) => (
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
            </div>
          )}
        </section>
      )}
    </div>
  );
}
