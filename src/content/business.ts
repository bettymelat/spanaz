/**
 * SPA NAZ — CENTRAL BUSINESS SETTINGS
 * -----------------------------------
 * Customer-facing business details, services, prices and service areas.
 */

export const BUSINESS = {
  name: "SPA NAZ",
  city: "București",
  country: "România",
  phoneDisplay: "0774 009 000",
  phoneHref: "+40774009000",
  whatsappNumber: "40774009000",
  emailDisplay: "contact@spanaz.ro",
  email: "contact@spanaz.ro",
  bookingEmail: "booking@spanaz.ro",
  emails: [
    "info@spanaz.ro",
    "booking@spanaz.ro",
    "contact@spanaz.ro",
    "betelhem@spanaz.ro",
    "homespanaz@gmail.com",
  ],
  hours: [{ days: "Program", value: "Cu programare / By appointment" }],
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

export type ServiceKey = "relaxare" | "deepTissue" | "limfatic" | "aromaterapie";

export const SERVICES: { key: ServiceKey }[] = [
  { key: "relaxare" },
  { key: "deepTissue" },
  { key: "limfatic" },
  { key: "aromaterapie" },
];

/**
 * Session names are customer-facing packages. Massage technique is selected separately.
 * The 90-minute Restore session is intentionally marked as the recommended option.
 */
export const SESSION_OPTIONS = [
  { key: "relax", name: "Relax", minutes: 60, priceLei: 200, featured: false },
  { key: "restore", name: "Restore", minutes: 90, priceLei: 270, featured: true },
  { key: "signature", name: "Signature", minutes: 120, priceLei: 340, featured: false },
] as const;

export const MEMBERSHIPS = [
  { sessions: 5, minutes: 60, priceLei: 950 },
  { sessions: 10, minutes: 60, priceLei: 1800 },
  { sessions: 5, minutes: 90, priceLei: 1275 },
  { sessions: 10, minutes: 90, priceLei: 2400 },
  { sessions: 5, minutes: 120, priceLei: 1600 },
  { sessions: 10, minutes: 120, priceLei: 3000 },
] as const;

export const SERVICE_AREAS = ["Sector 1", "Sector 4", "Sector 5", "Sector 6"] as const;

/** Replace with real client reviews when available. */
export const TESTIMONIALS = [
  { stars: 5, quote: "[Testimonialul clientului va fi adăugat aici.]", author: "[Nume client]" },
  { stars: 5, quote: "[Testimonialul clientului va fi adăugat aici.]", author: "[Nume client]" },
  { stars: 5, quote: "[Testimonialul clientului va fi adăugat aici.]", author: "[Nume client]" },
];
