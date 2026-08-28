import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import { MessageIcon, MicIcon } from "@/components/icons";
import { badge, card } from "@/lib/ui";

type TrackCardProps = {
  id: string;
  title: string;
  genre: string | null;
  filePath: string;
  seekingHelp: boolean;
  createdAt: Date;
  artist: { id: string; name: string };
  commentCount: number;
};

const COVER_GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-amber-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-indigo-500",
  "from-rose-500 to-violet-500",
];

function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
}

export default function TrackCard({
  id,
  title,
  genre,
  filePath,
  seekingHelp,
  createdAt,
  artist,
  commentCount,
}: TrackCardProps) {
  return (
    <div className={card("p-4 flex flex-col gap-3 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all")}>
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 size-14 rounded-xl bg-gradient-to-br ${gradientFor(id)} flex items-center justify-center text-white/90 shadow-sm`}
        >
          <MicIcon className="size-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/track/${id}`} className="font-semibold leading-tight hover:text-primary transition-colors truncate">
              {title}
            </Link>
          </div>
          <div className="text-sm text-muted truncate">
            <Link href={`/u/${artist.id}`} className="hover:text-foreground hover:underline">
              {artist.name}
            </Link>
            {genre && <span> · {genre}</span>}
          </div>
        </div>

        {seekingHelp && (
          <span className={badge("accent", "shrink-0")}>Seeking help</span>
        )}
      </div>

      <AudioPlayer src={filePath} />

      <div className="flex items-center justify-between text-xs text-muted">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <Link href={`/track/${id}`} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <MessageIcon className="size-3.5" />
          {commentCount}
        </Link>
      </div>
    </div>
  );
}
