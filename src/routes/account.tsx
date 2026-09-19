import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { User } from "firebase/auth";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BUSINESS } from "@/content/business";
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
    meta: [
      { title: "My SPA NAZ Account" },
      { name: "description", content: "View and manage your SPA NAZ booking requests." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

const statusLabel: Record<CustomerBookingStatus, string> = {
  pending: "Pending confirmation",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClass: Record<CustomerBookingStatus, string> = {
  pending: "border-amber-300/60 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-300/60 bg-emerald-50 text-emerald-800",
  completed: "border-sky-300/60 bg-sky-50 text-sky-800",
  cancelled: "border-zinc-300 bg-zinc-100 text-zinc-700",
};

function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  const refreshBookings = async () => {
    setLoadingBookings(true);
    setError("");
    try {
      setBookings(await listCustomerBookings());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;

    void subscribeToCustomerAuth((nextUser) => {
      if (!active) return;
      setUser(nextUser);
      setAuthReady(true);
      if (nextUser) void refreshBookings();
      else setBookings([]);
    })
      .then((cleanup) => {
        if (active) unsubscribe = cleanup;
        else cleanup();
      })
      .catch((authError) => {
        if (active) {
          setAuthReady(true);
          setError(customerAuthError(authError));
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const cancel = async (booking: CustomerBooking) => {
    if (!window.confirm("Cancel booking " + booking.reference + "?")) return;
    setCancellingId(booking.id);
    setError("");
    try {
      await cancelCustomerBooking(booking.id);
      setNotice("Booking " + booking.reference + " was cancelled.");
      await refreshBookings();
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : "Could not cancel booking.");
    } finally {
      setCancellingId("");
    }
  };

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {!user ? (
          <section className="surface-card mx-auto max-w-xl p-8 text-center">
            <CalendarDays className="mx-auto h-9 w-9 text-gold" />
            <h1 className="mt-4 text-3xl">Your SPA NAZ account</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Sign in first to see bookings that were created while you were signed in.
            </p>
            <a
              href="/#account"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Sign in or create account
            </a>
          </section>
        ) : (
          <>
            <section className="surface-card p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="eyebrow">SPA NAZ ACCOUNT</p>
                  <h1 className="mt-2 text-3xl">My bookings</h1>
                  <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    {user.emailVerified ? (
                      <>
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <span>Email verified</span>
                      </>
                    ) : (
                      <>
                        <Clock3 className="h-4 w-4 text-amber-700" />
                        <span>Email not verified yet</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!user.emailVerified && (
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setNotice("");
                        void resendCustomerVerification()
                          .then(() => setNotice("Verification email sent."))
                          .catch((verificationError) =>
                            setError(customerAuthError(verificationError)),
                          );
                      }}
                      className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium"
                    >
                      Resend verification
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void refreshBookings()}
                    disabled={loadingBookings}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={"h-4 w-4 " + (loadingBookings ? "animate-spin" : "")} />
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => void logoutCustomer()}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>

              {notice && (
                <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                  {notice}
                </div>
              )}
              {error && (
                <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}
            </section>

            <section className="mt-6">
              {loadingBookings && bookings.length === 0 ? (
                <div className="surface-card p-10 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">Loading your bookings…</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="surface-card p-10 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-gold" />
                  <h2 className="mt-3 text-2xl">No account-linked bookings yet</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                    Bookings made while signed in will appear here. Older guest bookings are still safely stored, but are not automatically attached to a newly created account.
                  </p>
                  <a
                    href="/#rezervare"
                    className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                  >
                    Book an appointment
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const scheduledDate = booking.confirmedDate || booking.appointmentDate;
                    const scheduledTime = booking.confirmedTime || booking.appointmentTime;
                    const cancellable =
                      booking.status === "pending" || booking.status === "confirmed";
                    return (
                      <article key={booking.id} className="surface-card p-5 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-2xl">{booking.serviceName}</h2>
                              <span
                                className={
                                  "rounded-full border px-2.5 py-1 text-xs font-semibold " +
                                  statusClass[booking.status]
                                }
                              >
                                {statusLabel[booking.status]}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                              {booking.reference}
                            </p>
                          </div>
                          <p className="font-display text-2xl">{booking.priceLei} lei</p>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-border bg-background p-4">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              Appointment
                            </p>
                            <p className="mt-1 font-medium">{scheduledDate || "—"}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{scheduledTime || "—"}</p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-4">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              Session
                            </p>
                            <p className="mt-1 font-medium">
                              {booking.sessionName} · {booking.durationMinutes} min
                            </p>
                          </div>
                          <div className="rounded-xl border border-border bg-background p-4">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              Location
                            </p>
                            <p className="mt-1 font-medium">{booking.sector}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{booking.address}</p>
                          </div>
                        </div>

                        {cancellable && (
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                            <p className="text-xs text-muted-foreground">
                              Need a different time? Cancel this request and create a new booking, or contact SPA NAZ directly.
                            </p>
                            <button
                              type="button"
                              onClick={() => void cancel(booking)}
                              disabled={cancellingId === booking.id}
                              className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2.5 text-sm font-medium text-destructive disabled:opacity-50"
                            >
                              {cancellingId === booking.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              Cancel booking
                            </button>
                          </div>
                        )}

                        {booking.status === "completed" && (
                          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-emerald-800">
                            <CheckCircle2 className="h-4 w-4" />
                            Appointment completed
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-border bg-background p-5 text-sm text-muted-foreground">
              <h2 className="text-lg text-foreground">Account & privacy</h2>
              <p className="mt-2 leading-relaxed">
                To request access, correction or deletion of your account data, contact SPA NAZ from the email address associated with this account. Booking records may be retained where required for legitimate operational or legal purposes.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={
                    "mailto:" +
                    BUSINESS.email +
                    "?subject=" +
                    encodeURIComponent("SPA NAZ account / data request")
                  }
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Request account/data action
                </a>
                <a href="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">
                  Privacy policy
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
