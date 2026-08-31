import { createFileRoute, Link } from "@tanstack/react-router";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EmptyState, SectionHeading } from "@/components/site/Bits";
import { ProductCard } from "@/components/site/ProductCard";
import { BRANDS, PRODUCTS, type Product } from "@/data/products";
import { waMessages } from "@/lib/whatsapp";

type Search = { brand?: string; q?: string };

export const Route = createFileRoute("/phones/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    brand: typeof search.brand === "string" ? search.brand : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Smartphones in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        name: "description",
        content:
          "Browse new and pre-owned smartphones at Ozon Mobiles Triprayar and Chavakkad. Filter by brand, storage, RAM, 5G and more, then enquire on WhatsApp for the latest price.",
      },
      { property: "og:title", content: "Smartphones in Triprayar & Chavakkad | Ozon Mobiles" },
      {
        property: "og:description",
        content: "New and pre-owned smartphones from leading brands, with EMI options available.",
      },
      { property: "og:url", content: "/phones" },
    ],
    links: [{ rel: "canonical", href: "/phones" }],
  }),
  component: PhonesPage,
});

type Filters = {
  brands: string[];
  condition: "all" | "new" | "pre-owned";
  os: "all" | "iOS" | "Android";
  storage: number[];
  ram: number[];
  fiveG: boolean;
  minCamera: number;
  minDisplay: number;
  minBattery: number;
};

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Popular" },
];

function PhonesPage() {
  const { brand, q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [sort, setSort] = useState("recommended");
  const [filters, setFilters] = useState<Filters>({
    brands: brand ? [brand] : [],
    condition: "all",
    os: "all",
    storage: [],
    ram: [],
    fiveG: false,
    minCamera: 0,
    minDisplay: 0,
    minBattery: 0,
  });

  const results = useMemo(() => {
    const list = PRODUCTS.filter((p) => {
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.condition !== "all" && p.condition !== filters.condition) return false;
      if (filters.os !== "all" && p.os !== filters.os) return false;
      if (filters.storage.length && !p.storage.some((s) => filters.storage.includes(s))) return false;
      if (filters.ram.length && !p.ram.some((r) => filters.ram.includes(r))) return false;
      if (filters.fiveG && !p.fiveG) return false;
      if (p.mainCameraMp < filters.minCamera) return false;
      if (p.displayInches < filters.minDisplay) return false;
      if (p.battery < filters.minBattery) return false;
      if (query.trim()) {
        const needle = query.trim().toLowerCase();
        if (!`${p.brand} ${p.name} ${p.keySpec}`.toLowerCase().includes(needle)) return false;
      }
      return true;
    });

    const byPrice = (a: Product, b: Product, dir: 1 | -1) => {
      if (a.price === null && b.price === null) return 0;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return (a.price - b.price) * dir;
    };

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => byPrice(a, b, 1));
      case "price-desc":
        return [...list].sort((a, b) => byPrice(a, b, -1));
      case "newest":
        return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case "popular":
        return [...list].sort((a, b) => Number(b.popular) - Number(a.popular));
      default:
        return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [filters, query, sort]);

  const activeCount =
    filters.brands.length +
    filters.storage.length +
    filters.ram.length +
    (filters.condition !== "all" ? 1 : 0) +
    (filters.os !== "all" ? 1 : 0) +
    (filters.fiveG ? 1 : 0) +
    (filters.minCamera ? 1 : 0) +
    (filters.minDisplay ? 1 : 0) +
    (filters.minBattery ? 1 : 0);

  const reset = () =>
    setFilters({
      brands: [],
      condition: "all",
      os: "all",
      storage: [],
      ram: [],
      fiveG: false,
      minCamera: 0,
      minDisplay: 0,
      minBattery: 0,
    });

  const panel = <FilterPanel filters={filters} setFilters={setFilters} onReset={reset} />;

  return (
    <>
      <section className="surface-dark py-12 md:py-16">
        <div className="shell">
          <SectionHeading
            onDark
            eyebrow="Phones"
            title="Find the right phone for your budget"
            body="New and pre-owned smartphones from leading brands. Prices and stock change often, so enquire on WhatsApp and we'll confirm the latest."
          />
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brand or model"
                aria-label="Search phones"
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

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="quiet" size="lg" className="lg:hidden">
                    <SlidersHorizontal />
                    Filters{activeCount ? ` (${activeCount})` : ""}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
                  <SheetHeader>
                    <SheetTitle>Filter phones</SheetTitle>
                  </SheetHeader>
                  <div className="pb-6">{panel}</div>
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-11 w-full min-w-44 lg:w-56" aria-label="Sort phones">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                {panel}
              </div>
            </aside>

            <div>
              <p className="mb-4 text-sm text-muted-foreground" role="status">
                {results.length} phone{results.length === 1 ? "" : "s"} listed
              </p>
              {results.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {results.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No phones found"
                  body="Try adjusting your filters or ask our team to help you find the right device."
                  ctaLabel="Ask on WhatsApp"
                  message={waMessages.help}
                >
                  <Button variant="quiet" onClick={reset}>
                    Clear filters
                  </Button>
                </EmptyState>
              )}
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Looking for a model that isn&apos;t listed?{" "}
            <Link to="/stores" className="font-semibold text-electric">
              Contact your nearest branch
            </Link>{" "}
            and we&apos;ll check what we can source.
          </div>
        </div>
      </section>
    </>
  );
}

function FilterPanel({
  filters,
  setFilters,
  onReset,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onReset: () => void;
}) {
  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-bold uppercase tracking-wide">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-electric hover:underline"
        >
          Reset
        </button>
      </div>

      <fieldset>
        <legend className="eyebrow text-muted-foreground">Brand</legend>
        <div className="mt-3 space-y-2.5">
          {BRANDS.map((b) => (
            <div key={b} className="flex items-center gap-2.5">
              <Checkbox
                id={`brand-${b}`}
                checked={filters.brands.includes(b)}
                onCheckedChange={() =>
                  setFilters((f) => ({ ...f, brands: toggle(f.brands, b) }))
                }
              />
              <Label htmlFor={`brand-${b}`} className="text-sm font-medium">
                {b}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-muted-foreground">Condition</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["all", "new", "pre-owned"] as const).map((c) => (
            <Button
              key={c}
              type="button"
              size="sm"
              variant={filters.condition === c ? "hero" : "quiet"}
              onClick={() => setFilters((f) => ({ ...f, condition: c }))}
            >
              {c === "all" ? "All" : c === "new" ? "New" : "Pre-Owned"}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-muted-foreground">Operating system</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["all", "iOS", "Android"] as const).map((o) => (
            <Button
              key={o}
              type="button"
              size="sm"
              variant={filters.os === o ? "hero" : "quiet"}
              onClick={() => setFilters((f) => ({ ...f, os: o }))}
            >
              {o === "all" ? "All" : o}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-muted-foreground">Storage (GB)</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[128, 256, 512, 1024].map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={filters.storage.includes(s) ? "hero" : "quiet"}
              onClick={() => setFilters((f) => ({ ...f, storage: toggle(f.storage, s) }))}
            >
              {s >= 1024 ? "1TB" : s}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow text-muted-foreground">RAM (GB)</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {[4, 8, 12, 16].map((r) => (
            <Button
              key={r}
              type="button"
              size="sm"
              variant={filters.ram.includes(r) ? "hero" : "quiet"}
              onClick={() => setFilters((f) => ({ ...f, ram: toggle(f.ram, r) }))}
            >
              {r}
            </Button>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="filter-5g"
          checked={filters.fiveG}
          onCheckedChange={(v) => setFilters((f) => ({ ...f, fiveG: Boolean(v) }))}
        />
        <Label htmlFor="filter-5g" className="text-sm font-medium">
          5G only
        </Label>
      </div>

      <div>
        <Label htmlFor="filter-camera" className="eyebrow text-muted-foreground">
          Main camera — {filters.minCamera}MP and above
        </Label>
        <Slider
          id="filter-camera"
          className="mt-4"
          value={[filters.minCamera]}
          max={200}
          step={2}
          onValueChange={([v]) => setFilters((f) => ({ ...f, minCamera: v }))}
        />
      </div>

      <div>
        <Label htmlFor="filter-display" className="eyebrow text-muted-foreground">
          Display — {filters.minDisplay.toFixed(1)}&quot; and above
        </Label>
        <Slider
          id="filter-display"
          className="mt-4"
          value={[filters.minDisplay]}
          max={7}
          step={0.1}
          onValueChange={([v]) => setFilters((f) => ({ ...f, minDisplay: v }))}
        />
      </div>

      <div>
        <Label htmlFor="filter-battery" className="eyebrow text-muted-foreground">
          Battery — {filters.minBattery}mAh and above
        </Label>
        <Slider
          id="filter-battery"
          className="mt-4"
          value={[filters.minBattery]}
          max={6000}
          step={100}
          onValueChange={([v]) => setFilters((f) => ({ ...f, minBattery: v }))}
        />
      </div>

      <p className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
        Stock and pricing are confirmed on enquiry, so availability isn&apos;t filtered here.
      </p>
    </div>
  );
}
