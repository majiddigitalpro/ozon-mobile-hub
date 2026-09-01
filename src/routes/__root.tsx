import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BranchProvider } from "@/lib/branch-store";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { MobileTabBar } from "@/components/site/MobileTabBar";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { Toaster } from "@/components/ui/sonner";
import { BRANCHES } from "@/data/branches";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <div className="max-w-lg text-center">
        <p className="eyebrow text-electric">404</p>
        <h1 className="mt-3 text-balance text-3xl font-extrabold sm:text-4xl">
          Looks like this page changed phones.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Let&apos;s get you back to Ozon Mobiles.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/phones"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-electric px-6 text-sm font-semibold text-electric-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5"
          >
            Explore Phones
          </Link>
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-6 text-sm font-semibold transition-colors hover:border-electric/50"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-20">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">This page didn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try again, or WhatsApp us and we&apos;ll help
          straight away.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-electric px-5 text-sm font-semibold text-electric-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-5 text-sm font-semibold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ozon Mobiles | Smartphones, Accessories & Phone Repair in Kerala" },
      {
        name: "description",
        content:
          "Shop smartphones and accessories and get trusted iPhone and Android phone repair at Ozon Mobiles in Triprayar and Chavakkad.",
      },
      { property: "og:site_name", content: "Ozon Mobiles" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d1526" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Ozon Mobiles",
          slogan: "All About Mobiles",
          department: BRANCHES.map((b) => ({
            "@type": "MobilePhoneStore",
            name: b.name,
            address: b.address,
            telephone: b.tel,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: b.rating,
              reviewCount: b.reviewCount,
            },
          })),
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BranchProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-electric focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-electric-foreground"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pb-16 lg:pb-0">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
        <MobileTabBar />
        <FloatingWhatsApp />
        <Toaster />
      </BranchProvider>
    </QueryClientProvider>
  );
}
