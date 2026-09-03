import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import phonePlaceholder from "@/assets/phone-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { priceLabel, type Product } from "@/data/products";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export function ProductCard({ product }: { product: Product }) {
  const { branchId } = useBranch();

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <Link
        to="/phones/$productId"
        params={{ productId: product.id }}
        className="relative block overflow-hidden bg-secondary"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={phonePlaceholder}
          alt=""
          loading="lazy"
          width={1008}
          height={1008}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-md bg-navy/85 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-navy-foreground backdrop-blur-sm">
          {product.condition === "new" ? "New" : "Pre-Owned"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="eyebrow text-electric">{product.brand}</p>
        <h3 className="mt-1.5 font-display text-sm font-bold leading-snug sm:text-base">
          <Link
            to="/phones/$productId"
            params={{ productId: product.id }}
            className="hover:text-electric"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[0.7rem] leading-relaxed text-muted-foreground sm:text-xs">{product.keySpec}</p>

        <div className="mt-3 flex flex-col items-start gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <span className="font-display text-sm font-bold text-foreground">
            {priceLabel(product)}
          </span>
          <span className="text-[0.65rem] font-medium text-muted-foreground sm:text-[0.7rem]">
            Enquire for availability
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 sm:mt-4 sm:gap-2">
          <Button asChild variant="whatsapp" size="sm">
            <a
              href={waLink(waMessages.product(product.name), branchId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="hidden sm:block" />
              <span className="sm:hidden">Enquire</span>
              <span className="hidden sm:inline">Enquire on WhatsApp</span>
            </a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/phones/$productId" params={{ productId: product.id }}>
              View Details
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
