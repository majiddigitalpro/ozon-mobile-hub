import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge, SectionHeading } from "@/components/site/Bits";
import { OFFER_CATEGORIES } from "@/data/offers";
import { listPublicOffers } from "@/lib/catalogue.functions";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/offers")({
  loader: () => listPublicOffers(),
  head: () => ({
    meta: [
      { title: "Offers & EMI Deals | Ozon Mobiles Triprayar & Chavakkad" },
      {
        name: "description",
        content:
          "Current smartphone, EMI, accessory and repair offers at Ozon Mobiles Triprayar and Chavakkad. Ask us on WhatsApp about today's available deals.",
      },
      { property: "og:title", content: "Offers & EMI Deals | Ozon Mobiles" },
      {
        property: "og:description",
        content: "Promotions change often — WhatsApp Ozon Mobiles for today's available offers.",
      },
      { property: "og:url", content: "/offers" },
    ],
    links: [{ rel: "canonical", href: "/offers" }],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { branchId } = useBranch();
  const [category, setCategory] = useState<string>("All");
  const allOffers = Route.useLoaderData();
  const offers = allOffers.filter((o) => category === "All" || o.category === category);

  return (
    <>
      <section className="bg-surface py-12 md:py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="Offers"
            title="Today's deals at Ozon Mobiles"
            body="Promotions change regularly across phones, EMI, accessories and repairs. Whatever is running right now, our team will tell you straight away."
          />
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {["All", ...OFFER_CATEGORIES].map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "hero" : "quiet"}
                onClick={() => setCategory(c)}
                className="shrink-0"
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="mt-8">
            {offers.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {offers.map((o) => (
                  <article
                    key={o.id}
                    className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
                  >
                    <Badge tone="electric">{o.category}</Badge>
                    <h2 className="mt-3 font-display text-lg font-extrabold">{o.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{o.description}</p>
                    {o.expiresOn && (
                      <p className="mt-3 text-xs text-muted-foreground">Valid until {o.expiresOn}</p>
                    )}
                    <Button asChild variant="whatsapp" size="sm" className="mt-4">
                      <a
                        href={waLink(waMessages.offers, branchId)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle />
                        Ask About This Offer
                      </a>
                    </Button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-tint-blue p-10 text-center">
                <h2 className="font-display text-2xl font-extrabold">Looking for a great deal?</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
                  WhatsApp Ozon Mobiles to ask about today&apos;s available offers on smartphones,
                  EMI plans, accessories and repairs.
                </p>
                <Button asChild variant="whatsapp" size="xl" className="mt-6">
                  <a
                    href={waLink(waMessages.offers, branchId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle />
                    Ask About Today&apos;s Deals
                  </a>
                </Button>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
