import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone, Star, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/Bits";
import { BRANCHES } from "@/data/branches";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/stores/$branch")({
  loader: ({ params }) => {
    const branch = BRANCHES.find((b) => b.slug === params.branch);
    if (!branch) throw notFound();
    return { branch };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Store not found | Ozon Mobiles" }, { name: "robots", content: "noindex" }],
      };
    }
    const b = loaderData.branch;
    const title = `Mobile Shop & Phone Repair in ${b.seoArea} | ${b.name}`;
    const description = `${b.name} at ${b.address}. Smartphones, accessories and iPhone & Android phone repair in ${b.seoArea}. Call ${b.phoneDisplay} or message us on WhatsApp.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/stores/${b.slug}` },
      ],
      links: [{ rel: "canonical", href: `/stores/${b.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobilePhoneStore",
            name: b.name,
            address: b.address,
            telephone: b.tel,
            areaServed: `${b.seoArea}, Kerala`,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: b.rating,
              reviewCount: b.reviewCount,
            },
          }),
        },
      ],
    };
  },
  component: BranchPage,
});

function BranchPage() {
  const { branch: b } = Route.useLoaderData();

  return (
    <>
      <section className="bg-surface py-12 md:py-16">
        <div className="shell">
          <Link to="/stores" className="text-xs font-semibold text-electric hover:underline">
            ← All stores
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{b.name}</h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{b.address}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5">
              <Star aria-hidden="true" className="size-3.5 text-gold" />
              {b.rating.toFixed(1)} · {b.reviewCount} Google reviews
            </span>
            <span className="rounded-lg bg-card px-3 py-1.5">{b.yearsLabel} serving customers</span>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            <Button asChild variant="hero" size="lg">
              <a href={`tel:${b.tel}`}>
                <Phone />
                Call {b.phoneDisplay}
              </a>
            </Button>
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={waLink(waMessages.store(b.name), b.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle />
                Contact This Store
              </a>
            </Button>
            <Button asChild variant="quiet" size="lg">
              <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">
                <MapPin />
                Get Directions
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Smartphones",
              body: `New and pre-owned phones from leading brands, with EMI options available at ${b.shortName}.`,
              to: "/phones" as const,
              cta: "Explore Phones",
              tint: "bg-tint-blue",
            },
            {
              title: "Accessories",
              body: "Cases, tempered glass, chargers, cables, power banks, earbuds and smartwatches.",
              to: "/accessories" as const,
              cta: "View Accessories",
              tint: "bg-tint-cyan",
            },
            {
              title: "Phone Repair",
              body: "iPhone and Android repair. Selected repairs may be completed within 1 hour depending on the repair and parts availability.",
              to: "/repair" as const,
              cta: "See Repair Services",
              tint: "bg-tint-sand",
            },
          ].map((c) => (
            <article key={c.title} className={`${c.tint} flex flex-col rounded-2xl p-6`}>
              <h2 className="font-display text-lg font-extrabold">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.body}</p>
              <Button asChild variant="quiet" size="sm" className="mt-5 self-start">
                <Link to={c.to}>{c.cta}</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="shell">
          <SectionHeading
            eyebrow="Broken phone?"
            title={`Repair help at ${b.shortName}`}
            body="Send us the device and the problem and a technician will tell you what happens next."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/repair/book">
                <Wrench />
                Book a Repair
              </Link>
            </Button>
            <Button asChild variant="whatsapp" size="lg">
              <a href={waLink(waMessages.repair(), b.id)} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp a Technician
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
