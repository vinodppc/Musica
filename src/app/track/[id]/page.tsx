import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import AudioPlayer from "@/components/AudioPlayer";
import CommentForm from "@/components/CommentForm";
import OfferForm from "@/components/OfferForm";
import OfferActions from "@/components/OfferActions";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  ACCEPTED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  DECLINED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export default async function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const track = await prisma.track.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, bio: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      },
      offers: {
        orderBy: { createdAt: "desc" },
        include: { producer: { select: { id: true, name: true, bio: true } } },
      },
    },
  });

  if (!track) notFound();

  const isOwner = session?.user?.id === track.userId;
  const alreadyOffered = track.offers.some(
    (o) => o.producerId === session?.user?.id
  );

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{track.title}</h1>
            <p className="text-black/60 dark:text-white/60">
              by{" "}
              <Link href={`/u/${track.user.id}`} className="hover:underline">
                {track.user.name}
              </Link>
              {track.genre && <span> · {track.genre}</span>}
            </p>
          </div>
          {track.seekingHelp && (
            <span className="shrink-0 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-1">
              Seeking production help
            </span>
          )}
        </div>

        <div className="mt-4">
          <AudioPlayer src={track.filePath} />
        </div>

        {track.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm">{track.description}</p>
        )}
      </div>

      {session?.user?.role === "PRODUCER" && !isOwner && (
        <section className="rounded-xl border border-black/10 dark:border-white/10 p-4">
          <h2 className="font-semibold mb-2">Offer production help</h2>
          {alreadyOffered ? (
            <p className="text-sm text-black/60 dark:text-white/60">
              You&apos;ve already sent an offer for this track.
            </p>
          ) : (
            <OfferForm trackId={track.id} />
          )}
        </section>
      )}

      {isOwner && track.offers.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3">
            Production offers ({track.offers.length})
          </h2>
          <div className="flex flex-col gap-3">
            {track.offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-xl border border-black/10 dark:border-white/10 p-4"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Link
                    href={`/u/${offer.producer.id}`}
                    className="font-medium hover:underline"
                  >
                    {offer.producer.name}
                  </Link>
                  <span
                    className={`text-xs font-medium rounded-full px-2 py-1 ${statusStyles[offer.status]}`}
                  >
                    {offer.status}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{offer.message}</p>
                {offer.status === "PENDING" && (
                  <div className="mt-3">
                    <OfferActions offerId={offer.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold mb-3">
          Comments ({track.comments.length})
        </h2>

        {session?.user ? (
          <div className="mb-4">
            <CommentForm trackId={track.id} />
          </div>
        ) : (
          <p className="text-sm text-black/50 dark:text-white/50 mb-4">
            <Link href="/login" className="text-violet-600 dark:text-violet-400 hover:underline">
              Log in
            </Link>{" "}
            to leave a comment.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {track.comments.map((comment) => (
            <div key={comment.id} className="text-sm border-b border-black/5 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Link href={`/u/${comment.user.id}`} className="font-medium hover:underline">
                  {comment.user.name}
                </Link>
                <span className="text-xs text-black/40 dark:text-white/40">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
