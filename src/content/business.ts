/**
 * SPA NAZ — CENTRAL BUSINESS SETTINGS
 * -----------------------------------
 * Edit everything here: phone, WhatsApp, email, hours, prices, areas,
 * testimonials and policies. No other file needs to change.
 */

export const BUSINESS = {
  name: "SPA NAZ",
  city: "București",
  country: "România",
  // Replace with the real numbers. Keep international format for WhatsApp (digits only).
  phoneDisplay: "[ADAUGĂ TELEFON]",
  phoneHref: "+40000000000",
  whatsappNumber: "40000000000", // digits only, e.g. 40712345678
  emailDisplay: "[ADAUGĂ EMAIL]",
  email: "contact@spanaz.ro",
  hours: [
    { days: "Luni – Vineri", value: "[ADAUGĂ ORAR]" },
    { days: "Sâmbătă", value: "[ADAUGĂ ORAR]" },
    { days: "Duminică", value: "[ADAUGĂ ORAR]" },
  ],
  social: {
    instagram: "#",
    facebook: "#",
    tiktok: "#",
  },
} as const;

export const WHATSAPP_MESSAGE = {
  ro: "Bună! Aș dori să fac o rezervare pentru un masaj la domiciliu prin SPA NAZ.",
  en: "Hello! I would like to book a home massage with SPA NAZ.",
};

export const whatsappLink = (lang: "ro" | "en" = "ro", custom?: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(
    custom ?? WHATSAPP_MESSAGE[lang],
  )}`;

/** Prices are placeholders — replace €XX with real values. */
export type ServiceKey =
  | "relaxare"
  | "deepTissue"
  | "aromaterapie"
  | "spateGat"
  | "corpComplet"
  | "cupluri";

export const SERVICES: {
  key: ServiceKey;
  durations: { minutes: number; price: string }[];
}[] = [
  {
    key: "relaxare",
    durations: [
      { minutes: 30, price: "€XX" },
      { minutes: 60, price: "€XX" },
      { minutes: 90, price: "€XX" },
    ],
  },
  {
    key: "deepTissue",
    durations: [
      { minutes: 60, price: "€XX" },
      { minutes: 90, price: "€XX" },
    ],
  },
  {
    key: "aromaterapie",
    durations: [
      { minutes: 60, price: "€XX" },
      { minutes: 90, price: "€XX" },
    ],
  },
  {
    key: "spateGat",
    durations: [
      { minutes: 30, price: "€XX" },
      { minutes: 45, price: "€XX" },
    ],
  },
  {
    key: "corpComplet",
    durations: [
      { minutes: 60, price: "€XX" },
      { minutes: 90, price: "€XX" },
      { minutes: 120, price: "€XX" },
    ],
  },
  {
    key: "cupluri",
    durations: [
      { minutes: 60, price: "€XX" },
      { minutes: 90, price: "€XX" },
    ],
  },
];

export const SERVICE_AREAS = [
  "Centrul Bucureștiului",
  "Sector 1",
  "Sector 2",
  "Sector 3",
  "Sector 4",
  "Sector 5",
  "Sector 6",
];

/** Replace with real client reviews when available. */
export const TESTIMONIALS = [
  { stars: 5, quote: "[Testimonialul clientului va fi adăugat aici.]", author: "[Nume client]" },
  { stars: 5, quote: "[Testimonialul clientului va fi adăugat aici.]", author: "[Nume client]" },
  { stars: 5, quote: "[Testimonialul clientului va fi adăugat aici.]", author: "[Nume client]" },
];
