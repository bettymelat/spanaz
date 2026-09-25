import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Loader2, RefreshCw, LogOut, MessageCircle } from "lucide-react";
import type { User } from "firebase/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BUSINESS, whatsappLink } from "@/content/business";
import { useI18n } from "@/lib/i18n";
import { calendarLink, bucharestNow } from "@/lib/appointment";
import {
  customerAuthError,
  logoutCustomer,
  resendCustomerVerification,
  subscribeToCustomerAuth,
} from "@/lib/customer-auth";
import {
  cancelCustomerBooking,
  listCustomerBookings,
  type CustomerBooking,
  type CustomerBookingStatus,
} from "@/lib/customer-booking-store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "Contul meu · SPA NAZ" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AccountPage,
});

const statusClass: Record<CustomerBookingStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  confirmed: "bg-emerald-50 text-emerald-800",
  completed: "bg-sky-50 text-sky-800",
  cancelled: "bg-zinc-100 text-zinc-700",
};
const button =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium disabled:opacity-50";

function AccountPage() {
  const { lang } = useI18n();
  const text = useCallback((ro: string, en: string) => (lang === "ro" ? ro : en), [lang]);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const authUid = useRef<string | null>(null);
  const generation = useRef(0);
  const statusLabel: Record<CustomerBookingStatus, string> = {
    pending: text("Așteaptă confirmarea", "Awaiting confirmation"),
    confirmed: text("Confirmată", "Confirmed"),
    completed: text("Finalizată", "Completed"),
    cancelled: text("Anulată", "Cancelled"),
  };
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const rows = await listCustomerBookings();
      if (request === generation.current && authUid.current) setBookings(rows);
    } catch {
      if (request === generation.current)
        setError(
          text(
            "Nu am putut încărca programările. Încearcă din nou.",
            "Could not load appointments. Please try again.",
          ),
        );
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }, [text]);
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void subscribeToCustomerAuth((next) => {
      if (!active) return;
      generation.current++;
      authUid.current = next?.uid ?? null;
      setUser(next);
      setAuthReady(true);
      setBookings([]);
      if (next) void refresh();
    })
      .then((cleanup) => {
        if (active) unsubscribe = cleanup;
        else cleanup();
      })
      .catch((cause) => {
        if (active) {
          setAuthReady(true);
          setError(customerAuthError(cause));
        }
      });
    return () => {
      active = false;
      // Invalidate any in-flight request after leaving this account.
      generation.current++;
      unsubscribe?.();
    };
  }, [refresh]);

  const cancel = async (booking: CustomerBooking) => {
    if (
      busy ||
      !window.confirm(text("Anulezi programarea ", "Cancel appointment ") + booking.reference + "?")
    )
      return;
    setBusy(booking.id);
    setError("");
    try {
      await cancelCustomerBooking(booking);
      setNotice(
        text("Programarea a fost anulată: ", "Appointment cancelled: ") + booking.reference,
      );
      await refresh();
    } catch {
      setError(
        text(
          "Nu am putut anula programarea. Reîmprospătează pagina sau contactează-ne.",
          "Could not cancel. Refresh the page or contact us.",
        ),
      );
    } finally {
      setBusy("");
    }
  };

  const upcoming = (b: CustomerBooking) =>
    ["pending", "confirmed"].includes(b.status) &&
    (b.confirmedDate || b.appointmentDate) >= bucharestNow().date;
  const visible = bookings
    .filter((b) => (tab === "upcoming" ? upcoming(b) : !upcoming(b)))
    .sort((a, b) => {
      const order = (
        (a.confirmedDate || a.appointmentDate) + (a.confirmedTime || a.appointmentTime)
      ).localeCompare(
        (b.confirmedDate || b.appointmentDate) + (b.confirmedTime || b.appointmentTime),
      );
      return tab === "upcoming" ? order : -order;
    });

  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {!authReady ? (
          <div className="surface-card p-10 text-center" role="status">
            <Loader2 className="mx-auto h-7 w-7 animate-spin" />
            {text("Se încarcă…", "Loading…")}
          </div>
        ) : !user ? (
          <section className="surface-card mx-auto max-w-xl p-8 text-center">
            <CalendarDays className="mx-auto h-9 w-9 text-gold" />
            <h1 className="mt-4 text-4xl">{text("Contul tău SPA NAZ", "Your SPA NAZ account")}</h1>
            <p className="mt-4 text-muted-foreground">
              {text(
                "Autentifică-te pentru a vedea programările făcute din contul tău.",
                "Sign in to see appointments booked through your account.",
              )}
            </p>
            {error && (
              <p role="alert" className="mt-3 text-destructive">
                {error}
              </p>
            )}
            <a href="/#account" className={button + " mt-6"}>
              {text("Autentificare / Creează un cont", "Sign in / Create an account")}
            </a>
          </section>
        ) : (
          <>
            <section className="surface-card p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0">
                  <p className="eyebrow">SPA NAZ</p>
                  <h1 className="mt-2 text-4xl">{text("Programările mele", "My appointments")}</h1>
                  <p className="mt-3 break-all text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href="/#rezervare" className={button}>
                    {text("Programare nouă", "New appointment")}
                  </a>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void refresh()}
                    className={button}
                  >
                    <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
                    {text("Actualizează", "Refresh")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      void logoutCustomer().catch(() =>
                        setError(text("Încearcă din nou.", "Please try again.")),
                      )
                    }
                    className={button}
                  >
                    <LogOut className="h-4 w-4" />
                    {text("Ieșire", "Sign out")}
                  </button>
                </div>
              </div>
              {!user.emailVerified && (
                <div className="mt-5 rounded-xl border bg-background p-4 text-sm">
                  <p>
                    {text(
                      "Verifică adresa de email pentru a-ți proteja contul.",
                      "Verify your email to help protect your account.",
                    )}
                  </p>
                  <button
                    type="button"
                    className="mt-2 min-h-11 underline"
                    onClick={() =>
                      void resendCustomerVerification()
                        .then(() =>
                          setNotice(
                            text(
                              "Emailul de verificare a fost trimis.",
                              "Verification email sent.",
                            ),
                          ),
                        )
                        .catch((cause) => setError(customerAuthError(cause)))
                    }
                  >
                    {text("Retrimite emailul de verificare", "Resend verification email")}
                  </button>
                </div>
              )}
              {notice && (
                <p role="status" className="mt-5 rounded-xl bg-primary/5 p-4 text-sm">
                  {notice}
                </p>
              )}
              {error && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl bg-destructive/5 p-4 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
            </section>
            <div
              className="my-6 flex flex-wrap gap-2"
              role="group"
              aria-label={text("Filtre programări", "Appointment filters")}
            >
              {(["upcoming", "history"] as const).map((key) => (
                <button
                  type="button"
                  key={key}
                  aria-pressed={tab === key}
                  onClick={() => setTab(key)}
                  className={button + (tab === key ? " ring-2 ring-primary" : "")}
                >
                  {key === "upcoming" ? text("Viitoare", "Upcoming") : text("Istoric", "History")} (
                  {bookings.filter((b) => (key === "upcoming" ? upcoming(b) : !upcoming(b))).length}
                  )
                </button>
              ))}
            </div>
            {loading && (
              <p role="status" className="mb-4 text-sm">
                {text("Se actualizează programările…", "Refreshing appointments…")}
              </p>
            )}
            {!loading && visible.length === 0 && (
              <section className="surface-card p-8 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-gold" />
                <h2 className="mt-4 text-2xl">
                  {text("Nicio programare în această listă", "No appointments in this view")}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                  {text(
                    "Programările trimise după autentificare apar aici. Pentru o rezervare făcută fără cont, contactează-ne cu referința ei.",
                    "Bookings made while signed in appear here. For a guest booking, contact us with your booking reference.",
                  )}
                </p>
              </section>
            )}
            <div className="space-y-4">
              {visible.map((booking) => {
                const active = ["pending", "confirmed"].includes(booking.status);
                const rescheduleMessage = text(
                  `Bună! Aș dori să reprogramez rezervarea ${booking.reference}, din ${booking.confirmedDate || booking.appointmentDate} la ${booking.confirmedTime || booking.appointmentTime}.`,
                  `Hello! I would like to reschedule booking ${booking.reference}, on ${booking.confirmedDate || booking.appointmentDate} at ${booking.confirmedTime || booking.appointmentTime}.`,
                );
                const feedbackMessage = text(
                  `Bună! Aș dori să las o recenzie pentru experiența SPA NAZ, rezervarea ${booking.reference}.`,
                  `Hello! I would like to leave feedback about my SPA NAZ experience, booking ${booking.reference}.`,
                );
                return (
                  <article key={booking.id} className="surface-card p-5 sm:p-7">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <span
                          className={
                            "inline-block rounded-full px-3 py-1 text-xs font-semibold " +
                            statusClass[booking.status]
                          }
                        >
                          {statusLabel[booking.status]}
                        </span>
                        <h2 className="mt-3 text-3xl">{booking.serviceName}</h2>
                        <p className="mt-2 text-xs tracking-widest text-muted-foreground">
                          {booking.reference}
                        </p>
                      </div>
                      <p className="font-display text-3xl">
                        {booking.priceLei * booking.people} lei
                      </p>
                    </div>
                    <dl className="mt-5 grid gap-4 rounded-2xl bg-background p-4 sm:grid-cols-3">
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {text("Data și ora", "Date and time")}
                        </dt>
                        <dd className="mt-1 font-medium">
                          {booking.confirmedDate || booking.appointmentDate} ·{" "}
                          {booking.confirmedTime || booking.appointmentTime}
                        </dd>
                        <dd className="text-xs text-muted-foreground">Europe/Bucharest</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {text("Sesiune", "Session")}
                        </dt>
                        <dd className="mt-1">
                          {booking.sessionName} · {booking.durationMinutes} min × {booking.people}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          {text("Locație", "Location")}
                        </dt>
                        <dd className="mt-1 break-words">
                          {booking.sector} · {booking.address}
                        </dd>
                      </div>
                    </dl>
                    {booking.status === "pending" && (
                      <p className="mt-4 text-sm text-muted-foreground">
                        {text(
                          "Ora solicitată devine definitivă după confirmarea SPA NAZ.",
                          "Your requested time becomes final after SPA NAZ confirms it.",
                        )}
                      </p>
                    )}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {booking.status === "confirmed" && (
                        <a
                          href={calendarLink(booking)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={button}
                        >
                          {text("Adaugă în calendar", "Add to calendar")}
                        </a>
                      )}
                      {active && (
                        <a
                          href={whatsappLink(lang, rescheduleMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={button}
                        >
                          <MessageCircle className="h-4 w-4" />
                          {text("Solicită reprogramarea", "Request reschedule")}
                        </a>
                      )}
                      {active && (
                        <button
                          type="button"
                          disabled={Boolean(busy)}
                          onClick={() => void cancel(booking)}
                          className={button + " text-destructive"}
                        >
                          {busy === booking.id && <Loader2 className="h-4 w-4 animate-spin" />}
                          {text("Anulează", "Cancel appointment")}
                        </button>
                      )}
                      {booking.status === "completed" && (
                        <a
                          href={whatsappLink(lang, feedbackMessage)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={button}
                        >
                          <MessageCircle className="h-4 w-4" />
                          {text("Lasă o recenzie", "Leave feedback")}
                        </a>
                      )}
                      {!active && (
                        <a href="/#rezervare" className={button}>
                          {text("Rezervă din nou", "Book again")}
                        </a>
                      )}
                    </div>
                    {active && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        {text(
                          "Solicitarea prin WhatsApp păstrează programarea actuală până când convenim noua oră.",
                          "A WhatsApp reschedule request keeps your current appointment until we agree a new time.",
                        )}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
            <section className="mt-8 rounded-2xl border bg-background p-5 text-sm text-muted-foreground">
              <h2 className="text-xl text-foreground">
                {text("Ai nevoie de ajutor?", "Need help?")}
              </h2>
              <p className="mt-2">
                {text(
                  "Pentru rezervări fără cont sau solicitări privind datele tale, contactează-ne cu referința programării.",
                  "For guest bookings or requests about your data, contact us with your appointment reference.",
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-4">
                <a href={`mailto:${BUSINESS.email}`} className="underline">
                  {BUSINESS.email}
                </a>
                <a href="/privacy" className="underline">
                  {text("Confidențialitate", "Privacy")}
                </a>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
