export type AccessoryCategory =
  | "Phone Cases"
  | "Tempered Glass"
  | "Chargers"
  | "Cables"
  | "Power Banks"
  | "Earbuds / TWS"
  | "Smartwatches"
  | "Bluetooth Speakers"
  | "Car Chargers"
  | "Phone Holders"
  | "Other Accessories";

export const ACCESSORY_CATEGORIES: {
  name: AccessoryCategory;
  blurb: string;
}[] = [
  { name: "Phone Cases", blurb: "Slim, rugged and clear cases for popular models." },
  { name: "Tempered Glass", blurb: "Screen protection fitted in store." },
  { name: "Chargers", blurb: "Fast chargers and adapters for iPhone and Android." },
  { name: "Cables", blurb: "USB-C, Lightning and braided data cables." },
  { name: "Power Banks", blurb: "Everyday and high-capacity portable power." },
  { name: "Earbuds / TWS", blurb: "Wireless earbuds across budgets." },
  { name: "Smartwatches", blurb: "Fitness and everyday smartwatches." },
  { name: "Bluetooth Speakers", blurb: "Compact and party speakers." },
  { name: "Car Chargers", blurb: "Fast car charging and mounts." },
  { name: "Phone Holders", blurb: "Car, desk and bike holders." },
  { name: "Other Accessories", blurb: "OTG, memory cards, cleaning kits and more." },
];

export type Accessory = {
  id: string;
  name: string;
  category: AccessoryCategory;
  blurb: string;
  price: number | null;
};

/** Catalogue structure only — confirm current price and stock on WhatsApp. */
export const ACCESSORIES: Accessory[] = [
  { id: "case-silicone", name: "Silicone Back Case", category: "Phone Cases", blurb: "Soft-touch protection for popular iPhone and Android models.", price: null },
  { id: "case-rugged", name: "Rugged Armour Case", category: "Phone Cases", blurb: "Shock-absorbing corners for daily drops.", price: null },
  { id: "case-clear", name: "Clear Transparent Case", category: "Phone Cases", blurb: "Keeps your phone's finish visible.", price: null },
  { id: "glass-9h", name: "9H Tempered Glass", category: "Tempered Glass", blurb: "Fitted in store, bubble-free.", price: null },
  { id: "glass-privacy", name: "Privacy Tempered Glass", category: "Tempered Glass", blurb: "Side-view privacy filter.", price: null },
  { id: "charger-fast", name: "Fast Charging Adapter", category: "Chargers", blurb: "Type-C adapters for supported phones.", price: null },
  { id: "charger-wireless", name: "Wireless Charging Pad", category: "Chargers", blurb: "For phones with wireless charging support.", price: null },
  { id: "cable-usbc", name: "Braided USB-C Cable", category: "Cables", blurb: "Durable everyday charging and data cable.", price: null },
  { id: "cable-lightning", name: "Lightning Cable", category: "Cables", blurb: "For iPhone models with Lightning ports.", price: null },
  { id: "pb-10000", name: "10,000mAh Power Bank", category: "Power Banks", blurb: "Pocketable top-up power.", price: null },
  { id: "pb-20000", name: "20,000mAh Power Bank", category: "Power Banks", blurb: "Multi-day capacity for travel.", price: null },
  { id: "tws-basic", name: "Wireless Earbuds", category: "Earbuds / TWS", blurb: "Everyday TWS earbuds with charging case.", price: null },
  { id: "tws-anc", name: "ANC Wireless Earbuds", category: "Earbuds / TWS", blurb: "Active noise cancellation options.", price: null },
  { id: "watch-fitness", name: "Fitness Smartwatch", category: "Smartwatches", blurb: "Activity, heart-rate and notifications.", price: null },
  { id: "watch-premium", name: "Premium Smartwatch", category: "Smartwatches", blurb: "Metal finishes and AMOLED displays.", price: null },
  { id: "speaker-compact", name: "Compact Bluetooth Speaker", category: "Bluetooth Speakers", blurb: "Portable sound with long battery life.", price: null },
  { id: "speaker-party", name: "Party Bluetooth Speaker", category: "Bluetooth Speakers", blurb: "Higher output for gatherings.", price: null },
  { id: "car-charger", name: "Dual-Port Car Charger", category: "Car Chargers", blurb: "Charge two devices on the move.", price: null },
  { id: "holder-car", name: "Magnetic Car Holder", category: "Phone Holders", blurb: "Dashboard and vent mounting.", price: null },
  { id: "holder-desk", name: "Adjustable Desk Stand", category: "Phone Holders", blurb: "Comfortable viewing angles.", price: null },
  { id: "otg-adapter", name: "OTG Adapter", category: "Other Accessories", blurb: "Connect drives and peripherals.", price: null },
  { id: "memory-card", name: "Memory Card", category: "Other Accessories", blurb: "Expand storage on supported phones.", price: null },
];
