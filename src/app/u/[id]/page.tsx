import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TrackCard from "@/components/TrackCard";
import FollowButton from "@/components/FollowButton";

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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-black/60 dark:text-white/60">
            {user.role === "ARTIST" ? "Artist" : "Producer"} ·{" "}
            {user._count.followedBy} follower
            {user._count.followedBy === 1 ? "" : "s"}
          </p>
          {user.bio && <p className="mt-2 text-sm whitespace-pre-wrap">{user.bio}</p>}
        </div>

        {session?.user && session.user.id !== user.id && (
          <FollowButton targetUserId={user.id} isFollowing={isFollowing} />
        )}
      </div>

      {user.role === "ARTIST" && (
        <section>
          <h2 className="font-semibold mb-3">Tracks ({user.tracks.length})</h2>
          {user.tracks.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              No tracks uploaded yet.
            </p>
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
