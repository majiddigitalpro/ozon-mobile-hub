import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Timer, Wrench } from "lucide-react";

import repairBench from "@/assets/repair-bench.jpg";
import { Button } from "@/components/ui/button";
import { Badge, SectionHeading } from "@/components/site/Bits";
import { FinalCta } from "@/components/site/FinalCta";
import { BranchSwitcher } from "@/components/site/BranchSwitcher";
import { REPAIR_SERVICES, REPAIR_STEPS } from "@/data/repairs";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/repair/")({
  head: () => ({
    meta: [
      { title: "Phone Repair in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        name: "description",
        content:
          "Expert iPhone and Android phone repair in Triprayar and Chavakkad — screens, batteries, charging, cameras, water damage and software. Selected repairs in as little as 1 hour.",
      },
      { property: "og:title", content: "Phone Repair in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        property: "og:description",
        content:
          "iPhone and Android repair by experienced technicians. Book a repair or WhatsApp a technician.",
      },
      { property: "og:url", content: "/repair" },
    ],
    links: [{ rel: "canonical", href: "/repair" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Mobile phone repair",
          provider: { "@type": "Organization", name: "Ozon Mobiles" },
          areaServed: ["Triprayar, Kerala", "Chavakkad, Kerala"],
        }),
      },
    ],
  }),
  component: RepairPage,
});

const TRANSPARENCY = [
  "We explain the problem before the repair",
  "Professional repair service",
  "iPhone and Android support",
  "Quality-focused service",
  "Local store support at both branches",
  "Selected fast repairs available",
];

const TINTS = ["bg-tint-blue", "bg-tint-cyan", "bg-tint-sand", "bg-tint-mint"];

function RepairPage() {
  const { branchId } = useBranch();

  return (
    <>
      <section className="bg-surface py-12 md:py-16">
        <div className="shell grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Badge tone="electric">iPhone + Android</Badge>
            <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight sm:text-5xl">
              Fast, Trusted <span className="text-electric">Phone Repair</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Expert iPhone and Android repair for screens, batteries, charging problems, cameras,
              software issues and more. Selected repairs may be completed within 1 hour, depending on
              the device and parts availability.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/repair/book">
                  <Wrench />
                  Book a Repair
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="xl">
                <a
                  href={waLink(waMessages.repair(), branchId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  WhatsApp a Technician
                </a>
              </Button>
            </div>
            <div className="mt-7 max-w-xs">
              <p className="eyebrow mb-2 text-muted-foreground">Preferred branch</p>
              <BranchSwitcher />
            </div>
          </div>
          <img
            src={repairBench}
            alt="Technician repairing a smartphone at an Ozon Mobiles service bench"
            width={1408}
            height={1008}
            className="w-full rounded-3xl object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <SectionHeading
            eyebrow="Repair services"
            title="What we repair"
            body="Tell us the symptom — we'll diagnose the cause and explain the repair before anything starts."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REPAIR_SERVICES.map((s, i) => (
              <article
                key={s.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
              >
                <div className={`${TINTS[i % TINTS.length]} px-5 py-6`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-lg font-extrabold">{s.title}</h3>
                    <Badge tone="electric">{s.deviceType}</Badge>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <Timer aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-electric" />
                    {s.turnaroundLabel}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{s.considerations}</p>
                  <p className="mt-2 text-xs font-semibold">{s.branches}</p>
                  <Button asChild variant="whatsapp" size="sm" className="mt-4">
                    <a
                      href={waLink(waMessages.repair("[model]", s.title), branchId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle />
                      WhatsApp a Technician
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-dark section-y">
        <div className="shell">
          <SectionHeading onDark eyebrow="How it works" title="Four simple steps" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REPAIR_STEPS.map((s) => (
              <li key={s.step} className="glass-dark rounded-2xl p-6">
                <span className="font-display text-2xl font-extrabold text-cyan">{s.step}</span>
                <h3 className="mt-3 font-display text-base font-bold text-navy-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-foreground/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Transparency"
            title="Clearer Repairs. Less Guesswork."
            body="Most repair worries come down to not knowing what's happening to your phone. We keep that part simple."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {TRANSPARENCY.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-sm font-medium"
              >
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-electric" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
