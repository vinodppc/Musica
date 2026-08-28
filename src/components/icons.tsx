type IconProps = { className?: string };

export function LogoMark({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="currentColor" className="text-primary" />
      <path
        d="M15.5 7v6.35a2.65 2.65 0 1 1-1.5-2.39V8.9L10 10.1v5.25a2.65 2.65 0 1 1-1.5-2.39V9L15.5 7Z"
        fill="var(--primary-foreground)"
      />
    </svg>
  );
}

export function UploadIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </svg>
  );
}

export function PlayCircleIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5 15.5 12 10 15.5v-7Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function UsersIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="9" cy="8" r="3.25" />
      <path d="M17.5 19v-1.5a3.5 3.5 0 0 0-2.3-3.29" />
      <path d="M14.5 4.3a3.25 3.25 0 0 1 0 6.24" />
    </svg>
  );
}

export function MessageIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 12a8 8 0 1 1-3.6-6.66L21 4l-1.2 4.03A7.96 7.96 0 0 1 21 12Z" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function XCircleIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m9.5 9.5 5 5m0-5-5 5" />
    </svg>
  );
}

export function SparkIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5c.4 3.5 1.3 5.9 2.8 7.4S18.2 12 21.7 12.5c-3.5.4-5.9 1.3-7.4 2.8S12 18.7 11.5 22.2c-.4-3.5-1.3-5.9-2.8-7.4S5.3 13 1.8 12.5c3.5-.4 5.9-1.3 7.4-2.8S11.6 6 12 2.5Z" />
    </svg>
  );
}

export function MicIcon({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5v4M9 21.5h6" />
    </svg>
  );
}

export function EmptyMusicIllustration({ className = "size-16" }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="32" className="fill-surface-hover" />
      <path
        d="M40 20v14.6a5.5 5.5 0 1 1-3-4.9V24l-10 2.2v11.4A5.5 5.5 0 1 1 24 32.7V21l16-3.4V20Z"
        className="fill-muted"
      />
    </svg>
  );
}
