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

export const SESSION_OPTIONS = [
  { key: "relax", name: "Relax", minutes: 60, priceLei: 200, featured: false },
  { key: "restore", name: "Restore", minutes: 90, priceLei: 270, featured: true },
  { key: "signature", name: "Signature", minutes: 120, priceLei: 340, featured: false },
] as const;

export type ServiceKey = "relaxare" | "deepTissue" | "spateGat" | "aromaterapie";
type LocalizedText = { ro: string; en: string };
const standardDurations = SESSION_OPTIONS.map((session) => ({
  minutes: session.minutes,
  price: `${session.featured ? "★ " : ""}${session.priceLei} lei`,
}));

export const SERVICES: {
  key: ServiceKey;
  name: LocalizedText;
  description: LocalizedText;
  durations: { minutes: number; price: string }[];
}[] = [
  {
    key: "relaxare",
    name: { ro: "Experiența de Relaxare", en: "The Relaxation Experience" },
    description: {
      ro: "Pentru a încetini ritmul, a elibera tensiunea de zi cu zi și a te deconecta complet.",
      en: "For slowing down, releasing everyday tension and completely switching off.",
    },
    durations: standardDurations,
  },
  {
    key: "deepTissue",
    name: { ro: "Masaj deep tissue", en: "Deep tissue massage" },
    description: {
      ro: "Presiune mai profundă și lucru focalizat pentru tensiune, rigiditate și zone musculare solicitate.",
      en: "Deeper pressure and focused work for tension, stiffness and overworked muscle areas.",
    },
    durations: standardDurations,
  },
  {
    key: "spateGat",
    name: { ro: "Drenaj limfatic", en: "Lymphatic drainage" },
    description: {
      ro: "Tehnici blânde și ritmice concepute pentru a susține circulația limfatică și relaxarea.",
      en: "Gentle, rhythmic techniques designed to support lymphatic circulation and relaxation.",
    },
    durations: standardDurations,
  },
  {
    key: "aromaterapie",
    name: { ro: "Masaj cu aromaterapie", en: "Aromatherapy massage" },
    description: {
      ro: "Masaj relaxant completat de uleiuri aromatice pentru o experiență senzorială calmă.",
      en: "A relaxing massage enhanced with aromatic oils for a calm, sensory experience.",
    },
    durations: standardDurations,
  },
];

export const MEMBERSHIPS = [
  { sessions: 5, minutes: 60, priceLei: 950 },
  { sessions: 10, minutes: 60, priceLei: 1800 },
  { sessions: 5, minutes: 90, priceLei: 1275 },
  { sessions: 10, minutes: 90, priceLei: 2400 },
  { sessions: 5, minutes: 120, priceLei: 1600 },
  { sessions: 10, minutes: 120, priceLei: 3000 },
] as const;

export const SERVICE_AREAS = ["Sector 1", "Sector 4", "Sector 5", "Sector 6"] as const;

/**
 * Add only genuine, permissioned client reviews here.
 * The homepage intentionally does not fabricate testimonials.
 */
export const TESTIMONIALS: { stars: number; quote: string; author: string }[] = [];
