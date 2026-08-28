export default function AudioPlayer({ src }: { src: string }) {
  return (
    <audio controls preload="none" className="w-full h-10 rounded-lg">
      <source src={src} />
      Your browser does not support the audio element.
    </audio>
  );
}
