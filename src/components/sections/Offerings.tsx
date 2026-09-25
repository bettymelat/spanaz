import { useState } from "react";
import { selectBooking } from "@/lib/booking-selection";
import { ArrowUpRight, Check, Leaf, Star } from "lucide-react";
import { MEMBERSHIPS, SERVICES, SESSION_OPTIONS, whatsappLink } from "@/content/business";
import { useI18n } from "@/lib/i18n";

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">SPA NAZ COLLECTION</p>
      <h2 className="mt-3 text-4xl leading-tight sm:text-5xl">{title}</h2>
      <div className="gold-rule mx-auto mt-6 w-20 bg-gold" />
      {subtitle && (
        <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

export function Offerings() {
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          title: "Alege ritualul potrivit pentru tine",
          subtitle:
            "Alegi mai întâi tipul de masaj, apoi durata. Fiecare experiență este pregătită pentru o programare privată, în confortul casei tale.",
          book: "Alege acest tratament",
          durations: "60 · 90 · 120 min",
        }
      : {
          title: "Choose the ritual that suits you",
          subtitle:
            "Choose the massage style first, then the duration. Every treatment is prepared as a private experience in the comfort of your home.",
          book: "Choose this treatment",
          durations: "60 · 90 · 120 min",
        };

  return (
    <section id="servicii" className="scroll-mt-24 bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading title={copy.title} subtitle={copy.subtitle} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <article
              key={service.key}
              className="group relative flex min-h-[21rem] flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-card px-6 py-7 transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift sm:px-7"
            >
              <div className="absolute right-6 top-5 font-display text-5xl text-gold/20">
                {String(index + 1).padStart(2, "0")}
              </div>

              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft text-clay">
                <Leaf className="h-4.5 w-4.5" />
              </span>

              <h3 className="mt-7 max-w-[13ch] text-3xl leading-none">{service.name[lang]}</h3>
              <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                {service.description[lang]}
              </p>

              <div className="mt-7 flex items-center justify-between border-t border-border/70 pt-5">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.durations}
                </span>
                <a
                  href="#rezervare"
                  onClick={() => selectBooking({ service: service.key })}
                  aria-label={copy.book + ": " + service.name[lang]}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PricingAndMembership() {
  const [minutes, setMinutes] = useState<60 | 90 | 120>(60);
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          title: "Experiența de Relaxare",
          subtitle: "Trei durate simple. Alegi cât timp vrei să te oprești din ritmul zilei.",
          popular: "Recomandat",
          session: "experiență",
          membershipTitle: "SPA NAZ Membership",
          membershipSubtitle: "Pentru clienții care vor ca relaxarea să devină parte din rutină.",
          chooseDuration: "Alege durata",
          sessions: "experiențe",
          save: "Economie",
          book: "Rezervă experiența",
          sessionDescriptions: {
            relax: "Un reset complet de 60 de minute.",
            restore: "Mai mult timp pentru relaxare — experiența noastră recomandată.",
            signature: "Cea mai completă și imersivă experiență SPA NAZ.",
          },
        }
      : {
          title: "The Relaxation Experience",
          subtitle:
            "Three simple durations. Choose how long you want to step away from the pace of the day.",
          popular: "Recommended",
          session: "experience",
          membershipTitle: "SPA NAZ Membership",
          membershipSubtitle: "For clients who want relaxation to become part of their routine.",
          chooseDuration: "Choose duration",
          sessions: "experiences",
          save: "Save",
          book: "Book the experience",
          sessionDescriptions: {
            relax: "A complete 60-minute reset.",
            restore: "More time to unwind — our recommended experience.",
            signature: "Our most immersive SPA NAZ experience.",
          },
        };

  const standardPrice = (minutes: number) =>
    SESSION_OPTIONS.find((item) => item.minutes === minutes)?.priceLei ?? 0;

  return (
    <section id="preturi" className="scroll-mt-24 bg-sand/70 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading title={copy.title} subtitle={copy.subtitle} />

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          {SESSION_OPTIONS.map((session) => (
            <article
              key={session.key}
              className={
                "relative flex flex-col rounded-[2rem] border bg-card p-7 transition duration-300 " +
                (session.featured
                  ? "border-gold/60 shadow-lift md:-translate-y-3"
                  : "border-border/80 shadow-soft")
              }
            >
              {session.featured && (
                <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {copy.popular}
                </div>
              )}
              <p className="eyebrow">{session.minutes} MIN</p>
              <h3 className="mt-2 text-4xl">{session.name}</h3>
              <p className="mt-4 min-h-12 text-sm leading-6 text-muted-foreground">
                {copy.sessionDescriptions[session.key]}
              </p>
              <p className="mt-8 font-display text-5xl leading-none text-foreground">
                {session.priceLei}
                <span className="ml-2 text-lg text-muted-foreground">lei</span>
              </p>
              <a
                href="#rezervare"
                onClick={() => selectBooking({ session: session.key })}
                className={
                  "mt-8 inline-flex items-center justify-center rounded-full px-5 py-3.5 text-sm font-semibold transition " +
                  (session.featured
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground")
                }
              >
                {copy.book}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">RETURN TO THE RITUAL</p>
            <h3 className="mt-3 text-4xl">{copy.membershipTitle}</h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {copy.membershipSubtitle}
            </p>
          </div>

          <div
            className="mx-auto mt-7 flex w-fit flex-wrap justify-center gap-2 rounded-full border border-border bg-card p-2"
            role="group"
            aria-label={copy.chooseDuration}
          >
            {SESSION_OPTIONS.map((session) => (
              <button
                key={session.key}
                type="button"
                aria-pressed={minutes === session.minutes}
                onClick={() => setMinutes(session.minutes)}
                className={
                  "min-h-11 rounded-full px-5 py-2 text-sm font-semibold transition " +
                  (minutes === session.minutes
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sand")
                }
              >
                {session.minutes} min
              </button>
            ))}
          </div>
          <div
            id="membership"
            className="mx-auto mt-10 grid max-w-6xl scroll-mt-28 gap-5 md:grid-cols-3"
          >
            {MEMBERSHIPS.map((membership) => {
              const total = membership.prices[minutes];
              const saving = standardPrice(minutes) * membership.sessions - total;
              const message =
                lang === "ro"
                  ? `Bună! Mă interesează abonamentul ${membership.name}: ${membership.sessions} ședințe × ${minutes} min, ${total} lei. Aș dori detalii despre activare și valabilitate.`
                  : `Hello! I am interested in the ${membership.name} membership: ${membership.sessions} sessions × ${minutes} min, ${total} lei. Please share activation and validity details.`;
              return (
                <article
                  key={membership.key}
                  className={
                    "membership-card flex flex-col rounded-[2rem] border p-6 sm:p-7 " +
                    (membership.featured
                      ? "border-gold bg-primary text-primary-foreground shadow-lift"
                      : "border-border bg-card shadow-soft")
                  }
                  data-tier={membership.key}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-widest">Membership</p>
                    {membership.featured && (
                      <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-primary">
                        {copy.popular}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-5 text-4xl">{membership.name}</h4>
                  <p className="mt-2 text-sm opacity-80">
                    {membership.sessions} {copy.sessions} × {minutes} min
                  </p>
                  <p className="mt-8 font-display text-5xl">
                    {total} <span className="text-xl">lei</span>
                  </p>
                  <p className="mt-2 text-sm">
                    {total / membership.sessions} lei / {lang === "ro" ? "ședință" : "session"}
                  </p>
                  <p className="mt-4 w-fit rounded-full bg-gold-soft px-3 py-1.5 text-xs font-semibold text-primary">
                    {copy.save} {saving} lei · {Math.round((saving / (total + saving)) * 100)}%
                  </p>
                  <ul className="my-7 flex-1 space-y-3 border-t border-current/15 pt-6 text-sm">
                    {[
                      lang === "ro"
                        ? "Alegi tratamentul la fiecare vizită"
                        : "Choose your treatment for each visit",
                      lang === "ro"
                        ? "Experiență privată la tine acasă"
                        : "A private experience in your home",
                      lang === "ro"
                        ? "Programări stabilite împreună cu tine"
                        : "Appointments arranged around you",
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsappLink(lang, message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 py-3 text-center text-sm font-semibold " +
                      (membership.featured
                        ? "bg-background text-primary"
                        : "bg-primary text-primary-foreground")
                    }
                  >
                    {lang === "ro" ? "Solicită" : "Enquire about"} {membership.name}
                    <ArrowUpRight className="h-4 w-4 shrink-0" />
                  </a>
                </article>
              );
            })}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-muted-foreground">
            {lang === "ro"
              ? "Abonamente preplătite, fără reînnoire automată. Economiile sunt calculate față de ședințele individuale de aceeași durată. Activarea, valabilitatea și condițiile de utilizare se confirmă cu SPA NAZ înainte de plată. Programările depind de disponibilitate."
              : "Prepaid memberships with no automatic renewal. Savings compare individual sessions of the same length. Activation, validity and usage terms are confirmed with SPA NAZ before payment. Appointments are subject to availability."}
          </p>
        </div>
      </div>
    </section>
  );
}
