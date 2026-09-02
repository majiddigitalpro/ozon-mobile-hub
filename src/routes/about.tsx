import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Sparkles, Store, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/Bits";
import { FinalCta } from "@/components/site/FinalCta";
import { BRANCHES } from "@/data/branches";
import { useBranch } from "@/lib/branch-store";
import { waLink, waMessages } from "@/lib/whatsapp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Ozon Mobiles | All About Mobiles in Kerala" },
      {
        name: "description",
        content:
          "Ozon Mobiles is a local smartphone and phone-repair business in Triprayar and Chavakkad, Kerala — honest advice, transparent repairs and real people you can talk to.",
      },
      { property: "og:title", content: "About Ozon Mobiles | All About Mobiles" },
      {
        property: "og:description",
        content: "Why thousands of local customers trust Ozon Mobiles for phones and repairs.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Honest advice first",
    body: "We recommend what actually fits your budget and usage — not whatever earns us the most that day.",
  },
  {
    icon: Wrench,
    title: "Transparent repairs",
    body: "You hear the diagnosis and what the repair involves before we start. No surprises when you collect the device.",
  },
  {
    icon: Store,
    title: "A real local shop",
    body: "Two branches you can walk into, with staff who remember you and phone numbers a person actually answers.",
  },
  {
    icon: Sparkles,
    title: "All about mobiles",
    body: "Phones, accessories, EMI guidance and repair — one place for everything your phone needs.",
  },
];

function AboutPage() {
  const { branchId } = useBranch();
  const reviews = BRANCHES.reduce((sum, b) => sum + b.reviewCount, 0);

  return (
    <>
      <section className="bg-surface py-14 md:py-20">
        <div className="shell max-w-3xl">
          <p className="eyebrow text-electric">About us</p>
          <h1 className="mt-3 text-balance text-3xl font-extrabold sm:text-5xl">
            All About Mobiles — from two shops in Kerala
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-lg">
            Ozon Mobiles started as a single neighbourhood mobile shop in Triprayar and grew the way
            local businesses do: one honest conversation at a time. Today we run two branches, sell
            smartphones and accessories from the brands people here actually buy, and repair iPhones
            and Android devices in-house.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nothing about that is complicated. You tell us what you need or what broke; we tell you
            the realistic options, the cost and the timeline. That is the whole promise.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-tint-blue p-6 text-center">
              <p className="font-display text-4xl font-extrabold text-electric">{reviews}+</p>
              <p className="mt-1 text-sm font-semibold">Google reviews</p>
            </div>
            <div className="rounded-2xl bg-tint-cyan p-6 text-center">
              <p className="font-display text-4xl font-extrabold text-electric">2</p>
              <p className="mt-1 text-sm font-semibold">Branches in Kerala</p>
            </div>
            <div className="rounded-2xl bg-tint-sand p-6 text-center">
              <p className="font-display text-4xl font-extrabold text-electric">7+</p>
              <p className="mt-1 text-sm font-semibold">Years serving customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="shell">
          <SectionHeading
            eyebrow="What we stand for"
            title="Why people keep coming back"
            body="Four things we refuse to compromise on."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <Icon aria-hidden="true" className="size-6 text-electric" />
                <h2 className="mt-4 font-display text-lg font-extrabold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="shell grid gap-6 md:grid-cols-2">
          {BRANCHES.map((b) => (
            <article key={b.id} className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-extrabold">{b.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{b.address}</p>
              <Link
                to="/stores/$branch"
                params={{ branch: b.slug }}
                className="mt-4 inline-block text-sm font-semibold text-electric hover:underline"
              >
                Branch details →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-y pt-0">
        <div className="shell rounded-3xl bg-tint-blue p-8 text-center md:p-12">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            Questions before you visit?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            Message us and a real person from the shop will reply.
          </p>
          <Button asChild variant="whatsapp" size="xl" className="mt-6">
            <a href={waLink(waMessages.general, branchId)} target="_blank" rel="noopener noreferrer">
              <MessageCircle />
              WhatsApp Ozon Mobiles
            </a>
          </Button>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
