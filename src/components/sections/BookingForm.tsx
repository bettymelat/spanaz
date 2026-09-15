import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SERVICES, whatsappLink } from "@/content/business";

type Errors = Partial<Record<string, string>>;

const inputClass =
  "w-full rounded-xl border border-input bg-card px-4 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40";

function Field({ id, label, children, error }: { id: string; label: string; children: React.ReactNode; error?: string }) {
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

export function BookingForm() {
  const { t, lang } = useI18n();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const durations = Array.from(new Set(SERVICES.flatMap((s) => s.durations.map((d) => d.minutes)))).sort((a, b) => a - b);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Errors = {};
    const required = ["name", "phone", "service", "duration", "date", "address"];
    for (const field of required) {
      if (!String(form.get(field) ?? "").trim()) next[field] = t.booking.errors.required;
    }
    const phone = String(form.get("phone") ?? "").trim();
    if (phone && !/^[+\d][\d\s().-]{6,19}$/.test(phone)) next.phone = t.booking.errors.phone;
    if (!form.get("consent")) next.consent = t.booking.errors.consent;

    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="surface-card mx-auto max-w-xl p-8 text-center fade-up">
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <h3 className="mt-4 text-2xl">{t.booking.successTitle}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.booking.successBody}</p>
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
            onClick={() => setSent(false)}
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
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} />
        </Field>
        <Field id="whatsapp" label={t.booking.fields.whatsapp}>
          <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" className={inputClass} />
        </Field>
        <Field id="service" label={t.booking.fields.service} error={errors.service}>
          <select id="service" name="service" defaultValue="" className={inputClass}>
            <option value="" disabled>
              {t.booking.select}
            </option>
            {SERVICES.map((s) => (
              <option key={s.key} value={t.services.items[s.key].name}>
                {t.services.items[s.key].name}
              </option>
            ))}
          </select>
        </Field>
        <Field id="duration" label={t.booking.fields.duration} error={errors.duration}>
          <select id="duration" name="duration" defaultValue="" className={inputClass}>
            <option value="" disabled>
              {t.booking.select}
            </option>
            {durations.map((d) => (
              <option key={d} value={d}>
                {d} {t.pricing.minutes}
              </option>
            ))}
          </select>
        </Field>
        <Field id="people" label={t.booking.fields.people}>
          <select id="people" name="people" defaultValue="1" className={inputClass}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <Field id="date" label={t.booking.fields.date} error={errors.date}>
          <input id="date" name="date" type="date" className={inputClass} />
        </Field>
        <Field id="time" label={t.booking.fields.time}>
          <input id="time" name="time" type="time" className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field id="address" label={t.booking.fields.address} error={errors.address}>
            <input id="address" name="address" autoComplete="street-address" className={inputClass} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="message" label={t.booking.fields.message}>
            <textarea id="message" name="message" rows={4} maxLength={1000} className={inputClass} />
          </Field>
        </div>
      </div>

      <label htmlFor="consent" className="mt-5 flex items-start gap-3 text-sm text-muted-foreground">
        <input id="consent" name="consent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 rounded border-input accent-[var(--primary)]" />
        <span>{t.booking.consent}</span>
      </label>
      {errors.consent && <p className="mt-1 text-xs text-destructive">{errors.consent}</p>}

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
      >
        {t.booking.submit}
      </button>

      <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.booking.or}</p>

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
