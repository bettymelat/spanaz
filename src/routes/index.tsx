import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCta } from "@/components/site/StickyCta";
import { Hero } from "@/components/sections/Hero";
import {
  TrustBar,
  Services,
  WhyUs,
  HowItWorks,
  About,
  Pricing,
  Testimonials,
  ServiceArea,
  Faq,
  Contact,
} from "@/components/sections/Sections";
import { BookingForm } from "@/components/sections/BookingForm";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/content/business";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "SPA NAZ",
  description:
    "SPA NAZ oferă servicii profesionale de masaj la domiciliu în București: masaj de relaxare, deep tissue, aromaterapie și masaj pentru cupluri.",
  areaServed: { "@type": "City", name: "București" },
  address: { "@type": "PostalAddress", addressLocality: "București", addressCountry: "RO" },
  telephone: BUSINESS.phoneHref,
  email: BUSINESS.email,
  priceRange: "€€",
  availableLanguage: ["ro", "en"],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPA NAZ | Masaj la Domiciliu în București" },
      {
        name: "description",
        content:
          "SPA NAZ oferă servicii profesionale de masaj la domiciliu în București. Relaxare, confort și o experiență personală direct la tine acasă. Rezervă acum.",
      },
      { property: "og:title", content: "SPA NAZ | Masaj la Domiciliu în București" },
      {
        property: "og:description",
        content:
          "Masaj profesional la domiciliu în București: relaxare, deep tissue, aromaterapie. Rezervă rapid pe WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusinessSchema) }],
  }),
  component: Index,
});

function BookingSection() {
  const { t } = useI18n();
  return (
    <section id="rezervare" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">{t.booking.title}</h2>
          <div className="gold-rule mx-auto mt-5 w-20 bg-gold" />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{t.booking.subtitle}</p>
        </div>
        <div className="mt-10">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <WhyUs />
        <HowItWorks />
        <About />
        <Pricing />
        <Testimonials />
        <ServiceArea />
        <Faq />
        <BookingSection />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
