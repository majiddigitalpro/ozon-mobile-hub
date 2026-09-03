export type BranchId = "triprayar" | "chavakkad";

export type Branch = {
  id: BranchId;
  name: string;
  shortName: string;
  address: string;
  phoneDisplay: string;
  /** E.164 without "+" for wa.me links */
  whatsapp: string;
  /** tel: value */
  tel: string;
  rating: number;
  reviewCount: number;
  yearsLabel: string;
  /** Google Maps search link built from the verified address text only. */
  mapsUrl: string;
  slug: string;
  seoArea: string;
};

export const BRANCHES: [Branch, ...Branch[]] = [
  {
    id: "triprayar",
    name: "Ozon Mobiles Triprayar",
    shortName: "Triprayar",
    address: "C.M Tower, Temple Rd, Triprayar, Kerala 680566",
    phoneDisplay: "085929 81111",
    whatsapp: "918592981111",
    tel: "+918592981111",
    rating: 4.9,
    reviewCount: 865,
    yearsLabel: "7+ years",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Ozon Mobiles, C.M Tower, Temple Rd, Triprayar, Kerala 680566"),
    slug: "triprayar",
    seoArea: "Triprayar",
  },
  {
    id: "chavakkad",
    name: "Ozon Mobiles Chavakkad",
    shortName: "Chavakkad",
    address: "H2MF+GG6, Friend Ship Nagar, Guruvayur, Chavakkad, Kerala 680506",
    phoneDisplay: "081119 87660",
    whatsapp: "918111987660",
    tel: "+918111987660",
    rating: 5.0,
    reviewCount: 117,
    yearsLabel: "1+ years",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Ozon Mobiles, H2MF+GG6, Friend Ship Nagar, Guruvayur, Chavakkad, Kerala 680506",
      ),
    slug: "chavakkad",
    seoArea: "Chavakkad",
  },
];

export const getBranch = (id: BranchId): Branch =>
  BRANCHES.find((b) => b.id === id) ?? BRANCHES[0];

export const FINANCE_PARTNERS = ["Bajaj Finserv", "HDFC", "Samsung Finance+"];
