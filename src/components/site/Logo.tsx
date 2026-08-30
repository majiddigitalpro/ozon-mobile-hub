import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

/**
 * Temporary wordmark. When the official Ozon Mobiles logo asset is supplied,
 * replace the mark below with an <img> using the real file — layout and sizing
 * stay the same.
 */
export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Ozon Mobiles home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        aria-hidden="true"
        className="relative grid h-9 w-9 place-items-center rounded-[0.7rem] bg-electric text-electric-foreground shadow-[var(--shadow-glow)]"
      >
        <span className="font-display text-lg font-extrabold leading-none">O</span>
        <span className="absolute inset-x-2 bottom-1 h-[2px] rounded-full bg-cyan/80" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.05rem] font-extrabold tracking-tight",
            onDark ? "text-navy-foreground" : "text-foreground",
          )}
        >
          OZON
          <span className="text-electric"> MOBILES</span>
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-medium uppercase tracking-[0.22em]",
            onDark ? "text-navy-foreground/60" : "text-muted-foreground",
          )}
        >
          All About Mobiles
        </span>
      </span>
    </Link>
  );
}
