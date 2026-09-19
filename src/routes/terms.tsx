import { createFileRoute } from "@tanstack/react-router";
import { LegalShell } from "@/components/site/LegalShell";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/content/business";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | SPA NAZ" },
      { name: "description", content: "SPA NAZ booking and service terms." },
    ],
    links: [{ rel: "canonical", href: "https://spanaz.ro/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { lang } = useI18n();
  const ro = lang === "ro";

  return (
    <LegalShell
      eyebrow={ro ? "TERMENI" : "TERMS"}
      title={ro ? "Termeni și condiții" : "Terms & Conditions"}
      intro={
        ro
          ? "Acești termeni se aplică cererilor de programare și serviciilor SPA NAZ oferite la domiciliu în zonele de servicii afișate pe site."
          : "These terms apply to appointment requests and SPA NAZ home services within the service areas shown on the website."
      }
      updated={ro ? "Ultima actualizare: 19 septembrie 2026" : "Last updated: 19 September 2026"}
    >
      <section>
        <h2>{ro ? "1. Cererea de programare" : "1. Appointment requests"}</h2>
        <p>
          {ro
            ? "Trimiterea formularului nu garantează automat programarea. Cererea are inițial statusul „în așteptare”, iar data și ora devin confirmate după acceptarea de către SPA NAZ."
            : "Submitting the form does not automatically guarantee the appointment. A request initially remains pending, and the date and time become confirmed after SPA NAZ accepts it."}
        </p>
      </section>

      <section>
        <h2>{ro ? "2. Prețuri" : "2. Pricing"}</h2>
        <p>
          {ro
            ? "Prețul afișat în formular pentru durata selectată este prețul de referință al serviciului. Orice cost suplimentar aplicabil trebuie comunicat și acceptat înainte de prestarea serviciului."
            : "The price shown in the booking form for the selected duration is the reference service price. Any applicable additional charge must be communicated and accepted before the service is provided."}
        </p>
      </section>

      <section>
        <h2>{ro ? "3. Acces și siguranță" : "3. Access and safety"}</h2>
        <p>
          {ro
            ? "Clientul trebuie să ofere o adresă corectă și un mediu sigur și adecvat pentru prestarea serviciului. SPA NAZ poate refuza sau opri o programare atunci când condițiile sunt nesigure, abuzive sau incompatibile cu prestarea normală a serviciului."
            : "The customer must provide an accurate address and a safe, appropriate environment for the service. SPA NAZ may refuse or stop an appointment where conditions are unsafe, abusive or incompatible with normal service delivery."}
        </p>
      </section>

      <section>
        <h2>{ro ? "4. Informații de sănătate" : "4. Health information"}</h2>
        <p>
          {ro
            ? "Masajul nu înlocuiește consultul sau tratamentul medical. Clientul este responsabil să comunice înainte de ședință orice situație relevantă pentru siguranța serviciului și să solicite sfatul unui profesionist medical atunci când este necesar."
            : "Massage is not a substitute for medical consultation or treatment. The customer is responsible for disclosing information relevant to safe service delivery and seeking medical advice where appropriate."}
        </p>
      </section>

      <section>
        <h2>{ro ? "5. Contul de client" : "5. Customer account"}</h2>
        <p>
          {ro
            ? "Contul este opțional. Ești responsabil(ă) pentru păstrarea în siguranță a datelor de autentificare. Rezervările efectuate în timp ce ești autentificat(ă) pot fi afișate în contul tău."
            : "The customer account is optional. You are responsible for keeping login credentials secure. Bookings made while signed in may be displayed in your account."}
        </p>
      </section>

      <section>
        <h2>{ro ? "6. Anulare și reprogramare" : "6. Cancellation and rescheduling"}</h2>
        <p>
          {ro
            ? "Se aplică Politica de anulare publicată separat pe site. Pentru modificări urgente poți contacta SPA NAZ prin telefon sau WhatsApp."
            : "The separate Cancellation Policy published on the website applies. For urgent changes, contact SPA NAZ by phone or WhatsApp."}
        </p>
      </section>

      <section>
        <h2>{ro ? "7. Contact" : "7. Contact"}</h2>
        <p>
          {ro
            ? `Întrebările privind o rezervare pot fi trimise la ${BUSINESS.bookingEmail} sau prin datele de contact afișate pe site.`
            : `Booking questions can be sent to ${BUSINESS.bookingEmail} or through the contact details shown on the website.`}
        </p>
      </section>
    </LegalShell>
  );
}
