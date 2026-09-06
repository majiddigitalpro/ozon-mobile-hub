import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { BranchId } from "@/data/branches";
import type { Accessory, AccessoryCategory } from "@/data/accessories";
import type { Offer, OfferCategory } from "@/data/offers";
import type { Product } from "@/data/products";

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

type ProductRow = Record<string, unknown>;

const num = (v: unknown, fallback = 0) => (v === null || v === undefined ? fallback : Number(v));

export function mapProduct(row: ProductRow): Product & { imageUrl: string | null; published: boolean } {
  return {
    id: String(row["id"]),
    brand: String(row["brand"]),
    name: String(row["name"]),
    category: "smartphone",
    condition: (row["condition"] === "pre-owned" ? "pre-owned" : "new") as Product["condition"],
    price: row["price"] === null || row["price"] === undefined ? null : Number(row["price"]),
    originalPrice:
      row["original_price"] === null || row["original_price"] === undefined
        ? null
        : Number(row["original_price"]),
    storage: ((row["storage"] as number[] | null) ?? []).map(Number),
    ram: ((row["ram"] as number[] | null) ?? []).map(Number),
    colours: ((row["colours"] as string[] | null) ?? []).map(String),
    os: row["os"] === "iOS" ? "iOS" : "Android",
    fiveG: Boolean(row["five_g"]),
    displayInches: num(row["display_inches"], 6.5),
    battery: num(row["battery"], 5000),
    mainCameraMp: num(row["main_camera_mp"], 50),
    keySpec: String(row["key_spec"] ?? ""),
    specs: ((row["specs"] as { label: string; value: string }[] | null) ?? []).map((s) => ({
      label: String(s.label),
      value: String(s.value),
    })),
    availability: "enquire",
    branches: ((row["branches"] as string[] | null) ?? []) as BranchId[],
    financeAvailable: Boolean(row["finance_available"]),
    featured: Boolean(row["featured"]),
    popular: Boolean(row["popular"]),
    createdAt: String(row["created_at"] ?? ""),
    imageUrl: (row["image_url"] as string | null) ?? null,
    published: Boolean(row["published"]),
  };
}

export type AdminProduct = ReturnType<typeof mapProduct> & { sortOrder: number };

function mapAccessory(row: ProductRow): Accessory & {
  imageUrl: string | null;
  published: boolean;
  sortOrder: number;
} {
  return {
    id: String(row["id"]),
    name: String(row["name"]),
    category: String(row["category"]) as AccessoryCategory,
    blurb: String(row["blurb"] ?? ""),
    price: row["price"] === null || row["price"] === undefined ? null : Number(row["price"]),
    imageUrl: (row["image_url"] as string | null) ?? null,
    published: Boolean(row["published"]),
    sortOrder: num(row["sort_order"]),
  };
}

export type AdminAccessory = ReturnType<typeof mapAccessory>;

function mapOffer(row: ProductRow): Offer {
  return {
    id: String(row["id"]),
    title: String(row["title"]),
    description: String(row["description"] ?? ""),
    category: String(row["category"]) as OfferCategory,
    branches: ((row["branches"] as string[] | null) ?? []) as BranchId[],
    expiresOn: (row["expires_on"] as string | null) ?? null,
    active: Boolean(row["active"]),
  };
}

/* -------------------------------------------------------------------------- */
/* public reads                                                               */
/* -------------------------------------------------------------------------- */

export const listPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProduct);
});

export const listPublicAccessories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("accessories")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapAccessory);
});

export const listPublicOffers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("offers")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapOffer);
});

/* -------------------------------------------------------------------------- */
/* admin: role helpers                                                        */
/* -------------------------------------------------------------------------- */

type RoleCheckContext = {
  supabase: {
    rpc: (
      fn: "has_role",
      args: { _user_id: string; _role: "admin" | "staff" },
    ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
  };
  userId: string;
};

async function isAdmin(context: RoleCheckContext) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  return data === true;
}

async function assertAdmin(context: RoleCheckContext) {
  if (!(await isAdmin(context))) throw new Error("Forbidden: admin access required");
}

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    return { isAdmin: Boolean(data), adminCount: count ?? 0 };
  });

/** First signed-in user may claim admin, only while no admin exists yet. */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("An admin already exists. Ask them to grant you access.");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* -------------------------------------------------------------------------- */
/* admin: reads                                                               */
/* -------------------------------------------------------------------------- */

export const listAdminCatalogue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const [products, accessories, offers] = await Promise.all([
      context.supabase.from("products").select("*").order("sort_order", { ascending: true }),
      context.supabase.from("accessories").select("*").order("sort_order", { ascending: true }),
      context.supabase.from("offers").select("*").order("created_at", { ascending: false }),
    ]);
    if (products.error) throw new Error(products.error.message);
    if (accessories.error) throw new Error(accessories.error.message);
    if (offers.error) throw new Error(offers.error.message);
    return {
      products: (products.data ?? []).map((r) => ({
        ...mapProduct(r),
        sortOrder: num(r["sort_order"]),
      })),
      accessories: (accessories.data ?? []).map(mapAccessory),
      offers: (offers.data ?? []).map(mapOffer),
    };
  });

/* -------------------------------------------------------------------------- */
/* admin: writes                                                              */
/* -------------------------------------------------------------------------- */

const slug = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only");

const productSchema = z.object({
  id: slug,
  brand: z.string().trim().min(1).max(60),
  name: z.string().trim().min(1).max(120),
  condition: z.enum(["new", "pre-owned"]),
  price: z.number().nonnegative().max(10_000_000).nullable(),
  originalPrice: z.number().nonnegative().max(10_000_000).nullable(),
  storage: z.array(z.number().int().positive().max(4096)).max(8),
  ram: z.array(z.number().int().positive().max(64)).max(8),
  colours: z.array(z.string().trim().min(1).max(40)).max(12),
  os: z.enum(["iOS", "Android"]),
  fiveG: z.boolean(),
  displayInches: z.number().min(3).max(15),
  battery: z.number().int().min(500).max(20000),
  mainCameraMp: z.number().int().min(1).max(500),
  keySpec: z.string().trim().max(200),
  specs: z
    .array(z.object({ label: z.string().trim().max(60), value: z.string().trim().max(160) }))
    .max(12),
  branches: z.array(z.enum(["triprayar", "chavakkad"])).max(2),
  financeAvailable: z.boolean(),
  featured: z.boolean(),
  popular: z.boolean(),
  published: z.boolean(),
  imageUrl: z.string().trim().url().max(600).nullable(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => productSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("products").upsert({
      id: data.id,
      brand: data.brand,
      name: data.name,
      condition: data.condition,
      price: data.price,
      original_price: data.originalPrice,
      storage: data.storage,
      ram: data.ram,
      colours: data.colours,
      os: data.os,
      five_g: data.fiveG,
      display_inches: data.displayInches,
      battery: data.battery,
      main_camera_mp: data.mainCameraMp,
      key_spec: data.keySpec,
      specs: data.specs,
      branches: data.branches,
      finance_available: data.financeAvailable,
      featured: data.featured,
      popular: data.popular,
      published: data.published,
      image_url: data.imageUrl,
      sort_order: data.sortOrder,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: slug }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const accessorySchema = z.object({
  id: slug,
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(60),
  blurb: z.string().trim().max(300),
  price: z.number().nonnegative().max(1_000_000).nullable(),
  imageUrl: z.string().trim().url().max(600).nullable(),
  published: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
});

export const saveAccessory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => accessorySchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("accessories").upsert({
      id: data.id,
      name: data.name,
      category: data.category,
      blurb: data.blurb,
      price: data.price,
      image_url: data.imageUrl,
      published: data.published,
      sort_order: data.sortOrder,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAccessory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: slug }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("accessories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const offerSchema = z.object({
  id: z.string().uuid().nullable(),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  category: z.string().trim().min(1).max(60),
  branches: z.array(z.enum(["triprayar", "chavakkad"])).max(2),
  expiresOn: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  active: z.boolean(),
});

export const saveOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => offerSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = {
      title: data.title,
      description: data.description,
      category: data.category,
      branches: data.branches,
      expires_on: data.expiresOn,
      active: data.active,
    };
    const { error } = data.id
      ? await context.supabase.from("offers").update(payload).eq("id", data.id)
      : await context.supabase.from("offers").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("offers").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
