import type { BranchId } from "./branches";

export type OfferCategory =
  | "Smartphone Deals"
  | "EMI Offers"
  | "Accessory Offers"
  | "Repair Offers"
  | "Seasonal Offers";

export const OFFER_CATEGORIES: OfferCategory[] = [
  "Smartphone Deals",
  "EMI Offers",
  "Accessory Offers",
  "Repair Offers",
  "Seasonal Offers",
];

export type Offer = {
  id: string;
  title: string;
  description: string;
  category: OfferCategory;
  branches: BranchId[] | "all";
  expiresOn: string | null;
  active: boolean;
};

/**
 * Offers change often, so nothing is hardcoded as live here. Staff add entries
 * to this list (or a CMS collection with the same shape) and the Offers page
 * renders them; while it is empty the page shows the WhatsApp fallback.
 */
export const OFFERS: Offer[] = [];

export const activeOffers = () => OFFERS.filter((o) => o.active);
