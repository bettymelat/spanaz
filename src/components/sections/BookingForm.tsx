import { useMemo, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SERVICES, SERVICE_AREAS, SESSION_OPTIONS, whatsappLink } from "@/content/business";
import { BookingConfigurationError, createBooking } from "@/lib/booking-store";

type FieldName =
  | "name"
  | "phone"
  | "whatsapp"
  | "service"
  | "session"
  | "date"
  | "time"
  | "sector"
  | "address"
  | "consent";
type Errors = { [K in FieldName]?: string | undefined };

type SubmittedSummary = {
  service: string;
  session: string;
  date: string;
  time: string;
  sector: string;
};

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40";

function Field({
  id,
  label,
  children,
  error,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string | undefined;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function localDateInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

export function BookingForm() {
  const { t, lang } = useI18n();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const [submittedSummary, setSubmittedSummary] = useState<SubmittedSummary | null>(null);
  const [submitError, setSubmitError] = useState("");
  const minDate = useMemo(localDateInputValue, []);

  const labels =
    lang === "ro"
      ? {
          session: "Sesiune",
          sector: "Sector",
          onlineError:
            "Rezervarea nu a putut fi trimisă acum. Încearcă din nou sau contactează SPA NAZ pe WhatsApp.",
          configError:
            "Rezervarea nu a putut fi trimisă acum. Încearcă din nou sau contactează SPA NAZ pe WhatsApp.",
          reference: "Referință rezervare",
          requested: "Cererea ta",
          pastDate: "Alege data de astăzi sau o dată viitoare",
          whatsappInvalid: "Introdu un număr WhatsApp valid sau lasă câmpul gol",
          pendingNote:
            "Aceasta este o cerere de programare. SPA NAZ va confirma data și ora prin telefon sau WhatsApp.",
        }
      : {
          session: "Session",
          sector: "Sector",
          onlineError:
            "We couldn't send your booking request right now. Please try again or contact SPA NAZ on WhatsApp.",
          configError:
            "We couldn't send your booking request right now. Please try again or contact SPA NAZ on WhatsApp.",
          reference: "Booking reference",
          requested: "Your request",
          pastDate: "Choose today or a future date",
          whatsappInvalid: "Enter a valid WhatsApp number or leave the field empty",
          pendingNote:
            "This is an appointment request. SPA NAZ will confirm the date and time by phone or WhatsApp.",
        };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const next: Errors = {};
    const required: FieldName[] = [
      "name",
      "phone",
      "service",
      "session",
      "date",
      "time",
      "sector",
      "address",
    ];

    for (const field of required) {
      if (!String(form.get(field) ?? "").trim()) next[field] = t.booking.errors.required;
    }

    const phone = String(form.get("phone") ?? "").trim();
    const whatsapp = String(form.get("whatsapp") ?? "").trim();
    const date = String(form.get("date") ?? "");

    if (phone && !/^[+\d][\d\s().-]{6,19}$/.test(phone)) {
      next.phone = t.booking.errors.phone;
    }
    if (whatsapp && !/^[+\d][\d\s().-]{6,19}$/.test(whatsapp)) {
      next.whatsapp = labels.whatsappInvalid;
    }
    if (date && date < minDate) next.date = labels.pastDate;
    if (!form.get("consent")) next.consent = t.booking.errors.consent;

    const serviceKey = String(form.get("service") ?? "");
    const sessionKey = String(form.get("session") ?? "");
    const service = SERVICES.find((item) => item.key === serviceKey);
    const session = SESSION_OPTIONS.find((item) => item.key === sessionKey);

    if (!service) next.service = t.booking.errors.required;
    if (!session) next.session = t.booking.errors.required;

    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length > 0 || !service || !session) return;

    const summary: SubmittedSummary = {
      service: service.name[lang],
      session:
        session.name +
        " · " +
        session.minutes +
        " min · " +
        session.priceLei +
        " lei",
      date,
      time: String(form.get("time") ?? ""),
      sector: String(form.get("sector") ?? ""),
    };

    setSubmitting(true);
    try {
      const result = await createBooking({
        name: String(form.get("name") ?? "").trim(),
        phone,
        whatsapp: whatsapp || phone,
        serviceKey: service.key,
        serviceName: service.name[lang],
        sessionKey: session.key,
        sessionName: session.name,
        durationMinutes: session.minutes,
        priceLei: session.priceLei,
        date,
        time: summary.time,
        sector: summary.sector,
        address: String(form.get("address") ?? "").trim(),
        people: Number(form.get("people") ?? 1),
        message: String(form.get("message") ?? "").trim().slice(0, 1000),
        language: lang,
      });
      setBookingReference(result.reference);
      setSubmittedSummary(summary);
      setSent(true);
      formElement.reset();
    } catch (error) {
      console.error("Booking submission failed", error);
      setSubmitError(
        error instanceof BookingConfigurationError ? labels.configError : labels.onlineError,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="surface-card mx-auto max-w-xl p-8 text-center fade-up">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-4 text-2xl">{t.booking.successTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t.booking.successBody}
        </p>

        {bookingReference && (
          <div className="mt-5 rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {labels.reference}
            </p>
            <p className="mt-1 font-display text-2xl">{bookingReference}</p>
          </div>
        )}

        {submittedSummary && (
          <div className="mt-4 rounded-xl border border-border bg-background p-4 text-left">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {labels.requested}
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t.booking.fields.service}</dt>
                <dd className="text-right font-medium">{submittedSummary.service}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{labels.session}</dt>
                <dd className="text-right font-medium">{submittedSummary.session}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t.booking.fields.date}</dt>
                <dd className="text-right font-medium">
                  {submittedSummary.date} · {submittedSummary.time}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{labels.sector}</dt>
                <dd className="text-right font-medium">{submittedSummary.sector}</dd>
              </div>
            </dl>
          </div>
        )}

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {labels.pendingNote}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappLink(lang)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-medium text-whatsapp-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            {t.booking.whatsappCta}
          </a>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setBookingReference("");
              setSubmittedSummary(null);
            }}
            className="rounded-full border border-primary px-6 py-3.5 text-sm font-medium text-primary"
          >
            {t.booking.successAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface-card mx-auto max-w-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label={t.booking.fields.name} error={errors.name}>
          <input id="name" name="name" autoComplete="name" className={inputClass} />
        </Field>
        <Field id="phone" label={t.booking.fields.phone} error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </Field>
        <Field id="whatsapp" label={t.booking.fields.whatsapp} error={errors.whatsapp}>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            className={inputClass}
          />
        </Field>
        <Field id="service" label={t.booking.fields.service} error={errors.service}>
          <select id="service" name="service" defaultValue="" className={inputClass}>
            <option value="" disabled>
              {t.booking.select}
            </option>
            {SERVICES.map((service) => (
              <option key={service.key} value={service.key}>
                {service.name[lang]}
              </option>
            ))}
          </select>
        </Field>
        <Field id="session" label={labels.session} error={errors.session}>
          <select id="session" name="session" defaultValue="restore" className={inputClass}>
            {SESSION_OPTIONS.map((session) => (
              <option key={session.key} value={session.key}>
                {session.featured ? "★ " : ""}
                {session.name} · {session.minutes} min · {session.priceLei} lei
              </option>
            ))}
          </select>
        </Field>
        <Field id="people" label={t.booking.fields.people}>
          <select id="people" name="people" defaultValue="1" className={inputClass}>
            {[1, 2, 3, 4].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </Field>
        <Field id="date" label={t.booking.fields.date} error={errors.date}>
          <input id="date" name="date" type="date" min={minDate} className={inputClass} />
        </Field>
        <Field id="time" label={t.booking.fields.time} error={errors.time}>
          <input id="time" name="time" type="time" className={inputClass} />
        </Field>
        <Field id="sector" label={labels.sector} error={errors.sector}>
          <select id="sector" name="sector" defaultValue="" className={inputClass}>
            <option value="" disabled>
              {t.booking.select}
            </option>
            {SERVICE_AREAS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </Field>
        <Field id="address" label={t.booking.fields.address} error={errors.address}>
          <input
            id="address"
            name="address"
            autoComplete="street-address"
            className={inputClass}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field id="message" label={t.booking.fields.message}>
            <textarea id="message" name="message" rows={4} maxLength={1000} className={inputClass} />
          </Field>
        </div>
      </div>

      <label htmlFor="consent" className="mt-5 flex items-start gap-3 text-sm text-muted-foreground">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 rounded border-input accent-[var(--primary)]"
        />
        <span>{t.booking.consent}</span>
      </label>
      {errors.consent && <p className="mt-1 text-xs text-destructive">{errors.consent}</p>}

      {submitError && (
        <div
          className="mt-5 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {t.booking.submit}
      </button>

      <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {t.booking.or}
      </p>

      <a
        href={whatsappLink(lang)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-medium text-whatsapp-foreground"
      >
        <MessageCircle className="h-4 w-4" />
        {t.booking.whatsappCta}
      </a>
    </form>
  );
}
