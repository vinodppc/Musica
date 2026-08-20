import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TrackCard from "@/components/TrackCard";
import OfferActions from "@/components/OfferActions";

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  ACCEPTED: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  DECLINED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role === "ARTIST") {
    const tracks = await prisma.track.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
        offers: {
          orderBy: { createdAt: "desc" },
          include: { producer: { select: { id: true, name: true } } },
        },
      },
    });

    const pendingOffers = tracks.flatMap((t) =>
      t.offers
        .filter((o) => o.status === "PENDING")
        .map((o) => ({ ...o, trackTitle: t.title, trackId: t.id }))
    );

    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your dashboard</h1>
          <Link
            href="/upload"
            className="rounded-md bg-violet-600 text-white px-4 py-2 text-sm hover:bg-violet-700"
          >
            Upload a track
          </Link>
        </div>

        {pendingOffers.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3">
              Pending production offers ({pendingOffers.length})
            </h2>
            <div className="flex flex-col gap-3">
              {pendingOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-xl border border-black/10 dark:border-white/10 p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="text-sm">
                      <Link href={`/u/${offer.producer.id}`} className="font-medium hover:underline">
                        {offer.producer.name}
                      </Link>{" "}
                      wants to help produce{" "}
                      <Link href={`/track/${offer.trackId}`} className="font-medium hover:underline">
                        {offer.trackTitle}
                      </Link>
                    </p>
                    <span className={`text-xs font-medium rounded-full px-2 py-1 ${statusStyles[offer.status]}`}>
                      {offer.status}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{offer.message}</p>
                  <div className="mt-3">
                    <OfferActions offerId={offer.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-semibold mb-3">Your tracks ({tracks.length})</h2>
          {tracks.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">
              You haven&apos;t uploaded any tracks yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
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
            </div>
          )}
        </section>
      </div>
    );
  }

  // PRODUCER dashboard
  const seekingHelp = await prisma.track.findMany({
    where: { seekingHelp: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
  });

  const sentOffers = await prisma.productionOffer.findMany({
    where: { producerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { track: { include: { user: { select: { id: true, name: true } } } } },
  });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Your dashboard</h1>

      <section>
        <h2 className="font-semibold mb-3">
          Artists seeking production help ({seekingHelp.length})
        </h2>
        {seekingHelp.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">
            No one is seeking help right now — check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {seekingHelp.map((track) => (
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

      <section>
        <h2 className="font-semibold mb-3">Offers you&apos;ve sent ({sentOffers.length})</h2>
        {sentOffers.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50">
            You haven&apos;t reached out to any artists yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sentOffers.map((offer) => (
              <div key={offer.id} className="rounded-xl border border-black/10 dark:border-white/10 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm">
                    To{" "}
                    <Link href={`/u/${offer.track.user.id}`} className="font-medium hover:underline">
                      {offer.track.user.name}
                    </Link>{" "}
                    on{" "}
                    <Link href={`/track/${offer.track.id}`} className="font-medium hover:underline">
                      {offer.track.title}
                    </Link>
                  </p>
                  <span className={`text-xs font-medium rounded-full px-2 py-1 ${statusStyles[offer.status]}`}>
                    {offer.status}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{offer.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
