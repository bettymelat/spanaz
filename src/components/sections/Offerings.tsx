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
          title: "Alege tratamentul potrivit pentru tine",
          subtitle: "Tehnica se alege separat de durată. Mai întâi alegi tipul de masaj, apoi alegi cât timp vrei să te deconectezi.",
          book: "Rezervă acum",
          durations: "Disponibil în experiențe de 60, 90 și 120 minute",
        }
      : {
          title: "Choose the treatment that suits you",
          subtitle: "Technique and duration are selected separately. First choose the massage style, then choose how long you want to switch off.",
          book: "Book now",
          durations: "Available as 60, 90 and 120 minute experiences",
        };

  return (
    <section id="servicii" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:py-24">
      <SectionHeading title={copy.title} subtitle={copy.subtitle} />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          title: "Experiența de Relaxare",
          subtitle: "60 / 90 / 120 min — pentru a încetini ritmul, a elibera tensiunea de zi cu zi și a te deconecta complet.",
          popular: "Recomandat",
          session: "experiență",
          membershipTitle: "SPA NAZ Membership",
          membershipSubtitle: "Două opțiuni simple pentru clienții care vor să transforme relaxarea într-o rutină.",
          chooseDuration: "Alege 60 / 90 / 120 min",
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
          subtitle: "60 / 90 / 120 min — for slowing down, releasing everyday tension and completely switching off.",
          popular: "Recommended",
          session: "experience",
          membershipTitle: "SPA NAZ Membership",
          membershipSubtitle: "Two simple options for clients who want to make relaxation part of their routine.",
          chooseDuration: "Choose 60 / 90 / 120 min",
          sessions: "experiences",
          save: "Save",
          book: "Book the experience",
          sessionDescriptions: {
            relax: "A complete 60-minute reset.",
            restore: "More time to unwind — our recommended experience.",
            signature: "Our most immersive SPA NAZ experience.",
          },
        };

  const standardPrice = (minutes: number) => SESSION_OPTIONS.find((item) => item.minutes === minutes)?.priceLei ?? 0;
  const membershipGroups = [5, 10] as const;

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
              <h3 className="text-3xl uppercase tracking-[0.08em]">{session.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {session.minutes} min · {copy.session}
              </p>
              <p className="mt-4 min-h-10 text-sm leading-relaxed text-muted-foreground">
                {copy.sessionDescriptions[session.key]}
              </p>
              <p className="mt-5 font-display text-4xl text-foreground">
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

          <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
            {membershipGroups.map((sessionCount) => {
              const options = MEMBERSHIPS.filter((membership) => membership.sessions === sessionCount);
              return (
                <article key={sessionCount} className="surface-card p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">{sessionCount} EXPERIENCE MEMBERSHIP</p>
                      <h4 className="mt-2 text-2xl">{copy.chooseDuration}</h4>
                    </div>
                    <Check className="h-5 w-5 shrink-0 text-gold" />
                  </div>

                  <div className="mt-6 divide-y divide-border border-y border-border">
                    {options.map((membership) => {
                      const regular = standardPrice(membership.minutes) * membership.sessions;
                      const saving = regular - membership.priceLei;
                      return (
                        <div key={membership.minutes} className="flex items-center justify-between gap-4 py-4">
                          <div>
                            <p className="font-medium">{membership.minutes} min</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {membership.sessions} {copy.sessions}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-2xl">
                              {membership.priceLei} <span className="text-base">lei</span>
                            </p>
                            {saving > 0 && (
                              <p className="mt-1 text-xs font-medium text-primary">
                                {copy.save}: {saving} lei
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
