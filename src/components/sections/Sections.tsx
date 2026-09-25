import { useEffect, useState } from "react";
import {
  Home,
  Lock,
  Sparkles,
  CalendarCheck,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Star,
  ChevronDown,
} from "lucide-react";
import founderImage from "@/assets/founder-portrait.jpg";
import oilsImage from "@/assets/oils-towels.jpg";
import treatmentImage from "@/assets/oils-towels.jpg";
import { useI18n } from "@/lib/i18n";
import { BUSINESS, SERVICES, SERVICE_AREAS, whatsappLink } from "@/content/business";
import { listPublicReviews, type SpaReview } from "@/lib/review-store";

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      <div className="gold-rule mx-auto mt-5 w-20 bg-gold" />
      {subtitle && <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}

export function TrustBar() {
  const { t } = useI18n();
  const icons = [ShieldCheck, Lock, Clock, Home, MapPin];
  return (
    <section className="border-y border-border bg-card">
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
        {t.trustBadges.map((badge, i) => {
          const Icon = icons[i] ?? ShieldCheck;
          return (
            <li key={badge} className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <Icon className="h-4 w-4 text-gold" />
              {badge}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function Services() {
  const { t, lang } = useI18n();
  return (
    <section id="servicii" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading title={t.services.title} subtitle={t.services.subtitle} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          return (
            <article key={service.key} className="surface-card flex flex-col p-6 transition-shadow hover:shadow-lift">
              <Leaf className="h-5 w-5 text-gold" />
              <h3 className="mt-4 text-2xl">{service.name[lang]}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description[lang]}</p>
              <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
                {service.durations.map((d) => (
                  <div key={d.minutes} className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted-foreground">
                      {d.minutes} {t.pricing.minutes}
                    </dt>
                    <dd className="font-medium text-foreground">{d.price}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="#rezervare"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {t.cta.bookShort}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function WhyUs() {
  const { t } = useI18n();
  const icons = [Home, Lock, Sparkles, CalendarCheck, HeartHandshake, Leaf];
  return (
    <section className="bg-sand py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={t.why.title} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.why.items.map((item, i) => {
            const Icon = icons[i] ?? Leaf;
            return (
              <div key={item.title} className="surface-card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft text-clay">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading title={t.how.title} subtitle={t.how.subtitle} />
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.how.steps.map((step, i) => (
          <li key={step.title} className="surface-card p-6">
            <span className="font-display text-4xl text-gold">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-xl">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function About() {
  const { t } = useI18n();
  return (
    <section id="despre" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">SPA NAZ</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{t.about.title}</h2>
          <div className="gold-rule mt-5 bg-gold" />
          <p className="mt-5 text-base leading-relaxed text-foreground">{t.about.lead}</p>
          {t.about.body.map((p) => (
            <p key={p} className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {p}
            </p>
          ))}
          <div className="surface-card mt-6 p-5">
            <p className="eyebrow">{t.about.missionLabel}</p>
            <p className="mt-2 font-display text-xl">{t.about.mission}</p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t.about.note}</p>
        </div>
        <div className="order-1 grid grid-cols-5 gap-4 lg:order-2">
          <img
            src={founderImage}
            alt={t.about.imageAlt}
            width={1008}
            height={1264}
            loading="lazy"
            className="col-span-3 h-full w-full rounded-[1.75rem] object-cover shadow-lift"
          />
          <div className="col-span-2 flex flex-col gap-4">
            <img src={oilsImage} alt="" width={1200} height={912} loading="lazy" className="h-1/2 w-full rounded-[1.5rem] object-cover shadow-soft" />
            <img src={treatmentImage} alt="" width={1200} height={912} loading="lazy" className="h-1/2 w-full rounded-[1.5rem] object-cover shadow-soft" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const { t, lang } = useI18n();
  return (
    <section id="preturi" className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading title={t.pricing.title} subtitle={t.pricing.subtitle} />
      <div className="surface-card mt-12 divide-y divide-border">
        {SERVICES.map((service) => (
          <div key={service.key} className="grid gap-3 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <h3 className="text-xl uppercase tracking-[0.12em]">{service.name[lang]}</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {service.durations.map((d) => (
                <li key={d.minutes} className="text-muted-foreground">
                  {d.minutes} {t.pricing.minutes} —{" "}
                  <span className="font-medium text-foreground">{d.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground sm:text-sm">{t.pricing.note}</p>
      <div className="mt-8 text-center">
        <a href="#rezervare" className="inline-flex rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-soft">
          {t.cta.availability}
        </a>
      </div>
    </section>
  );
}

export function Testimonials() {
  const { t, lang } = useI18n();
  const [reviews, setReviews] = useState<SpaReview[]>([]);

  useEffect(() => {
    let active = true;
    void listPublicReviews()
      .then((items) => {
        if (active) setReviews(items);
      })
      .catch(() => {
        if (active) setReviews([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="recenzii" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={t.testimonials.title}
          subtitle={
            lang === "ro"
              ? "Recenzii verificate de la clienți cu programări finalizate."
              : "Verified reviews from customers with completed appointments."
          }
        />
        {reviews.length === 0 ? (
          <div className="surface-card mx-auto mt-10 max-w-2xl p-7 text-center sm:p-9">
            <div className="mx-auto flex w-fit gap-1 text-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 opacity-35" />
              ))}
            </div>
            <h3 className="mt-4 text-2xl">
              {lang === "ro" ? "Ai fost client SPA NAZ?" : "Have you visited SPA NAZ?"}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {lang === "ro"
                ? "După o programare finalizată, poți lăsa o recenzie verificată direct din contul tău."
                : "After a completed appointment, you can leave a verified review directly from your account."}
            </p>
            <a
              href="/account"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground"
            >
              {lang === "ro" ? "Lasă o recenzie" : "Leave a review"}
            </a>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <figure key={review.id} className="surface-card p-6">
              <div
                className="flex gap-0.5 text-gold"
                aria-label={
                  lang === "ro"
                    ? `${review.rating} din 5 stele`
                    : `${review.rating} out of 5 stars`
                }
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      "h-4 w-4 " + (index < review.rating ? "fill-current" : "opacity-25")
                    }
                  />
                ))}
              </div>
              <blockquote className="mt-4 font-display text-lg leading-snug">
                “{review.comment}”
              </blockquote>
              <figcaption className="mt-5 border-t border-border pt-4 text-sm">
                <span className="font-medium text-foreground">{review.author}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {review.serviceName}
                </span>
              </figcaption>
            </figure>
          ))}
          </div>
        )}
        {reviews.length > 0 && (
          <div className="mt-8 text-center">
            <a
              href="/account"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary px-6 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              {lang === "ro" ? "Lasă o recenzie" : "Leave a review"}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export function ServiceArea() {
  const { t } = useI18n();
  return (
    <section id="zone" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl sm:text-4xl">{t.area.title}</h2>
          <div className="gold-rule mt-5 bg-gold" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">{t.area.body}</p>
          <p className="eyebrow mt-8">{t.area.listTitle}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SERVICE_AREAS.map((area) => (
              <li key={area} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
                {area}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">{t.area.disclaimer}</p>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] border border-border shadow-soft">
          <iframe
            title={t.area.mapAlt}
            src="https://www.openstreetmap.org/export/embed.html?bbox=25.95%2C44.33%2C26.25%2C44.55&layer=mapnik"
            className="h-[320px] w-full sm:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const { t } = useI18n();
  return (
    <section id="intrebari" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading title={t.faq.title} />
        <div className="mt-10 space-y-3">
          {t.faq.items.map((item) => (
            <details key={item.q} className="surface-card group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-foreground">
                {item.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-gold transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const { t, lang } = useI18n();
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading title={t.contact.title} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-6">
          <MapPin className="h-5 w-5 text-gold" />
          <p className="eyebrow mt-3">{t.contact.locationLabel}</p>
          <p className="mt-1 text-base">
            {BUSINESS.city}, {BUSINESS.country}
          </p>
        </div>
        <div className="surface-card p-6">
          <Phone className="h-5 w-5 text-gold" />
          <p className="eyebrow mt-3">{t.contact.phoneLabel}</p>
          <a href={`tel:${BUSINESS.phoneHref}`} className="mt-1 block text-base underline-offset-4 hover:underline">
            {BUSINESS.phoneDisplay}
          </a>
        </div>
        <div className="surface-card p-6">
          <Mail className="h-5 w-5 text-gold" />
          <p className="eyebrow mt-3">{t.contact.emailLabel}</p>
          <a href={`mailto:${BUSINESS.email}`} className="mt-1 block break-words text-base underline-offset-4 hover:underline">
            {BUSINESS.emailDisplay}
          </a>
        </div>
        <div className="surface-card p-6">
          <Clock className="h-5 w-5 text-gold" />
          <p className="eyebrow mt-3">{t.contact.hoursLabel}</p>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {BUSINESS.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={whatsappLink(lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-sm font-medium text-whatsapp-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          {t.cta.whatsappShort}
        </a>
        <a
          href={`tel:${BUSINESS.phoneHref}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-7 py-4 text-sm font-medium text-primary"
        >
          <Phone className="h-4 w-4" />
          {t.cta.call}
        </a>
        <a href="#rezervare" className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground">
          {t.cta.request}
        </a>
      </div>
    </section>
  );
}
