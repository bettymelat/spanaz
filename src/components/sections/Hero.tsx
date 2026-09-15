import { MessageCircle, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-home-spa.jpg";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/content/business";

export function Hero() {
  const { t, lang } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sand to-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="fade-up">
          <p className="eyebrow flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 text-[2.15rem] leading-[1.12] sm:text-5xl lg:text-[3.4rem]">{t.hero.title}</h1>
          <div className="gold-rule mt-6" />
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t.hero.subtitle}</p>

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

          <p className="mt-5 text-xs leading-relaxed text-muted-foreground sm:text-sm">{t.hero.trust}</p>
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
            <p className="font-display text-lg">Your relaxation. Your home. Your time.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
