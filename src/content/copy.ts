/**
 * SPA NAZ — all website text, in Romanian (primary) and English.
 * Add a new language by copying the `ro` object and translating it.
 */

export const ro = {
  code: "ro" as const,
  nav: {
    home: "Acasă",
    about: "Despre",
    services: "Servicii",
    prices: "Prețuri",
    faq: "Întrebări",
    book: "Rezervare",
    contact: "Contact",
  },
  cta: {
    book: "Rezervă masajul tău",
    bookShort: "Rezervă acum",
    whatsapp: "Scrie pe WhatsApp",
    whatsappShort: "WhatsApp",
    call: "Sună",
    availability: "Verifică disponibilitatea",
    request: "Solicită o programare",
  },
  hero: {
    eyebrow: "Masaj la domiciliu în București",
    title: "Experiență profesională de spa și masaj — în confortul casei tale",
    subtitle:
      "Relaxează-te, reîncarcă-te și ai grijă de tine fără să pleci de acasă. SPA NAZ aduce o experiență profesională de masaj direct la tine, în București.",
    trust: "Servim clienți în București · Programări private la domiciliu · Serviciu profesional de masaj",
    imageAlt: "Masă de masaj pregătită cu lenjerie crem, prosoape și lumânări într-o locuință elegantă din București",
  },
  trustBadges: ["Profesional", "Privat", "Comod", "La domiciliu", "București"],
  about: {
    title: "Despre SPA NAZ",
    lead: "SPA NAZ este un serviciu profesional de masaj la domiciliu, creat pentru ca relaxarea și grija de sine să fie simple, comode și personale.",
    body: [
      "Fondat de o profesionistă în masaj de origine etiopiană care locuiește și lucrează în București, SPA NAZ îmbină tehnicile profesionale de masaj cu grija autentică, comunicarea calmă și căldura ospitalității etiopiene.",
      "În loc să piardă timp pe drum către un salon, clienții noștri se bucură de un masaj relaxant în confortul și intimitatea propriei locuințe.",
    ],
    missionLabel: "Misiunea noastră",
    mission: "Să ajutăm oamenii să se simtă mai bine, să se relaxeze mai profund și să facă grija de sine mai ușoară.",
    imageAlt: "Portretul fondatoarei SPA NAZ, terapeut de masaj profesionist în București",
    note: "Certificările, calificările și anii de experiență vor fi afișate aici atunci când sunt furnizate de proprietarul afacerii.",
  },
  services: {
    title: "Serviciile noastre",
    subtitle: "Alege tratamentul potrivit pentru tine. Toate masajele se efectuează la tine acasă, în București.",
    durationLabel: "Durată",
    items: {
      relaxare: {
        name: "Masaj de relaxare",
        desc: "Un masaj calmant pentru întreg corpul, gândit să te ajute să încetinești ritmul, să eliberezi tensiunea zilnică și să te bucuri de o relaxare profundă.",
      },
      deepTissue: {
        name: "Masaj deep tissue",
        desc: "Un masaj mai ferm, concentrat pe zonele cu tensiune și rigiditate musculară.",
      },
      aromaterapie: {
        name: "Masaj cu aromaterapie",
        desc: "O experiență relaxantă de masaj, combinată cu uleiuri aromatice atent selecționate.",
      },
      spateGat: {
        name: "Masaj spate, gât și umeri",
        desc: "Tratament focalizat pe zonele frecvent afectate de tensiune și înțepenire.",
      },
      corpComplet: {
        name: "Masaj corp complet",
        desc: "O experiență completă de masaj, concepută pentru relaxarea întregului corp.",
      },
      cupluri: {
        name: "Masaj pentru cupluri la domiciliu",
        desc: "O experiență de masaj relaxantă pentru cuplurile care doresc un moment privat de wellness acasă.",
      },
    },
  },
  why: {
    title: "De ce aleg clienții SPA NAZ",
    items: [
      { title: "Casa ta, confortul tău", desc: "Bucură-te de masaj fără să te deplasezi la un salon." },
      { title: "Privat și personal", desc: "O experiență calmă și discretă, în propriul tău spațiu." },
      { title: "Serviciu profesional", desc: "Un serviciu de masaj serios, curat și orientat către client." },
      { title: "Rezervare comodă", desc: "Comunicare simplă prin WhatsApp și rezervare online." },
      { title: "Atenție personală", desc: "Fiecare programare este personală, niciodată grăbită." },
      { title: "Relaxare fără stres", desc: "Fără trafic, fără săli de așteptare, fără drumuri inutile." },
    ],
  },
  how: {
    title: "Cum funcționează",
    subtitle: "Patru pași simpli până la relaxare.",
    steps: [
      { title: "Alege masajul", desc: "Selectează tratamentul și durata care ți se potrivesc." },
      { title: "Contactează SPA NAZ", desc: "Trimite-ne un mesaj pe WhatsApp sau completează formularul de rezervare." },
      { title: "Alege ora", desc: "Confirmăm împreună data și intervalul orar preferat." },
      { title: "Relaxează-te acasă", desc: "Experiența profesională de masaj vine direct la tine acasă." },
    ],
  },
  pricing: {
    title: "Prețuri",
    subtitle: "Tarife transparente, afișate clar. Prețurile pot fi actualizate oricând de către SPA NAZ.",
    note: "Se pot aplica taxe de deplasare, în funcție de locație. Te rugăm să contactezi SPA NAZ pentru confirmare.",
    minutes: "min",
  },
  testimonials: {
    title: "Ce spun clienții noștri",
    subtitle: "Recenziile reale ale clienților vor fi adăugate aici.",
  },
  area: {
    title: "Masaj la domiciliu în București",
    body: "SPA NAZ oferă programări la domiciliu în București, în funcție de disponibilitate și de politica privind zona de deplasare. Trimite-ne adresa ta la rezervare și confirmăm rapid dacă putem ajunge la tine.",
    listTitle: "Zone deservite",
    disclaimer: "Disponibilitatea nu este garantată în toate zonele; se confirmă la programare.",
    mapAlt: "Hartă cu zona deservită în București",
  },
  faq: {
    title: "Întrebări frecvente",
    items: [
      { q: "Veniți la mine acasă?", a: "Da. SPA NAZ oferă programări de masaj la domiciliu în București, în funcție de disponibilitatea zonei deservite." },
      { q: "Ce trebuie să pregătesc?", a: "Se recomandă un spațiu confortabil și privat. SPA NAZ îți va comunica orice cerință suplimentară înainte de programare." },
      { q: "Cum fac o rezervare?", a: "Poți rezerva prin formularul online sau poți contacta direct SPA NAZ pe WhatsApp." },
      { q: "Cât durează un masaj?", a: "Durata depinde de tratamentul ales. Duratele disponibile și prețurile sunt afișate în secțiunea de servicii." },
      { q: "Deserviți toate zonele Bucureștiului?", a: "Disponibilitatea depinde de locație și de program. Poți menționa adresa la rezervare pentru confirmare." },
      { q: "Pot rezerva pentru două persoane?", a: "Întreabă SPA NAZ despre programările pentru cupluri sau pentru mai multe persoane." },
      { q: "Pot anula sau reprograma?", a: "[Adaugă aici politica de anulare și reprogramare.]" },
    ],
  },
  booking: {
    title: "Rezervă masajul la domiciliu",
    subtitle: "Completează formularul și revenim cu confirmarea programării.",
    fields: {
      name: "Nume complet",
      phone: "Număr de telefon",
      whatsapp: "Număr WhatsApp",
      service: "Masajul preferat",
      duration: "Durata",
      date: "Data preferată",
      time: "Ora preferată",
      address: "Adresa / zona în București",
      people: "Număr de persoane",
      message: "Mesaj suplimentar",
    },
    select: "Selectează",
    consent: "Sunt de acord să fiu contactat(ă) în legătură cu cererea mea de rezervare.",
    submit: "Trimite cererea de rezervare",
    or: "sau",
    whatsappCta: "Rezervă pe WhatsApp",
    successTitle: "Cererea ta a fost trimisă",
    successBody: "Mulțumim! Am primit cererea ta de rezervare. Te contactăm în cel mai scurt timp pentru confirmarea datei și a orei.",
    successAgain: "Trimite o altă cerere",
    errors: {
      required: "Acest câmp este obligatoriu",
      phone: "Introdu un număr de telefon valid",
      consent: "Te rugăm să bifezi acordul pentru a continua",
    },
  },
  contact: {
    title: "Contact SPA NAZ",
    locationLabel: "Locație",
    phoneLabel: "Telefon",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    hoursLabel: "Program",
  },
  footer: {
    tagline: "Masaj profesional la domiciliu în București",
    linksTitle: "Navigare",
    socialTitle: "Social media",
    legalTitle: "Informații",
    privacy: "Politica de confidențialitate",
    terms: "Termeni și condiții",
    cancellation: "Politica de anulare",
    rights: "© 2026 SPA NAZ. Toate drepturile rezervate.",
  },
  meta: {
    homeTitle: "SPA NAZ | Masaj la Domiciliu în București",
    homeDesc:
      "SPA NAZ oferă servicii profesionale de masaj la domiciliu în București. Relaxare, confort și o experiență personală direct la tine acasă. Rezervă acum.",
  },
};

export type Copy = typeof ro;

export const en: Copy = {
  code: "en" as unknown as "ro",
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    prices: "Prices",
    faq: "FAQ",
    book: "Book",
    contact: "Contact",
  },
  cta: {
    book: "Book your massage",
    bookShort: "Book now",
    whatsapp: "Message on WhatsApp",
    whatsappShort: "WhatsApp",
    call: "Call",
    availability: "Check availability",
    request: "Request an appointment",
  },
  hero: {
    eyebrow: "Home massage in Bucharest",
    title: "Professional spa & massage experience — in the comfort of your home",
    subtitle:
      "Relax, recharge and take care of yourself without leaving home. SPA NAZ brings a professional massage experience directly to you in Bucharest.",
    trust: "Serving clients in Bucharest · Private home appointments · Professional massage service",
    imageAlt: "Massage table prepared with cream linen, towels and candles in an elegant Bucharest home",
  },
  trustBadges: ["Professional", "Private", "Convenient", "Home service", "Bucharest"],
  about: {
    title: "About SPA NAZ",
    lead: "SPA NAZ is a professional home massage service created to make relaxation and self-care simple, comfortable and personal.",
    body: [
      "Founded by an Ethiopian massage professional living and working in Bucharest, SPA NAZ combines professional massage techniques with genuine care, calm communication and the warmth of Ethiopian hospitality.",
      "Instead of spending time traveling to a spa, our clients enjoy a relaxing massage in the comfort and privacy of their own home.",
    ],
    missionLabel: "Our mission",
    mission: "Help people feel better, relax deeper and make self-care easier.",
    imageAlt: "Portrait of the SPA NAZ founder, professional massage therapist in Bucharest",
    note: "Certifications, qualifications and years of experience will be displayed here once provided by the business owner.",
  },
  services: {
    title: "Our services",
    subtitle: "Choose the treatment that suits you. Every massage takes place at your home in Bucharest.",
    durationLabel: "Duration",
    items: {
      relaxare: {
        name: "Relaxation massage",
        desc: "A calming full-body massage designed to help you slow down, release everyday tension and enjoy deep relaxation.",
      },
      deepTissue: {
        name: "Deep tissue massage",
        desc: "A firmer massage focused on areas of muscular tightness and tension.",
      },
      aromaterapie: {
        name: "Aromatherapy massage",
        desc: "A relaxing massage experience combined with carefully selected aromatic oils.",
      },
      spateGat: {
        name: "Back, neck & shoulders massage",
        desc: "Focused treatment for common areas of everyday tension and stiffness.",
      },
      corpComplet: {
        name: "Full body massage",
        desc: "A complete massage experience designed to help the whole body relax.",
      },
      cupluri: {
        name: "Couples home massage",
        desc: "A relaxing massage experience for couples who want a private wellness moment at home.",
      },
    },
  },
  why: {
    title: "Why clients choose SPA NAZ",
    items: [
      { title: "Your home, your comfort", desc: "Enjoy your massage without traveling to a spa." },
      { title: "Private & personal", desc: "A calm and private experience in your own environment." },
      { title: "Professional service", desc: "A serious, clean and client-focused massage service." },
      { title: "Convenient booking", desc: "Simple communication through WhatsApp and online booking." },
      { title: "Personal attention", desc: "Every appointment feels personal, never rushed." },
      { title: "Relaxation without stress", desc: "No traffic, no waiting rooms, no unnecessary travel." },
    ],
  },
  how: {
    title: "How it works",
    subtitle: "Four simple steps to relaxation.",
    steps: [
      { title: "Choose your massage", desc: "Select the treatment and duration that works for you." },
      { title: "Contact SPA NAZ", desc: "Send us a message on WhatsApp or use the booking form." },
      { title: "Choose your time", desc: "We confirm your preferred date and appointment time." },
      { title: "Relax at home", desc: "Your professional massage experience comes directly to your home." },
    ],
  },
  pricing: {
    title: "Prices",
    subtitle: "Transparent, clearly displayed rates. Prices can be updated by SPA NAZ at any time.",
    note: "Travel fees may apply depending on location. Please contact SPA NAZ for confirmation.",
    minutes: "min",
  },
  testimonials: {
    title: "What our clients say",
    subtitle: "Real client reviews will be added here.",
  },
  area: {
    title: "Home massage in Bucharest",
    body: "SPA NAZ provides home appointments across Bucharest, subject to availability and travel-area policy. Share your address when booking and we will confirm quickly whether we can reach you.",
    listTitle: "Service areas",
    disclaimer: "Availability is not guaranteed in every area; it is confirmed at booking.",
    mapAlt: "Map of the Bucharest service area",
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      { q: "Do you come to my home?", a: "Yes. SPA NAZ provides home massage appointments in Bucharest, subject to service-area availability." },
      { q: "What do I need to prepare?", a: "A comfortable, private space is recommended. SPA NAZ will communicate any additional preparation requirements before the appointment." },
      { q: "How do I book?", a: "You can book using the online booking form or contact SPA NAZ directly through WhatsApp." },
      { q: "How long does a massage take?", a: "Durations depend on the treatment selected. Available durations and prices are shown in the services section." },
      { q: "Do you serve all areas of Bucharest?", a: "Service availability depends on location and schedule. You can provide your address during booking for confirmation." },
      { q: "Can I book for two people?", a: "Ask SPA NAZ about couples or multiple-person appointments." },
      { q: "Can I cancel or reschedule?", a: "[Add your cancellation and rescheduling policy here.]" },
    ],
  },
  booking: {
    title: "Book your home massage",
    subtitle: "Fill in the form and we will come back with your appointment confirmation.",
    fields: {
      name: "Full name",
      phone: "Phone number",
      whatsapp: "WhatsApp number",
      service: "Preferred massage",
      duration: "Duration",
      date: "Preferred date",
      time: "Preferred time",
      address: "Address / area in Bucharest",
      people: "Number of people",
      message: "Additional message",
    },
    select: "Select",
    consent: "I agree to be contacted regarding my booking request.",
    submit: "Send booking request",
    or: "or",
    whatsappCta: "Book via WhatsApp",
    successTitle: "Your request has been sent",
    successBody: "Thank you! We received your booking request and will contact you shortly to confirm the date and time.",
    successAgain: "Send another request",
    errors: {
      required: "This field is required",
      phone: "Enter a valid phone number",
      consent: "Please confirm to continue",
    },
  },
  contact: {
    title: "Contact SPA NAZ",
    locationLabel: "Location",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    emailLabel: "Email",
    hoursLabel: "Opening hours",
  },
  footer: {
    tagline: "Professional home massage in Bucharest",
    linksTitle: "Navigation",
    socialTitle: "Social media",
    legalTitle: "Information",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    cancellation: "Cancellation Policy",
    rights: "© 2026 SPA NAZ. All rights reserved.",
  },
  meta: {
    homeTitle: "SPA NAZ | Home Massage in Bucharest",
    homeDesc:
      "SPA NAZ offers professional home massage services in Bucharest. Relaxation, comfort and a personal experience delivered to your door. Book now.",
  },
};
