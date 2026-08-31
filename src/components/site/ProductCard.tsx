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

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow text-electric">{product.brand}</p>
        <h3 className="mt-1.5 font-display text-base font-bold leading-snug">
          <Link
            to="/phones/$productId"
            params={{ productId: product.id }}
            className="hover:text-electric"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{product.keySpec}</p>

        <div className="mt-3 flex items-baseline justify-between gap-2">
          <span className="font-display text-sm font-bold text-foreground">
            {priceLabel(product)}
          </span>
          <span className="text-[0.7rem] font-medium text-muted-foreground">
            Enquire for availability
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button asChild variant="whatsapp" size="sm">
            <a
              href={waLink(waMessages.product(product.name), branchId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle />
              Enquire on WhatsApp
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
