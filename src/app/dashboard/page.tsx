import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import TrackCard from "@/components/TrackCard";
import OfferActions from "@/components/OfferActions";
import { EmptyMusicIllustration, MicIcon, UploadIcon } from "@/components/icons";
import { badge, button, card } from "@/lib/ui";

const statusTone = {
  PENDING: "accent",
  ACCEPTED: "success",
  DECLINED: "danger",
} as const;

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className={card("p-4")}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

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
    const acceptedCount = tracks.reduce(
      (sum, t) => sum + t.offers.filter((o) => o.status === "ACCEPTED").length,
      0
    );

    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your dashboard</h1>
          <Link href="/upload" className={button({ size: "sm" })}>
            <UploadIcon className="size-4" />
            Upload a track
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatTile label={tracks.length === 1 ? "Track" : "Tracks"} value={tracks.length} />
          <StatTile label="Pending offers" value={pendingOffers.length} />
          <StatTile label="Collaborators" value={acceptedCount} />
        </div>

        {pendingOffers.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3">
              Pending production offers ({pendingOffers.length})
            </h2>
            <div className="flex flex-col gap-3">
              {pendingOffers.map((offer) => (
                <div key={offer.id} className={card("p-4")}>
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
                    <span className={badge(statusTone[offer.status])}>{offer.status}</span>
                  </div>
                  <p className="text-sm text-muted whitespace-pre-wrap">{offer.message}</p>
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
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <EmptyMusicIllustration className="size-12" />
              <p className="text-sm text-muted">You haven&apos;t uploaded any tracks yet.</p>
            </div>
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
  const acceptedCount = sentOffers.filter((o) => o.status === "ACCEPTED").length;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Your dashboard</h1>

      <div className="grid grid-cols-3 gap-3">
        <StatTile label="Seeking help" value={seekingHelp.length} />
        <StatTile label="Offers sent" value={sentOffers.length} />
        <StatTile label="Accepted" value={acceptedCount} />
      </div>

      <section>
        <h2 className="font-semibold mb-3">
          Artists seeking production help ({seekingHelp.length})
        </h2>
        {seekingHelp.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <EmptyMusicIllustration className="size-12" />
            <p className="text-sm text-muted">No one is seeking help right now — check back soon.</p>
          </div>
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
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <MicIcon className="size-8 text-muted" />
            <p className="text-sm text-muted">You haven&apos;t reached out to any artists yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sentOffers.map((offer) => (
              <div key={offer.id} className={card("p-4")}>
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
                  <span className={badge(statusTone[offer.status])}>{offer.status}</span>
                </div>
                <p className="text-sm text-muted whitespace-pre-wrap">{offer.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
