import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BatteryCharging,
  CreditCard,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Timer,
  Wrench,
} from "lucide-react";

import heroPhones from "@/assets/hero-phones.jpg";
import repairBench from "@/assets/repair-bench.jpg";
import accessoriesImg from "@/assets/accessories.jpg";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/Bits";
import { ProductCard } from "@/components/site/ProductCard";
import { BranchSwitcher } from "@/components/site/BranchSwitcher";
import { FinalCta } from "@/components/site/FinalCta";
import { BRANCHES, FINANCE_PARTNERS } from "@/data/branches";
import { BRANDS, PRODUCTS } from "@/data/products";
import { ACCESSORY_CATEGORIES } from "@/data/accessories";
import { REPAIR_STEPS } from "@/data/repairs";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ozon Mobiles | Smartphones, Accessories & Phone Repair in Kerala" },
      {
        name: "description",
        content:
          "Shop smartphones and accessories and get trusted iPhone and Android phone repair at Ozon Mobiles in Triprayar and Chavakkad. Explore phones, EMI options and fast selected repair services.",
      },
      {
        property: "og:title",
        content: "Ozon Mobiles | Smartphones, Accessories & Phone Repair in Kerala",
      },
      {
        property: "og:description",
        content:
          "Smartphones, accessories and expert iPhone & Android repair in Triprayar and Chavakkad.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const TRUST = [
  { icon: BadgeCheck, label: "7+ Years in Triprayar" },
  { icon: Star, label: "4.9★ Google Rating" },
  { icon: Star, label: "5.0★ Chavakkad Rating" },
  { icon: Wrench, label: "iPhone + Android Repair" },
  { icon: CreditCard, label: "Flexible EMI Options" },
];

const SERVICES = [
  {
    icon: Smartphone,
    title: "Smartphones",
    body: "Find the right phone for your needs and budget.",
    cta: "Explore Phones",
    to: "/phones" as const,
  },
  {
    icon: ShieldCheck,
    title: "Accessories",
    body: "Protect, power and upgrade your smartphone.",
    cta: "Explore Accessories",
    to: "/accessories" as const,
  },
  {
    icon: Wrench,
    title: "Phone Repair",
    body: "Expert iPhone and Android repair from experienced technicians.",
    cta: "Book a Repair",
    to: "/repair/book" as const,
  },
  {
    icon: CreditCard,
    title: "EMI & Finance",
    body: "Make your next smartphone easier to own with available finance options.",
    cta: "See Finance Options",
    to: "/about" as const,
  },
];

const WHY = [
  {
    icon: Sparkles,
    title: "Better Value",
    body: "Competitive pricing across smartphones and accessories.",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Service",
    body: "A local mobile business with a strong customer review profile.",
  },
  {
    icon: Wrench,
    title: "Expert Repairs",
    body: "iPhone and Android repair handled by experienced technicians.",
  },
  {
    icon: Timer,
    title: "Fast Selected Repairs",
    body: "Selected repairs may be completed within 1 hour depending on the repair and parts availability.",
  },
  {
    icon: CreditCard,
    title: "Flexible Finance",
    body: "Available finance options including Bajaj Finserv, HDFC and Samsung Finance+.",
  },
  {
    icon: MapPin,
    title: "Local Convenience",
    body: "Two branches serving customers in Triprayar and Chavakkad.",
  },
];

function Home() {
  const { branchId } = useBranch();
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      {/* HERO ---------------------------------------------------------- */}
      <section className="surface-dark relative overflow-hidden">
        <div className="hairline-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="shell relative grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-24">
          <div className="reveal">
            <p className="eyebrow text-cyan">Triprayar · Chavakkad · Kerala</p>
            <h1 className="mt-4 text-balance text-[2rem] font-extrabold leading-[1.08] text-navy-foreground sm:text-5xl lg:text-[3.4rem]">
              Your Phone. Your Choice.{" "}
              <span className="text-cyan">Your Trusted Mobile Store.</span>
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-navy-foreground/75 sm:text-base">
              Explore smartphones, accessories and expert iPhone &amp; Android repairs at Ozon
              Mobiles. Great value, trusted service and local support in Triprayar and Chavakkad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/phones">
                  Explore Phones
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="onDark" size="xl">
                <Link to="/repair/book">
                  <Wrench />
                  Book a Repair
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a
                  href={waLink(waMessages.general, branchId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  WhatsApp Us
                </a>
              </Button>
            </div>
            <div className="mt-8 max-w-xs">
              <p className="eyebrow mb-2 text-navy-foreground/50">Choose your Ozon Mobiles</p>
              <BranchSwitcher onDark />
            </div>
          </div>

          <div className="relative">
            <img
              src={heroPhones}
              alt="Modern smartphones available at Ozon Mobiles"
              width={1600}
              height={1200}
              className="w-full rounded-2xl border border-navy-foreground/10 object-cover shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </section>

      {/* TRUST STRIP --------------------------------------------------- */}
      <section aria-label="Why customers trust Ozon Mobiles" className="border-b border-border bg-surface">
        <ul className="shell grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-3 lg:grid-cols-5">
          {TRUST.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-xs font-semibold sm:text-sm">
              <Icon aria-hidden="true" className="size-4 shrink-0 text-electric" />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* FOUR CORE SERVICES ------------------------------------------- */}
      <section className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow="Buy · Save · Protect · Repair"
            title="Everything your phone needs, in one local store"
            body="Whether you are upgrading, protecting your device or fixing a problem, there is a clear path for you at Ozon Mobiles."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(({ icon: Icon, title, body, cta, to }, i) => (
              <article
                key={title}
                className={`group flex flex-col rounded-xl border border-border p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
                  i === 2 ? "surface-dark border-transparent" : "bg-card"
                }`}
              >
                <span
                  className={`grid size-11 place-items-center rounded-lg ${
                    i === 2 ? "bg-navy-foreground/12 text-cyan" : "bg-electric/10 text-electric"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3
                  className={`mt-5 font-display text-lg font-bold ${
                    i === 2 ? "text-navy-foreground" : ""
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-2 flex-1 text-sm leading-relaxed ${
                    i === 2 ? "text-navy-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {body}
                </p>
                {title === "EMI & Finance" && (
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    {FINANCE_PARTNERS.join(" · ")}
                  </p>
                )}
                <Link
                  to={to}
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${
                    i === 2 ? "text-cyan" : "text-electric"
                  }`}
                >
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PHONES ---------------------------------------------- */}
      <section className="section-y bg-surface">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Phones our customers ask for"
              body="Prices and stock change often, so tap through and we'll confirm the latest on WhatsApp."
            />
            <Button asChild variant="quiet">
              <Link to="/phones">
                View All Phones
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY BRAND ------------------------------------------------ */}
      <section className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow="Shop by brand"
            title="Start with the brand you trust"
            body="Pick a brand to filter the phone catalogue. Ask us about other brands you don't see listed."
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                to="/phones"
                search={{ brand, q: "" }}
                className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="font-display text-sm font-bold">{brand}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-electric"
                />
              </Link>
            ))}
            <Link
              to="/phones"
              search={{ q: "" }}
              className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-border px-4 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:border-electric/40 hover:text-electric"
            >
              Other brands
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY OZON ----------------------------------------------------- */}
      <section className="surface-dark section-y">
        <div className="shell">
          <SectionHeading
            onDark
            eyebrow="Why Ozon Mobiles"
            title="Good phones. Good prices. Trusted service."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-dark rounded-xl p-6">
                <Icon aria-hidden="true" className="size-5 text-cyan" />
                <h3 className="mt-4 font-display text-base font-bold text-navy-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-foreground/70">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REPAIR SPOTLIGHT --------------------------------------------- */}
      <section className="section-y">
        <div className="shell grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <img
            src={repairBench}
            alt="Technician repairing a smartphone at an Ozon Mobiles service bench"
            loading="lazy"
            width={1408}
            height={1008}
            className="w-full rounded-2xl object-cover shadow-[var(--shadow-lift)]"
          />
          <div>
            <SectionHeading
              eyebrow="Phone repair"
              title="Broken phone? Let's get it working again."
              body="Expert iPhone and Android repair for screens, batteries, charging problems, cameras, software issues and more. Selected repairs may be completed within 1 hour, depending on the device and parts availability."
            />
            <ol className="mt-8 space-y-4">
              {REPAIR_STEPS.map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="font-display text-sm font-extrabold text-electric">{s.step}</span>
                  <div>
                    <h3 className="font-display text-sm font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/repair/book">Book a Repair</Link>
              </Button>
              <Button asChild variant="whatsapp" size="lg">
                <a
                  href={waLink(waMessages.repair(), branchId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  WhatsApp a Technician
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/repair">See Repair Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINANCE ------------------------------------------------------ */}
      <section className="section-y bg-surface">
        <div className="shell rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <SectionHeading
                eyebrow="EMI & finance"
                title="Get the Phone You Want, Your Way"
                body="Finance options are available in store, subject to applicable terms and eligibility. Talk to our team and we'll explain what applies to the phone you're choosing."
              />
              <div className="mt-6 flex flex-wrap gap-2">
                {FINANCE_PARTNERS.map((p) => (
                  <span
                    key={p}
                    className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-xl bg-secondary p-6">
              <BatteryCharging aria-hidden="true" className="size-5 text-electric" />
              <p className="text-sm text-muted-foreground">
                Ask us which finance option suits your budget before you decide on a phone.
              </p>
              <Button asChild variant="whatsapp" size="lg" className="mt-1">
                <a
                  href={waLink(waMessages.finance, branchId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  Ask About EMI
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ACCESSORIES -------------------------------------------------- */}
      <section className="section-y">
        <div className="shell grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Accessories"
              title="Protect, power and upgrade"
              body="Cases, tempered glass, chargers, cables, power banks, earbuds, smartwatches and more — fitted and checked in store."
            />
            <ul className="mt-6 flex flex-wrap gap-2">
              {ACCESSORY_CATEGORIES.slice(0, 8).map((c) => (
                <li
                  key={c.name}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground"
                >
                  {c.name}
                </li>
              ))}
            </ul>
            <Button asChild variant="quiet" size="lg" className="mt-7">
              <Link to="/accessories">
                View Accessories
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <img
            src={accessoriesImg}
            alt="Phone cases, cables, power bank, earbuds and a smartwatch available at Ozon Mobiles"
            loading="lazy"
            width={1408}
            height={1008}
            className="w-full rounded-2xl object-cover shadow-[var(--shadow-lift)]"
          />
        </div>
      </section>

      {/* BRANCHES + REVIEWS ------------------------------------------ */}
      <section className="section-y bg-surface">
        <div className="shell">
          <SectionHeading
            eyebrow="Our stores"
            title="Two branches, close to home"
            body="Come in for a hands-on look, a repair diagnosis or a straight answer about pricing."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {BRANCHES.map((b) => (
              <article
                key={b.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{b.shortName}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-secondary px-3 py-2 text-center">
                    <span className="block font-display text-base font-extrabold text-electric">
                      {b.rating.toFixed(1)}★
                    </span>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {b.reviewCount} reviews
                    </span>
                  </span>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {b.yearsLabel} · Google rated
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button asChild variant="quiet" size="sm">
                    <a href={`tel:${b.tel}`}>Call Store</a>
                  </Button>
                  <Button asChild variant="whatsapp" size="sm">
                    <a
                      href={waLink(waMessages.store(b.name), b.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contact This Store
                    </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <a href={b.mapsUrl} target="_blank" rel="noopener noreferrer">
                      Get Directions
                    </a>
                  </Button>
                </div>
                <Link
                  to="/stores/$branch"
                  params={{ branch: b.slug }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
                >
                  Branch details
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
