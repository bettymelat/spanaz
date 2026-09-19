import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/site/LegalShell";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/content/business";

export const Route = createFileRoute("/cancellation")({
  head: () => ({
    meta: [
      { title: "Cancellation Policy | SPA NAZ" },
      { name: "description", content: "SPA NAZ cancellation and rescheduling policy." },
    ],
    links: [{ rel: "canonical", href: "https://spanaz.ro/cancellation" }],
  }),
  component: CancellationPage,
});

function CancellationPage() {
  const { lang } = useI18n();
  const ro = lang === "ro";

  return (
    <LegalShell
      eyebrow={ro ? "PROGRAMĂRI" : "APPOINTMENTS"}
      title={ro ? "Politica de anulare și reprogramare" : "Cancellation & Rescheduling Policy"}
      intro={
        ro
          ? "Programările la domiciliu implică timp de deplasare și rezervarea unui interval dedicat. Te rugăm să anunți cât mai devreme dacă planurile se schimbă."
          : "Home appointments require travel time and a dedicated reserved slot. Please tell us as early as possible if your plans change."
      }
      updated={ro ? "Ultima actualizare: 19 septembrie 2026" : "Last updated: 19 September 2026"}
    >
      <section>
        <h2>{ro ? "1. Cereri neconfirmate" : "1. Pending requests"}</h2>
        <p>
          {ro
            ? "O cerere aflată încă în așteptare poate fi anulată din contul de client, dacă a fost creată în timp ce erai autentificat(ă), sau prin contactarea SPA NAZ."
            : "A request that is still pending may be cancelled from your customer account, if it was created while you were signed in, or by contacting SPA NAZ."}
        </p>
      </section>

      <section>
        <h2>{ro ? "2. Programări confirmate" : "2. Confirmed appointments"}</h2>
        <p>
          {ro
            ? "Te rugăm să anunți anularea sau reprogramarea cu cel puțin 12 ore înainte, atunci când este posibil. Contul permite anularea unei programări confirmate; pentru reprogramare, contactează SPA NAZ pentru a stabili un nou interval."
            : "Please give at least 12 hours' notice for cancellation or rescheduling where possible. Your account can cancel a confirmed appointment; for rescheduling, contact SPA NAZ to arrange a new slot."}
        </p>
      </section>

      <section>
        <h2>{ro ? "3. Întârzieri și imposibilitatea accesului" : "3. Delays and access problems"}</h2>
        <p>
          {ro
            ? "Dacă accesul la adresă nu este posibil sau clientul nu poate fi contactat într-un interval rezonabil după ora confirmată, programarea poate fi considerată anulată. SPA NAZ va încerca mai întâi să contacteze clientul."
            : "If the address cannot be accessed or the customer cannot be reached within a reasonable period after the confirmed time, the appointment may be treated as cancelled. SPA NAZ will first attempt to contact the customer."}
        </p>
      </section>

      <section>
        <h2>{ro ? "4. Anulare de către SPA NAZ" : "4. Cancellation by SPA NAZ"}</h2>
        <p>
          {ro
            ? "Dacă SPA NAZ trebuie să anuleze din motive neprevăzute, clientul va fi contactat cât mai repede și se va încerca oferirea unui interval alternativ."
            : "If SPA NAZ must cancel because of unforeseen circumstances, the customer will be contacted as soon as possible and an alternative slot will be offered where practical."}
        </p>
      </section>

      <section>
        <h2>{ro ? "5. Cum ne contactezi" : "5. How to contact us"}</h2>
        <p>
          {ro
            ? `Pentru anulare sau reprogramare poți folosi contul tău, WhatsApp, telefonul sau emailul ${BUSINESS.bookingEmail}.`
            : `To cancel or reschedule, use your account, WhatsApp, phone or ${BUSINESS.bookingEmail}.`}
        </p>
      </section>
    </LegalShell>
  );
}
