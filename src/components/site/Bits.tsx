import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBranch } from "@/lib/branch-store";
import { waLink } from "@/lib/whatsapp";

export function SectionHeading({
  eyebrow,
  title,
  body,
  onDark = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  onDark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className={cn("eyebrow", onDark ? "text-cyan" : "text-electric")}>{eyebrow}</p>}
      <h2
        className={cn(
          "mt-2 text-balance text-2xl font-extrabold sm:text-3xl md:text-[2.1rem]",
          onDark ? "text-navy-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            "mt-3 text-pretty text-sm leading-relaxed sm:text-base",
            onDark ? "text-navy-foreground/70" : "text-muted-foreground",
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  ctaLabel,
  message,
  children,
}: {
  title: string;
  body: string;
  ctaLabel: string;
  message: string;
  children?: React.ReactNode;
}) {
  const { branchId } = useBranch();
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="whatsapp">
          <a href={waLink(message, branchId)} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            {ctaLabel}
          </a>
        </Button>
        {children}
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "electric" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider",
        tone === "neutral" && "bg-secondary text-secondary-foreground",
        tone === "electric" && "bg-electric/12 text-electric",
        tone === "dark" && "bg-navy text-navy-foreground",
      )}
    >
      {children}
    </span>
  );
}
