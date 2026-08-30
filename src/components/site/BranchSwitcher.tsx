import { MapPin } from "lucide-react";

import { BRANCHES } from "@/data/branches";
import { useBranch } from "@/lib/branch-store";
import { cn } from "@/lib/utils";

export function BranchSwitcher({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  const { branchId, setBranchId } = useBranch();

  return (
    <div
      role="group"
      aria-label="Choose your Ozon Mobiles branch"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg p-1",
        onDark ? "bg-navy-foreground/10" : "bg-secondary",
        compact ? "text-xs" : "w-full text-sm",
      )}
    >
      {!compact && (
        <MapPin
          aria-hidden="true"
          className={cn("ml-2 size-4", onDark ? "text-cyan" : "text-electric")}
        />
      )}
      {BRANCHES.map((b) => {
        const active = b.id === branchId;
        return (
          <button
            key={b.id}
            type="button"
            aria-pressed={active}
            onClick={() => setBranchId(b.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 font-semibold transition-colors",
              active
                ? "bg-electric text-electric-foreground shadow-sm"
                : onDark
                  ? "text-navy-foreground/70 hover:text-navy-foreground"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {b.shortName}
          </button>
        );
      })}
    </div>
  );
}
