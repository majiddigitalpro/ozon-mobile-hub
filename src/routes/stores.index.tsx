import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/Bits";
import { BranchSwitcher } from "@/components/site/BranchSwitcher";
import { BRANCHES } from "@/data/branches";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/stores/")({
  head: () => ({
    meta: [
      { title: "Our Stores in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        name: "description",
        content:
          "Visit Ozon Mobiles at C.M Tower, Temple Rd, Triprayar or Friend Ship Nagar, Chavakkad. Call, WhatsApp or get directions to your nearest branch.",
      },
      { property: "og:title", content: "Our Stores in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        property: "og:description",
        content: "Two Kerala branches for smartphones, accessories and phone repair.",
      },
      { property: "og:url", content: "/stores" },
    ],
    links: [{ rel: "canonical", href: "/stores" }],
  }),
  component: StoresPage,
});

function StoresPage() {
  return (
    <>
      <section className="bg-surface py-12 md:py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="Stores"
            title="Choose your Ozon Mobiles"
            body="Two branches serving Triprayar, Chavakkad and the surrounding areas. Pick one and we'll keep it as your default for enquiries."
          />
          <div className="mt-6 max-w-sm">
            <BranchSwitcher />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-6 md:grid-cols-2">
          {BRANCHES.map((b, i) => (
            <article
              key={b.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
            >
              <div className={`${i === 0 ? "bg-tint-blue" : "bg-tint-cyan"} px-7 py-8`}>
                <h2 className="font-display text-2xl font-extrabold">{b.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{b.address}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5">
                    <Star aria-hidden="true" className="size-3.5 text-gold" />
                    {b.rating.toFixed(1)} · {b.reviewCount} Google reviews
                  </span>
                  <span className="rounded-lg bg-surface px-3 py-1.5">{b.yearsLabel}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7">
                <a
                  href={`tel:${b.tel}`}
                  className="inline-flex items-center gap-2 font-display text-lg font-bold hover:text-electric"
                >
                  <Phone aria-hidden="true" className="size-4 text-electric" />
                  {b.phoneDisplay}
                </a>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button asChild variant="hero">
                    <a href={`tel:${b.tel}`}>Call</a>
                  </Button>
                  <Button asChild variant="whatsapp">
                    <a
                      href={waLink(waMessages.store(b.name), b.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle />
                      WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="quiet">
                    <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">
                      <MapPin />
                      Get Directions
                    </a>
                  </Button>
                </div>
                <Link
                  to="/stores/$branch"
                  params={{ branch: b.slug }}
                  className="mt-6 text-sm font-semibold text-electric hover:underline"
                >
                  Branch details &amp; services →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="shell rounded-3xl bg-tint-sand p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-extrabold">Rated by our local customers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {BRANCHES.map((b) => (
              <div key={b.id} className="rounded-2xl bg-surface p-6">
                <p className="font-display text-3xl font-extrabold text-electric">
                  {b.rating.toFixed(1)}★
                </p>
                <p className="mt-1 text-sm font-semibold">{b.shortName}</p>
                <p className="text-sm text-muted-foreground">{b.reviewCount} Google reviews</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-sm text-muted-foreground">
            Ratings and review counts come from our Google Business profiles. Search &ldquo;Ozon
            Mobiles&rdquo; on Google Maps to read them.
          </p>
        </div>
      </section>
    </>
  );
}
