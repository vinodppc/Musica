type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const buttonSizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm shadow-primary/20",
  secondary: "bg-surface border border-border hover:bg-surface-hover",
  ghost: "hover:bg-surface-hover",
  danger: "bg-danger text-white hover:opacity-90",
  success: "bg-success text-white hover:opacity-90",
};

export function button(opts: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  const { variant = "primary", size = "md", className = "" } = opts;
  return [buttonBase, buttonSizes[size], buttonVariants[variant], className].join(" ");
}

export function input(className = "") {
  return [
    "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm placeholder:text-muted",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow",
    className,
  ].join(" ");
}

export function label(className = "") {
  return ["flex flex-col gap-1.5 text-sm font-medium", className].join(" ");
}

type BadgeTone = "accent" | "success" | "danger" | "neutral" | "primary";

const badgeTones: Record<BadgeTone, string> = {
  accent: "bg-accent-soft text-accent-soft-foreground",
  success: "bg-success-soft text-success-soft-foreground",
  danger: "bg-danger-soft text-danger-soft-foreground",
  neutral: "bg-surface-hover text-muted",
  primary: "bg-primary/10 text-primary",
};

export function badge(tone: BadgeTone = "neutral", className = "") {
  return [
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
    badgeTones[tone],
    className,
  ].join(" ");
}

export function card(className = "") {
  return ["rounded-2xl border border-border bg-surface", className].join(" ");
}
