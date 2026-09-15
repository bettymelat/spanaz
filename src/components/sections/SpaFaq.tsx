import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SpaFaq() {
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          title: "Întrebări frecvente",
          items: [
            {
              q: "Veniți la domiciliu?",
              a: "Da. SPA NAZ este un serviciu de masaj la domiciliu disponibil în Sectoarele 1, 4, 5 și 6 din București, în funcție de program și timpul de deplasare.",
            },
            {
              q: "Ce tipuri de masaj pot rezerva?",
              a: "Poți alege masaj de relaxare, deep tissue, drenaj limfatic sau aromaterapie.",
            },
            {
              q: "Ce durate și prețuri sunt disponibile?",
              a: "Relax: 60 min — 200 lei. Restore: 90 min — 270 lei și este opțiunea recomandată. Signature: 120 min — 340 lei.",
            },
            {
              q: "Rezervarea online este confirmată imediat?",
              a: "Formularul creează o cerere de programare. SPA NAZ confirmă apoi data, ora și adresa cu tine prin telefon sau WhatsApp.",
            },
            {
              q: "Aveți pachete pentru masaj regulat?",
              a: "Da. SPA NAZ Membership include pachete de 5 sau 10 ședințe pentru sesiunile de 60, 90 și 120 minute, la preț redus.",
            },
            {
              q: "Ce trebuie să pregătesc acasă?",
              a: "Pregătește un spațiu curat, confortabil și suficient de liber pentru ședință. Orice cerință suplimentară va fi comunicată la confirmarea programării.",
            },
            {
              q: "Cum modific sau anulez o programare?",
              a: "Contactează SPA NAZ cât mai curând pe WhatsApp sau telefon. Condițiile aplicabile programării tale vor fi confirmate înainte de ședință.",
            },
          ],
        }
      : {
          title: "Frequently asked questions",
          items: [
            {
              q: "Do you come to my home?",
              a: "Yes. SPA NAZ is a home massage service available in Bucharest Sectors 1, 4, 5 and 6, subject to schedule and travel time.",
            },
            {
              q: "Which massage types can I book?",
              a: "You can choose relaxation massage, deep tissue, lymphatic drainage or aromatherapy massage.",
            },
            {
              q: "Which session lengths and prices are available?",
              a: "Relax: 60 min — 200 lei. Restore: 90 min — 270 lei and is the recommended option. Signature: 120 min — 340 lei.",
            },
            {
              q: "Is an online booking confirmed immediately?",
              a: "The form creates an appointment request. SPA NAZ then confirms the date, time and address with you by phone or WhatsApp.",
            },
            {
              q: "Do you offer packages for regular massage?",
              a: "Yes. SPA NAZ Membership offers 5- and 10-session packages for 60-, 90- and 120-minute sessions at reduced package prices.",
            },
            {
              q: "What should I prepare at home?",
              a: "Prepare a clean, comfortable area with enough space for the session. Any additional requirements will be communicated when your appointment is confirmed.",
            },
            {
              q: "How do I change or cancel an appointment?",
              a: "Contact SPA NAZ as early as possible by WhatsApp or phone. Any conditions applicable to your appointment will be confirmed before the session.",
            },
          ],
        };

  return (
    <section id="intrebari" className="scroll-mt-24 bg-sand py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl">{copy.title}</h2>
          <div className="gold-rule mx-auto mt-5 w-20 bg-gold" />
        </div>
        <div className="mt-10 space-y-3">
          {copy.items.map((item) => (
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
