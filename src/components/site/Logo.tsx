import { Link } from "@tanstack/react-router";

import logoAsset from "@/assets/ozon-logo.jpg.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Ozon Mobiles home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <img
        src={logoAsset.url}
        alt="Ozon Mobiles"
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-xl object-cover shadow-sm"
      />
      <span className="hidden flex-col leading-none sm:flex">
        <span
          className={cn(
            "font-display text-[1.05rem] font-extrabold tracking-tight",
            onDark ? "text-navy-foreground" : "text-foreground",
          )}
        >
          Ozon Mobiles
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em]",
            onDark ? "text-cyan" : "text-electric",
          )}
        >
          All About Mobiles
        </span>
      </span>
    </Link>
  );
}
