import { Check, Leaf, Star } from "lucide-react";
import { MEMBERSHIPS, SERVICES, SESSION_OPTIONS } from "@/content/business";
import { useI18n } from "@/lib/i18n";

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl sm:text-4xl">{title}</h2>
      <div className="gold-rule mx-auto mt-5 w-20 bg-gold" />
      {subtitle && <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{subtitle}</p>}
    </div>
  );
}

export function Offerings() {
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          title: "Tipuri de masaj",
          subtitle: "Alege tehnica potrivită pentru tine. Durata și pachetul se aleg separat la rezervare.",
          book: "Rezervă acum",
          durations: "Disponibil în sesiuni de 60, 90 și 120 minute",
        }
      : {
          title: "Massage types",
          subtitle: "Choose the technique that suits you. Session length is selected separately when booking.",
          book: "Book now",
          durations: "Available in 60, 90 and 120 minute sessions",
        };

  return (
    <section id="servicii" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading title={copy.title} subtitle={copy.subtitle} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <article key={service.key} className="surface-card flex flex-col p-6 transition-shadow hover:shadow-lift">
            <Leaf className="h-5 w-5 text-gold" />
            <h3 className="mt-4 text-2xl">{service.name[lang]}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{service.description[lang]}</p>
            <p className="mt-5 border-t border-border pt-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {copy.durations}
            </p>
            <a
              href="#rezervare"
              className="mt-5 inline-flex items-center justify-center rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {copy.book}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PricingAndMembership() {
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          title: "Prețuri",
          subtitle: "Alege durata potrivită. Restore 90 min este opțiunea noastră recomandată.",
          popular: "Recomandat",
          session: "sesiune",
          membershipTitle: "Ai nevoie de masaj regulat? Economisește cu SPA NAZ Membership.",
          membershipSubtitle: "Pachete preplătite pentru clienții care doresc să transforme masajul într-o rutină.",
          sessions: "ședințe",
          save: "Economie",
          book: "Rezervă o programare",
        }
      : {
          title: "Pricing",
          subtitle: "Choose the session length that suits you. Restore 90 min is our recommended option.",
          popular: "Recommended",
          session: "session",
          membershipTitle: "Need regular massage? Save with SPA NAZ Membership.",
          membershipSubtitle: "Prepaid packages for clients who want to make massage part of their routine.",
          sessions: "sessions",
          save: "Save",
          book: "Book an appointment",
        };

  const standardPrice = (minutes: number) => SESSION_OPTIONS.find((item) => item.minutes === minutes)?.priceLei ?? 0;

  return (
    <section id="preturi" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={copy.title} subtitle={copy.subtitle} />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SESSION_OPTIONS.map((session) => (
            <article
              key={session.key}
              className={`surface-card relative flex flex-col p-7 ${session.featured ? "ring-2 ring-gold shadow-lift" : ""}`}
            >
              {session.featured && (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {copy.popular}
                </div>
              )}
              <h3 className="text-3xl">{session.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {session.minutes} min · {copy.session}
              </p>
              <p className="mt-6 font-display text-4xl text-foreground">
                {session.priceLei} <span className="text-xl">lei</span>
              </p>
              <a
                href="#rezervare"
                className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium ${
                  session.featured
                    ? "bg-primary text-primary-foreground"
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {copy.book}
              </a>
            </article>
          ))}
        </div>

        <div className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-3xl">{copy.membershipTitle}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.membershipSubtitle}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MEMBERSHIPS.map((membership) => {
              const regular = standardPrice(membership.minutes) * membership.sessions;
              const saving = regular - membership.priceLei;
              return (
                <article key={`${membership.sessions}-${membership.minutes}`} className="surface-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">
                        {membership.sessions} × {membership.minutes} min
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{copy.sessions}</p>
                    </div>
                    <Check className="h-5 w-5 text-gold" />
                  </div>
                  <p className="mt-5 font-display text-3xl">
                    {membership.priceLei} <span className="text-lg">lei</span>
                  </p>
                  {saving > 0 && (
                    <p className="mt-2 text-sm font-medium text-primary">
                      {copy.save}: {saving} lei
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
