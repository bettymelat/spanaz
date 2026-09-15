import { Car, Home, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function HomeSpaExperience() {
  const { lang } = useI18n();
  const copy =
    lang === "ro"
      ? {
          eyebrow: "CE ÎNSEAMNĂ HOME SPA",
          title: "Aducem spa-ul la tine.",
          body:
            "Nu trebuie să te deplasezi, să stai în trafic sau să te pregătești pentru o vizită la salon. SPA NAZ vine la ușa ta cu tot ce este necesar pentru experiență, astfel încât relaxarea să înceapă și să se termine în confortul casei tale.",
          items: [
            { title: "Fără drumuri", desc: "Timpul tău rămâne pentru tine, nu pentru trafic." },
            { title: "Spațiul tău", desc: "O experiență privată, calmă și personală în propria locuință." },
            { title: "Noi aducem experiența", desc: "SPA NAZ pregătește cadrul necesar pentru programarea ta." },
          ],
        }
      : {
          eyebrow: "WHAT HOME SPA MEANS",
          title: "We bring the spa to you.",
          body:
            "You do not need to travel, sit in traffic or prepare for a salon visit. SPA NAZ arrives at your door with everything needed for the experience, so your relaxation can begin and end in the comfort of your own home.",
          items: [
            { title: "No travel", desc: "Your time stays yours instead of being spent in traffic." },
            { title: "Your space", desc: "A private, calm and personal experience in your own home." },
            { title: "We bring the experience", desc: "SPA NAZ prepares what is needed for your appointment." },
          ],
        };

  const icons = [Car, Home, Sparkles];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{copy.title}</h2>
          <div className="gold-rule mt-5 bg-gold" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.body}</p>
        </div>

        <div className="grid gap-4">
          {copy.items.map((item, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <div key={item.title} className="surface-card flex gap-4 p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-soft text-clay">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
