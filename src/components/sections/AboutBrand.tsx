import founderImage from "@/assets/founder-portrait.jpg";
import oilsImage from "@/assets/oils-towels.jpg";
import treatmentImage from "@/assets/oils-towels.jpg";
import { useI18n } from "@/lib/i18n";

export function AboutBrand() {
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          eyebrow: "POVESTEA SPA NAZ",
          title: "Grijă personală, tehnică profesională și ospitalitate caldă.",
          lead:
            "SPA NAZ a fost creat de o profesionistă în masaj care locuiește și lucrează în București.",
          body:
            "Ideea este simplă: relaxarea de calitate nu ar trebui să însemne încă un drum prin oraș. SPA NAZ aduce experiența direct la tine și pune accent pe calm, atenție personală și o relație autentică cu fiecare client.",
          brand: "Feel the Naz Way",
          brandBody: "Grijă calmă. Atingere atentă. Timpul tău pentru a te deconecta.",
          founderAlt: "Fondatoarea SPA NAZ, profesionistă în masaj în București",
        }
      : {
          eyebrow: "THE SPA NAZ STORY",
          title: "Personal care, professional technique and warm hospitality.",
          lead:
            "SPA NAZ was created by a massage professional living and working in Bucharest.",
          body:
            "The idea is simple: high-quality relaxation should not mean another trip across the city. SPA NAZ brings the experience directly to you, with calm communication, personal attention and genuine care at the centre of every appointment.",
          brand: "Feel the Naz Way",
          brandBody: "Calm care. Thoughtful touch. Your time to completely switch off.",
          founderAlt: "SPA NAZ founder, massage professional in Bucharest",
        };

  return (
    <section id="despre" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{copy.title}</h2>
          <div className="gold-rule mt-5 bg-gold" />
          <p className="mt-5 text-base leading-relaxed text-foreground">{copy.lead}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{copy.body}</p>

          <div className="surface-card mt-7 p-6">
            <p className="eyebrow">{copy.brand}</p>
            <p className="mt-2 font-display text-2xl leading-snug">{copy.brandBody}</p>
          </div>
        </div>

        <div className="order-1 grid grid-cols-5 gap-4 lg:order-2">
          <img
            src={founderImage}
            alt={copy.founderAlt}
            width={1008}
            height={1264}
            loading="lazy"
            className="col-span-3 h-full w-full rounded-[1.75rem] object-cover shadow-lift"
          />
          <div className="col-span-2 flex flex-col gap-4">
            <img
              src={oilsImage}
              alt=""
              width={1200}
              height={912}
              loading="lazy"
              className="h-1/2 w-full rounded-[1.5rem] object-cover shadow-soft"
            />
            <img
              src={treatmentImage}
              alt=""
              width={1200}
              height={912}
              loading="lazy"
              className="h-1/2 w-full rounded-[1.5rem] object-cover shadow-soft"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
