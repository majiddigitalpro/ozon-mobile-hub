import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ACCESSORY_CATEGORIES } from "@/data/accessories";
import { OFFER_CATEGORIES } from "@/data/offers";
import { BRANCHES } from "@/data/branches";
import {
  claimFirstAdmin,
  deleteAccessory,
  deleteOffer,
  deleteProduct,
  getAdminStatus,
  listAdminCatalogue,
  saveAccessory,
  saveOffer,
  saveProduct,
} from "@/lib/catalogue.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Product Manager | Ozon Mobiles Staff" },
      {
        name: "description",
        content:
          "Ozon Mobiles staff dashboard for adding and editing phones, accessories and offers shown on the website.",
      },
      { property: "og:title", content: "Product Manager | Ozon Mobiles Staff" },
      {
        property: "og:description",
        content: "Add and edit phones, accessories and offers for the Ozon Mobiles website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type ProductForm = {
  id: string;
  brand: string;
  name: string;
  condition: "new" | "pre-owned";
  price: string;
  storage: string;
  ram: string;
  colours: string;
  os: "iOS" | "Android";
  fiveG: boolean;
  displayInches: string;
  battery: string;
  mainCameraMp: string;
  keySpec: string;
  specs: string;
  branches: string[];
  financeAvailable: boolean;
  featured: boolean;
  popular: boolean;
  published: boolean;
  imageUrl: string;
  sortOrder: string;
};

const emptyProduct: ProductForm = {
  id: "",
  brand: "",
  name: "",
  condition: "new",
  price: "",
  storage: "128, 256",
  ram: "8",
  colours: "",
  os: "Android",
  fiveG: true,
  displayInches: "6.7",
  battery: "5000",
  mainCameraMp: "50",
  keySpec: "",
  specs: "",
  branches: ["triprayar", "chavakkad"],
  financeAvailable: true,
  featured: false,
  popular: false,
  published: true,
  imageUrl: "",
  sortOrder: "0",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const numList = (s: string) =>
  s
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v > 0);

const strList = (s: string) =>
  s
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const status = useServerFn(getAdminStatus);
  const claim = useServerFn(claimFirstAdmin);

  const statusQuery = useQuery({ queryKey: ["admin-status"], queryFn: () => status() });

  const claimMutation = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => {
      toast.success("You now have admin access.");
      queryClient.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <section className="section-y">
      <div className="shell">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-electric">Staff area</p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-3xl">Product manager</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Everything you add here appears on the website straight away.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="quiet" size="sm">
              <Link to="/phones">View site</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut />
              Sign out
            </Button>
          </div>
        </div>

        {statusQuery.isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        ) : statusQuery.data?.isAdmin ? (
          <CatalogueManager />
        ) : (
          <div className="mt-8 max-w-lg rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">No admin access yet</h2>
            {statusQuery.data && statusQuery.data.adminCount === 0 ? (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nobody manages this catalogue yet. Claim admin access for this account to get
                  started — after that, only you can hand out access.
                </p>
                <Button
                  variant="hero"
                  className="mt-4"
                  disabled={claimMutation.isPending}
                  onClick={() => claimMutation.mutate()}
                >
                  Claim admin access
                </Button>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                This account cannot manage products. Ask the Ozon Mobiles admin to give your account
                access.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function CatalogueManager() {
  const queryClient = useQueryClient();
  const list = useServerFn(listAdminCatalogue);
  const catalogue = useQuery({ queryKey: ["admin-catalogue"], queryFn: () => list() });

  const saveProductFn = useServerFn(saveProduct);
  const deleteProductFn = useServerFn(deleteProduct);
  const saveAccessoryFn = useServerFn(saveAccessory);
  const deleteAccessoryFn = useServerFn(deleteAccessory);
  const saveOfferFn = useServerFn(saveOffer);
  const deleteOfferFn = useServerFn(deleteOffer);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-catalogue"] });

  const [productForm, setProductForm] = useState<ProductForm | null>(null);
  const [accessoryForm, setAccessoryForm] = useState<{
    id: string;
    original: string | null;
    name: string;
    category: string;
    blurb: string;
    price: string;
    imageUrl: string;
    published: boolean;
    sortOrder: string;
  } | null>(null);
  const [offerForm, setOfferForm] = useState<{
    id: string | null;
    title: string;
    description: string;
    category: string;
    branches: string[];
    expiresOn: string;
    active: boolean;
  } | null>(null);

  const run = async (fn: () => Promise<unknown>, message: string) => {
    try {
      await fn();
      toast.success(message);
      await refresh();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      return false;
    }
  };

  if (catalogue.isLoading) return <p className="mt-10 text-sm text-muted-foreground">Loading…</p>;
  if (catalogue.error)
    return <p className="mt-10 text-sm text-destructive">{(catalogue.error as Error).message}</p>;

  const data = catalogue.data!;

  return (
    <Tabs defaultValue="phones" className="mt-8">
      <TabsList>
        <TabsTrigger value="phones">Phones ({data.products.length})</TabsTrigger>
        <TabsTrigger value="accessories">Accessories ({data.accessories.length})</TabsTrigger>
        <TabsTrigger value="offers">Offers ({data.offers.length})</TabsTrigger>
      </TabsList>

      {/* PHONES ---------------------------------------------------------- */}
      <TabsContent value="phones" className="mt-6">
        <Button variant="hero" onClick={() => setProductForm({ ...emptyProduct })}>
          <Plus />
          Add phone
        </Button>
        <div className="mt-4 space-y-2">
          {data.products.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">
                  {p.brand} {p.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.condition === "new" ? "New" : "Pre-Owned"} ·{" "}
                  {p.price === null ? "Price on enquiry" : `₹${p.price.toLocaleString("en-IN")}`}
                  {p.published ? "" : " · Hidden"}
                  {p.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() =>
                    setProductForm({
                      id: p.id,
                      brand: p.brand,
                      name: p.name,
                      condition: p.condition,
                      price: p.price === null ? "" : String(p.price),
                      storage: p.storage.join(", "),
                      ram: p.ram.join(", "),
                      colours: p.colours.join(", "),
                      os: p.os,
                      fiveG: p.fiveG,
                      displayInches: String(p.displayInches),
                      battery: String(p.battery),
                      mainCameraMp: String(p.mainCameraMp),
                      keySpec: p.keySpec,
                      specs: p.specs.map((s) => `${s.label}: ${s.value}`).join("\n"),
                      branches: p.branches,
                      financeAvailable: p.financeAvailable,
                      featured: p.featured,
                      popular: p.popular,
                      published: p.published,
                      imageUrl: p.imageUrl ?? "",
                      sortOrder: String(p.sortOrder),
                    })
                  }
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!window.confirm(`Remove ${p.name} from the website?`)) return;
                    void run(() => deleteProductFn({ data: { id: p.id } }), "Phone removed");
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* ACCESSORIES ----------------------------------------------------- */}
      <TabsContent value="accessories" className="mt-6">
        <Button
          variant="hero"
          onClick={() =>
            setAccessoryForm({
              id: "",
              original: null,
              name: "",
              category: ACCESSORY_CATEGORIES[0]!.name,
              blurb: "",
              price: "",
              imageUrl: "",
              published: true,
              sortOrder: "0",
            })
          }
        >
          <Plus />
          Add accessory
        </Button>
        <div className="mt-4 space-y-2">
          {data.accessories.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.category} ·{" "}
                  {a.price === null ? "Price on enquiry" : `₹${a.price.toLocaleString("en-IN")}`}
                  {a.published ? "" : " · Hidden"}
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={() =>
                    setAccessoryForm({
                      id: a.id,
                      original: a.id,
                      name: a.name,
                      category: a.category,
                      blurb: a.blurb,
                      price: a.price === null ? "" : String(a.price),
                      imageUrl: a.imageUrl ?? "",
                      published: a.published,
                      sortOrder: String(a.sortOrder),
                    })
                  }
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!window.confirm(`Remove ${a.name}?`)) return;
                    void run(
                      () => deleteAccessoryFn({ data: { id: a.id } }),
                      "Accessory removed",
                    );
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* OFFERS ---------------------------------------------------------- */}
      <TabsContent value="offers" className="mt-6">
        <Button
          variant="hero"
          onClick={() =>
            setOfferForm({
              id: null,
              title: "",
              description: "",
              category: OFFER_CATEGORIES[0]!,
              branches: ["triprayar", "chavakkad"],
              expiresOn: "",
              active: true,
            })
          }
        >
          <Plus />
          Add offer
        </Button>
        {data.offers.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No offers yet. Anything you add here shows on the Offers page.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {data.offers.map((o) => (
              <div
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold">{o.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.category}
                    {o.expiresOn ? ` · until ${o.expiresOn}` : ""}
                    {o.active ? "" : " · Not showing"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="quiet"
                    size="sm"
                    onClick={() =>
                      setOfferForm({
                        id: o.id,
                        title: o.title,
                        description: o.description,
                        category: o.category,
                        branches: Array.isArray(o.branches) ? o.branches : [],
                        expiresOn: o.expiresOn ?? "",
                        active: o.active,
                      })
                    }
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!window.confirm(`Remove ${o.title}?`)) return;
                      void run(() => deleteOfferFn({ data: { id: o.id } }), "Offer removed");
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* PHONE DIALOG ---------------------------------------------------- */}
      <Dialog open={productForm !== null} onOpenChange={(o) => !o && setProductForm(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{productForm?.id ? "Edit phone" : "Add phone"}</DialogTitle>
          </DialogHeader>
          {productForm && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Brand">
                <Input
                  value={productForm.brand}
                  maxLength={60}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                />
              </Field>
              <Field label="Model name">
                <Input
                  value={productForm.name}
                  maxLength={120}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      name: e.target.value,
                      id: productForm.id || "",
                    })
                  }
                />
              </Field>
              <Field label="Price (₹) — leave blank for “ask for price”">
                <Input
                  value={productForm.price}
                  inputMode="numeric"
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                />
              </Field>
              <Field label="Condition">
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={productForm.condition}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      condition: e.target.value as "new" | "pre-owned",
                    })
                  }
                >
                  <option value="new">New</option>
                  <option value="pre-owned">Pre-Owned</option>
                </select>
              </Field>
              <Field label="Operating system">
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={productForm.os}
                  onChange={(e) =>
                    setProductForm({ ...productForm, os: e.target.value as "iOS" | "Android" })
                  }
                >
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                </select>
              </Field>
              <Field label="Storage options (GB, comma separated)">
                <Input
                  value={productForm.storage}
                  onChange={(e) => setProductForm({ ...productForm, storage: e.target.value })}
                />
              </Field>
              <Field label="RAM options (GB, comma separated)">
                <Input
                  value={productForm.ram}
                  onChange={(e) => setProductForm({ ...productForm, ram: e.target.value })}
                />
              </Field>
              <Field label="Colours (comma separated)">
                <Input
                  value={productForm.colours}
                  onChange={(e) => setProductForm({ ...productForm, colours: e.target.value })}
                />
              </Field>
              <Field label="Screen size (inches)">
                <Input
                  value={productForm.displayInches}
                  inputMode="decimal"
                  onChange={(e) =>
                    setProductForm({ ...productForm, displayInches: e.target.value })
                  }
                />
              </Field>
              <Field label="Battery (mAh)">
                <Input
                  value={productForm.battery}
                  inputMode="numeric"
                  onChange={(e) => setProductForm({ ...productForm, battery: e.target.value })}
                />
              </Field>
              <Field label="Main camera (MP)">
                <Input
                  value={productForm.mainCameraMp}
                  inputMode="numeric"
                  onChange={(e) => setProductForm({ ...productForm, mainCameraMp: e.target.value })}
                />
              </Field>
              <Field label="Display order (smaller shows first)">
                <Input
                  value={productForm.sortOrder}
                  inputMode="numeric"
                  onChange={(e) => setProductForm({ ...productForm, sortOrder: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Short highlight line">
                  <Input
                    value={productForm.keySpec}
                    maxLength={200}
                    onChange={(e) => setProductForm({ ...productForm, keySpec: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Spec list — one per line, like “Display: 6.7 inch AMOLED”">
                  <Textarea
                    rows={4}
                    value={productForm.specs}
                    onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Photo link (optional)">
                  <Input
                    value={productForm.imageUrl}
                    placeholder="https://…"
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                <BranchPicker
                  value={productForm.branches}
                  onChange={(branches) => setProductForm({ ...productForm, branches })}
                />
                <div className="space-y-2">
                  <Toggle
                    label="5G"
                    checked={productForm.fiveG}
                    onChange={(fiveG) => setProductForm({ ...productForm, fiveG })}
                  />
                  <Toggle
                    label="EMI available"
                    checked={productForm.financeAvailable}
                    onChange={(financeAvailable) =>
                      setProductForm({ ...productForm, financeAvailable })
                    }
                  />
                  <Toggle
                    label="Show on home page"
                    checked={productForm.featured}
                    onChange={(featured) => setProductForm({ ...productForm, featured })}
                  />
                  <Toggle
                    label="Mark as popular"
                    checked={productForm.popular}
                    onChange={(popular) => setProductForm({ ...productForm, popular })}
                  />
                  <Toggle
                    label="Visible on website"
                    checked={productForm.published}
                    onChange={(published) => setProductForm({ ...productForm, published })}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setProductForm(null)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={async () => {
                if (!productForm) return;
                const id = productForm.id || slugify(`${productForm.brand} ${productForm.name}`);
                const ok = await run(
                  () =>
                    saveProductFn({
                      data: {
                        id,
                        brand: productForm.brand,
                        name: productForm.name,
                        condition: productForm.condition,
                        price: productForm.price.trim() ? Number(productForm.price) : null,
                        originalPrice: null,
                        storage: numList(productForm.storage),
                        ram: numList(productForm.ram),
                        colours: strList(productForm.colours),
                        os: productForm.os,
                        fiveG: productForm.fiveG,
                        displayInches: Number(productForm.displayInches),
                        battery: Number(productForm.battery),
                        mainCameraMp: Number(productForm.mainCameraMp),
                        keySpec: productForm.keySpec,
                        specs: productForm.specs
                          .split("\n")
                          .map((line) => line.split(":"))
                          .filter((parts) => parts.length >= 2)
                          .map((parts) => ({
                            label: parts[0]!.trim(),
                            value: parts.slice(1).join(":").trim(),
                          })),
                        branches: productForm.branches,
                        financeAvailable: productForm.financeAvailable,
                        featured: productForm.featured,
                        popular: productForm.popular,
                        published: productForm.published,
                        imageUrl: productForm.imageUrl.trim() || null,
                        sortOrder: Number(productForm.sortOrder) || 0,
                      },
                    }),
                  "Phone saved",
                );
                if (ok) setProductForm(null);
              }}
            >
              Save phone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ACCESSORY DIALOG ------------------------------------------------ */}
      <Dialog open={accessoryForm !== null} onOpenChange={(o) => !o && setAccessoryForm(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {accessoryForm?.original ? "Edit accessory" : "Add accessory"}
            </DialogTitle>
          </DialogHeader>
          {accessoryForm && (
            <div className="grid gap-4">
              <Field label="Name">
                <Input
                  value={accessoryForm.name}
                  maxLength={120}
                  onChange={(e) => setAccessoryForm({ ...accessoryForm, name: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={accessoryForm.category}
                  onChange={(e) =>
                    setAccessoryForm({ ...accessoryForm, category: e.target.value })
                  }
                >
                  {ACCESSORY_CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Short description">
                <Textarea
                  rows={3}
                  value={accessoryForm.blurb}
                  maxLength={300}
                  onChange={(e) => setAccessoryForm({ ...accessoryForm, blurb: e.target.value })}
                />
              </Field>
              <Field label="Price (₹) — leave blank for “ask for price”">
                <Input
                  value={accessoryForm.price}
                  inputMode="numeric"
                  onChange={(e) => setAccessoryForm({ ...accessoryForm, price: e.target.value })}
                />
              </Field>
              <Field label="Photo link (optional)">
                <Input
                  value={accessoryForm.imageUrl}
                  placeholder="https://…"
                  onChange={(e) => setAccessoryForm({ ...accessoryForm, imageUrl: e.target.value })}
                />
              </Field>
              <Field label="Display order (smaller shows first)">
                <Input
                  value={accessoryForm.sortOrder}
                  inputMode="numeric"
                  onChange={(e) =>
                    setAccessoryForm({ ...accessoryForm, sortOrder: e.target.value })
                  }
                />
              </Field>
              <Toggle
                label="Visible on website"
                checked={accessoryForm.published}
                onChange={(published) => setAccessoryForm({ ...accessoryForm, published })}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAccessoryForm(null)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={async () => {
                if (!accessoryForm) return;
                const id = accessoryForm.original ?? slugify(accessoryForm.name);
                const ok = await run(
                  () =>
                    saveAccessoryFn({
                      data: {
                        id,
                        name: accessoryForm.name,
                        category: accessoryForm.category,
                        blurb: accessoryForm.blurb,
                        price: accessoryForm.price.trim() ? Number(accessoryForm.price) : null,
                        imageUrl: accessoryForm.imageUrl.trim() || null,
                        published: accessoryForm.published,
                        sortOrder: Number(accessoryForm.sortOrder) || 0,
                      },
                    }),
                  "Accessory saved",
                );
                if (ok) setAccessoryForm(null);
              }}
            >
              Save accessory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OFFER DIALOG ---------------------------------------------------- */}
      <Dialog open={offerForm !== null} onOpenChange={(o) => !o && setOfferForm(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{offerForm?.id ? "Edit offer" : "Add offer"}</DialogTitle>
          </DialogHeader>
          {offerForm && (
            <div className="grid gap-4">
              <Field label="Title">
                <Input
                  value={offerForm.title}
                  maxLength={120}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                />
              </Field>
              <Field label="Details">
                <Textarea
                  rows={3}
                  value={offerForm.description}
                  maxLength={500}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                />
              </Field>
              <Field label="Category">
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={offerForm.category}
                  onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                >
                  {OFFER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Last day of the offer (optional)">
                <Input
                  type="date"
                  value={offerForm.expiresOn}
                  onChange={(e) => setOfferForm({ ...offerForm, expiresOn: e.target.value })}
                />
              </Field>
              <BranchPicker
                value={offerForm.branches}
                onChange={(branches) => setOfferForm({ ...offerForm, branches })}
              />
              <Toggle
                label="Showing on website"
                checked={offerForm.active}
                onChange={(active) => setOfferForm({ ...offerForm, active })}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOfferForm(null)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={async () => {
                if (!offerForm) return;
                const ok = await run(
                  () =>
                    saveOfferFn({
                      data: {
                        id: offerForm.id,
                        title: offerForm.title,
                        description: offerForm.description,
                        category: offerForm.category,
                        branches: offerForm.branches,
                        expiresOn: offerForm.expiresOn.trim() || null,
                        active: offerForm.active,
                      },
                    }),
                  "Offer saved",
                );
                if (ok) setOfferForm(null);
              }}
            >
              Save offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
      {label}
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function BranchPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Available at</Label>
      <div className="space-y-2">
        {BRANCHES.map((b) => (
          <label
            key={b.id}
            className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
          >
            {b.shortName}
            <Switch
              checked={value.includes(b.id)}
              onCheckedChange={(on) =>
                onChange(on ? [...value, b.id] : value.filter((v) => v !== b.id))
              }
            />
          </label>
        ))}
      </div>
    </div>
  );
}
