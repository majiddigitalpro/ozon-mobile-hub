import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import accessoriesImg from "@/assets/accessories.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, SectionHeading } from "@/components/site/Bits";
import { ACCESSORIES, ACCESSORY_CATEGORIES } from "@/data/accessories";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/accessories")({
  head: () => ({
    meta: [
      { title: "Smartphone Accessories in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        name: "description",
        content:
          "Cases, tempered glass, chargers, cables, power banks, earbuds, smartwatches and speakers at Ozon Mobiles Triprayar and Chavakkad. Check availability on WhatsApp.",
      },
      {
        property: "og:title",
        content: "Smartphone Accessories in Triprayar & Chavakkad | Ozon Mobiles",
      },
      {
        property: "og:description",
        content: "Protect, power and upgrade your smartphone with accessories fitted in store.",
      },
      { property: "og:url", content: "/accessories" },
    ],
    links: [{ rel: "canonical", href: "/accessories" }],
  }),
  component: AccessoriesPage,
});

const TINTS = ["bg-tint-blue", "bg-tint-cyan", "bg-tint-sand", "bg-tint-mint"];

function AccessoriesPage() {
  const { branchId } = useBranch();
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  const results = useMemo(
    () =>
      ACCESSORIES.filter((a) => {
        if (active !== "All" && a.category !== active) return false;
        if (query.trim() && !`${a.name} ${a.category}`.toLowerCase().includes(query.toLowerCase()))
          return false;
        return true;
      }),
    [active, query],
  );

  return (
    <>
      <section className="bg-surface py-12 md:py-16">
        <div className="shell grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
          <SectionHeading
            eyebrow="Accessories"
            title="Protect, power and upgrade your phone"
            body="Cases, tempered glass, chargers, cables, power banks, earbuds, smartwatches and more — fitted and checked in store at Triprayar and Chavakkad."
          />
          <img
            src={accessoriesImg}
            alt="Cases, cables, power bank, earbuds and a smartwatch"
            loading="lazy"
            width={1408}
            height={1008}
            className="w-full rounded-3xl object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {["All", ...ACCESSORY_CATEGORIES.map((c) => c.name)].map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={active === c ? "hero" : "quiet"}
                  onClick={() => setActive(c)}
                  className="shrink-0"
                >
                  {c}
                </Button>
              ))}
            </div>
            <div className="relative lg:w-72">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search accessories"
                aria-label="Search accessories"
                className="h-11 pl-9"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-8">
            {results.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((a, i) => (
                  <article
                    key={a.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                  >
                    <div className={`${TINTS[i % TINTS.length]} px-5 py-8`}>
                      <p className="eyebrow text-electric">{a.category}</p>
                      <h3 className="mt-2 font-display text-lg font-extrabold leading-snug">
                        {a.name}
                      </h3>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                        {a.blurb}
                      </p>
                      <p className="mt-3 text-sm font-bold">Ask for latest price</p>
                      <Button asChild variant="whatsapp" size="sm" className="mt-4">
                        <a
                          href={waLink(waMessages.accessory(a.name), branchId)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle />
                          Check Availability
                        </a>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No accessories found"
                body="Try another category, or ask our team — we stock more than we can list here."
                ctaLabel="Ask on WhatsApp"
                message={waMessages.help}
              >
                <Button
                  variant="quiet"
                  onClick={() => {
                    setActive("All");
                    setQuery("");
                  }}
                >
                  Clear filters
                </Button>
              </EmptyState>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
