import { MessageCircle, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-home-spa.jpg";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/content/business";

export function Hero() {
  const { t, lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          eyebrow: "FEEL THE NAZ WAY",
          location: "Experiență spa privată la domiciliu în București",
          title: "Relaxarea vine la tine.",
          subtitle:
            "SPA NAZ aduce experiența de spa direct la ușa ta — fără trafic, fără sală de așteptare și fără graba unei vizite la salon. Tu alegi momentul, noi aducem experiența.",
          trust: "Masaj profesional la domiciliu · Programări private · Tot ce este necesar pentru experiența ta",
          imageTagline: "Casa ta. Timpul tău. Feel the Naz Way.",
        }
      : {
          eyebrow: "FEEL THE NAZ WAY",
          location: "Private home spa experience in Bucharest",
          title: "Relaxation comes to you.",
          subtitle:
            "SPA NAZ brings the spa experience to your door — no traffic, no waiting room and no need to prepare for a salon visit. You choose the moment; we bring the experience.",
          trust: "Professional home massage · Private appointments · Everything needed for your experience",
          imageTagline: "Your home. Your time. Feel the Naz Way.",
        };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sand to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="fade-up">
          <p className="eyebrow">{copy.eyebrow}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-gold" />
            {copy.location}
          </p>
          <h1 className="mt-4 text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-[3.65rem]">{copy.title}</h1>
          <div className="gold-rule mt-6" />
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#rezervare"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-lift transition-opacity hover:opacity-90"
            >
              {t.cta.book}
            </a>
            <a
              href={whatsappLink(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-sm font-medium text-whatsapp-foreground shadow-soft transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              {t.cta.whatsapp}
            </a>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{copy.trust}</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-lift">
            <img
              src={heroImage}
              alt={t.hero.imageAlt}
              width={1600}
              height={1104}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-5 hidden rounded-2xl border border-border bg-card px-5 py-3 shadow-soft sm:block">
            <p className="font-display text-lg">{copy.imageTagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
