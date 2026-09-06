import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, MapPin, MessageCircle, Phone } from "lucide-react";

import phonePlaceholder from "@/assets/phone-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { Badge, SectionHeading } from "@/components/site/Bits";
import { ProductCard } from "@/components/site/ProductCard";
import { BRANCHES, FINANCE_PARTNERS, getBranch } from "@/data/branches";
import { ACCESSORY_CATEGORIES } from "@/data/accessories";
import { priceLabel } from "@/data/products";
import { listPublicProducts } from "@/lib/catalogue.functions";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/phones/$productId")({
  loader: async ({ params }) => {
    const products = await listPublicProducts();
    const product = products.find((p) => p.id === params.productId);
    if (!product) throw notFound();
    const related = products
      .filter((p) => p.id !== product.id && (p.brand === product.brand || p.condition === product.condition))
      .slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Phone not found | Ozon Mobiles" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} | Ozon Mobiles Triprayar & Chavakkad`;
    const description = `${product.brand} ${product.name} at Ozon Mobiles. ${product.keySpec}. Enquire on WhatsApp for the latest price and availability in Triprayar or Chavakkad.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/phones/${product.id}` },
      ],
      links: [{ rel: "canonical", href: `/phones/${product.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${product.brand} ${product.name}`,
            brand: { "@type": "Brand", name: product.brand },
            description,
            itemCondition:
              product.condition === "new"
                ? "https://schema.org/NewCondition"
                : "https://schema.org/UsedCondition",
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { branchId } = useBranch();

  return (
    <>
      <div className="shell pt-6 text-xs text-muted-foreground">
        <Link to="/phones" className="font-semibold text-electric hover:underline">
          Phones
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <section className="section-y pt-8">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="overflow-hidden rounded-3xl bg-tint-blue p-6">
              <img
                src={phonePlaceholder}
                alt={`${product.brand} ${product.name}`}
                width={1008}
                height={1008}
                className="mx-auto aspect-square w-full max-w-md rounded-2xl object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden rounded-xl bg-secondary p-2">
                  <img
                    src={phonePlaceholder}
                    alt=""
                    loading="lazy"
                    width={1008}
                    height={1008}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Product photography is representative. Ask us for photos of the exact unit in store.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="electric">{product.brand}</Badge>
              <Badge tone={product.condition === "new" ? "dark" : "neutral"}>
                {product.condition === "new" ? "New" : "Pre-Owned"}
              </Badge>
              {product.fiveG && <Badge>5G</Badge>}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{product.keySpec}</p>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <p className="font-display text-xl font-extrabold">{priceLabel(product)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Enquire for availability — stock and pricing change often, so we confirm both on
                WhatsApp.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button asChild variant="whatsapp" size="lg" className="flex-1">
                  <a
                    href={waLink(waMessages.product(product.name), branchId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle />
                    Enquire on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="quiet" size="lg">
                  <a href={`tel:${getBranch(branchId).tel}`}>
                    <Phone />
                    Call Store
                  </a>
                </Button>
              </div>
            </div>

            <dl className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {product.specs.map((s) => (
                <div key={s.label} className="rounded-xl bg-secondary p-4">
                  <dt className="eyebrow text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 text-sm font-semibold">{s.value}</dd>
                </div>
              ))}
              <div className="rounded-xl bg-secondary p-4">
                <dt className="eyebrow text-muted-foreground">Storage options</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {product.storage.map((s) => (s >= 1024 ? "1TB" : `${s}GB`)).join(" · ")}
                </dd>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <dt className="eyebrow text-muted-foreground">RAM options</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {product.ram.map((r) => `${r}GB`).join(" · ")}
                </dd>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <dt className="eyebrow text-muted-foreground">Colours</dt>
                <dd className="mt-1 text-sm font-semibold">{product.colours.join(" · ")}</dd>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <dt className="eyebrow text-muted-foreground">Finance</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {product.financeAvailable
                    ? `Available in store — ${FINANCE_PARTNERS.join(", ")}, subject to terms and eligibility.`
                    : "Ask in store about available options."}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide">
                Usually enquired at
              </h2>
              <ul className="mt-3 space-y-2">
                {BRANCHES.filter((b) => product.branches.includes(b.id)).map((b) => (
                  <li key={b.id} className="flex items-center gap-2 text-sm">
                    <Check aria-hidden="true" className="size-4 text-electric" />
                    <Link
                      to="/stores/$branch"
                      params={{ branch: b.slug }}
                      className="font-semibold hover:text-electric"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                <MapPin aria-hidden="true" className="mr-1 inline size-3" />
                We confirm which branch has it before you travel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="shell">
          <SectionHeading eyebrow="Accessories" title="Add the essentials" />
          <ul className="mt-6 flex flex-wrap gap-2">
            {ACCESSORY_CATEGORIES.slice(0, 5).map((c) => (
              <li key={c.name}>
                <Link
                  to="/accessories"
                  className="inline-flex rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold transition-colors hover:border-electric/50"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-y">
          <div className="shell">
            <SectionHeading eyebrow="You may also like" title="Related phones" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
