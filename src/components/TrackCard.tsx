import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";

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
    <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3 hover:border-violet-400/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/track/${id}`} className="font-semibold hover:text-violet-600 dark:hover:text-violet-400">
            {title}
          </Link>
          <div className="text-sm text-black/60 dark:text-white/60">
            by{" "}
            <Link href={`/u/${artist.id}`} className="hover:underline">
              {artist.name}
            </Link>
            {genre && <span> · {genre}</span>}
          </div>
        </div>
        {seekingHelp && (
          <span className="shrink-0 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-1">
            Seeking production help
          </span>
        )}
      </div>

      <AudioPlayer src={filePath} />

      <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/50">
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <Link href={`/track/${id}`} className="hover:underline">
          {commentCount} comment{commentCount === 1 ? "" : "s"}
        </Link>
      </div>
    </div>
  );
}
