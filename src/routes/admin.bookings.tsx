import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  Loader2,
  LogOut,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  clearAdminSession,
  getValidAdminSession,
  type AdminSession,
} from "@/lib/admin-auth";
import {
  listAdminBookings,
  seedConfirmedAvailability,
  updateAdminBooking,
  type AdminBooking,
  type BookingStatus,
} from "@/lib/admin-booking-store";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({
    meta: [
      { title: "SPA NAZ Bookings" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBookings,
});

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClasses: Record<BookingStatus, string> = {
  pending: "border-amber-300/60 bg-amber-50 text-amber-800",
  confirmed: "border-emerald-300/60 bg-emerald-50 text-emerald-800",
  completed: "border-sky-300/60 bg-sky-50 text-sky-800",
  cancelled: "border-zinc-300 bg-zinc-100 text-zinc-700",
};

function dateTimeLabel(date: string, time: string) {
  if (!date) return "No date";
  const parsed = new Date(date + "T" + (time || "00:00") + ":00");
  if (Number.isNaN(parsed.getTime())) return [date, time].filter(Boolean).join(" ");
  return new Intl.DateTimeFormat("ro-RO", {
    dateStyle: "medium",
    timeStyle: time ? "short" : undefined,
  }).format(parsed);
}

function phoneForWhatsApp(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "40" + digits.slice(1);
  return digits;
}

function customerWhatsAppLink(booking: AdminBooking) {
  const phone = phoneForWhatsApp(booking.whatsapp || booking.phone);
  const scheduledDate = booking.confirmedDate || booking.appointmentDate;
  const scheduledTime = booking.confirmedTime || booking.appointmentTime;
  const message =
    booking.status === "confirmed"
      ? "Bună, " +
        booking.name +
        "! Programarea SPA NAZ " +
        booking.reference +
        " este confirmată pentru " +
        scheduledDate +
        " la " +
        scheduledTime +
        "."
      : "Bună, " +
        booking.name +
        "! Te contactăm în legătură cu rezervarea SPA NAZ " +
        booking.reference +
        ".";
  return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
}

function minutesFromTime(time: string) {
  const parts = time.split(":");
  if (parts.length !== 2) return null;
  const hours = Number(parts[0] ?? Number.NaN);
  const minutes = Number(parts[1] ?? Number.NaN);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

function hasScheduleConflict(
  bookings: AdminBooking[],
  current: AdminBooking,
  date: string,
  time: string,
) {
  const start = minutesFromTime(time);
  if (!date || start === null) return null;
  const end = start + Math.max(30, current.durationMinutes) + 30;

  return (
    bookings.find((booking) => {
      if (booking.id === current.id || booking.status !== "confirmed") return false;
      const otherDate = booking.confirmedDate || booking.appointmentDate;
      const otherTime = booking.confirmedTime || booking.appointmentTime;
      if (otherDate !== date) return false;
      const otherStart = minutesFromTime(otherTime);
      if (otherStart === null) return false;
      const otherEnd = otherStart + Math.max(30, booking.durationMinutes) + 30;
      return start < otherEnd && otherStart < end;
    }) ?? null
  );
}

function AdminBookings() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<BookingStatus | "all">("pending");
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState("");
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const knownBookingIds = useRef<Set<string> | null>(null);
  const availabilitySeeded = useRef(false);
  const [scheduleDrafts, setScheduleDrafts] = useState<
    Record<string, { date: string; time: string; note: string }>
  >({});

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const validSession = await getValidAdminSession();
      if (!validSession) {
        window.location.replace("/admin/login");
        return;
      }
      setSession(validSession);
      const rows = await listAdminBookings(validSession);

      if (!availabilitySeeded.current) {
        await seedConfirmedAvailability(validSession, rows);
        availabilitySeeded.current = true;
      }

      const known = knownBookingIds.current;
      if (
        known &&
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        const newPending = rows.filter(
          (booking) => booking.status === "pending" && !known.has(booking.id),
        );
        if (newPending.length > 0) {
          const first = newPending[0];
          new Notification(
            newPending.length === 1
              ? "New SPA NAZ booking"
              : newPending.length + " new SPA NAZ bookings",
            {
              body:
                newPending.length === 1 && first
                  ? first.name + " · " + first.reference
                  : "Open the booking dashboard to review them.",
            },
          );
        }
      }
      knownBookingIds.current = new Set(rows.map((booking) => booking.id));
      setBookings(rows);
      setScheduleDrafts((current) => {
        const next = { ...current };
        rows.forEach((booking) => {
          if (!next[booking.id]) {
            next[booking.id] = {
              date: booking.confirmedDate || booking.appointmentDate,
              time: booking.confirmedTime || booking.appointmentTime,
              note: booking.internalNote,
            };
          }
        });
        return next;
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setAlertsEnabled(Notification.permission === "granted");
    }
    void load();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void load(true);
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const counts = useMemo(
    () => ({
      pending: bookings.filter((booking) => booking.status === "pending").length,
      confirmed: bookings.filter((booking) => booking.status === "confirmed").length,
      completed: bookings.filter((booking) => booking.status === "completed").length,
      cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
    }),
    [bookings],
  );

  const visibleBookings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (filter !== "all" && booking.status !== filter) return false;
      if (!normalized) return true;
      return [
        booking.reference,
        booking.name,
        booking.phone,
        booking.whatsapp,
        booking.serviceName,
        booking.address,
        booking.sector,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [bookings, filter, query]);

  const updateDraft = (
    bookingId: string,
    key: "date" | "time" | "note",
    value: string,
  ) => {
    setScheduleDrafts((current) => ({
      ...current,
      [bookingId]: {
        date: current[bookingId]?.date ?? "",
        time: current[bookingId]?.time ?? "",
        note: current[bookingId]?.note ?? "",
        [key]: value,
      },
    }));
  };

  const applyUpdate = async (
    booking: AdminBooking,
    status?: BookingStatus,
    includeSchedule = false,
  ) => {
    const validSession = await getValidAdminSession();
    if (!validSession) {
      window.location.replace("/admin/login");
      return;
    }
    setSession(validSession);

    const draft = scheduleDrafts[booking.id] ?? {
      date: booking.confirmedDate || booking.appointmentDate,
      time: booking.confirmedTime || booking.appointmentTime,
      note: booking.internalNote,
    };

    if (status === "confirmed") {
      if (!draft.date || !draft.time) {
        setError("Choose a confirmed date and time before confirming the booking.");
        return;
      }
      const conflict = hasScheduleConflict(bookings, booking, draft.date, draft.time);
      if (
        conflict &&
        !window.confirm(
          "This overlaps with confirmed booking " +
            conflict.reference +
            ". Confirm this booking anyway?",
        )
      ) {
        return;
      }
    }

    setSavingId(booking.id);
    setError("");
    try {
      await updateAdminBooking(validSession, booking, {
        ...(status ? { status } : {}),
        ...(includeSchedule || status === "confirmed"
          ? {
              confirmedDate: draft.date,
              confirmedTime: draft.time,
              internalNote: draft.note,
            }
          : {}),
      });
      await load(true);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update booking.");
    } finally {
      setSavingId("");
    }
  };

  const enableAlerts = async () => {
    setError("");
    if (typeof Notification === "undefined") {
      setError("Browser notifications are not supported on this device.");
      return;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === "granted";
    setAlertsEnabled(granted);
    if (!granted) {
      setError("Browser alerts were not enabled. You can still rely on automatic dashboard refresh.");
    }
  };

  const exportCsv = () => {
    const escape = (value: string | number) => {
      const text = String(value ?? "");
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const header = [
      "Reference",
      "Status",
      "Customer",
      "Phone",
      "WhatsApp",
      "Service",
      "Session",
      "Duration minutes",
      "Price lei",
      "Requested date",
      "Requested time",
      "Confirmed date",
      "Confirmed time",
      "Sector",
      "Address",
      "People",
      "Customer message",
      "Internal note",
      "Created at",
      "Updated at",
      "Updated by",
    ];
    const rows = bookings.map((booking) => [
      booking.reference,
      booking.status,
      booking.name,
      booking.phone,
      booking.whatsapp,
      booking.serviceName,
      booking.sessionName,
      booking.durationMinutes,
      booking.priceLei,
      booking.appointmentDate,
      booking.appointmentTime,
      booking.confirmedDate,
      booking.confirmedTime,
      booking.sector,
      booking.address,
      booking.people,
      booking.message,
      booking.internalNote,
      booking.createdAt,
      booking.updatedAt,
      booking.updatedBy,
    ]);
    const csv = [header, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "spanaz-bookings-" + new Date().toISOString().slice(0, 10) + ".csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const logout = () => {
    clearAdminSession();
    window.location.replace("/admin/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Loading SpaNaz bookings…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand pb-16">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="eyebrow">SPA NAZ OWNER</p>
            <h1 className="mt-1 text-2xl">Bookings</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void enableAlerts()}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium"
              title={alertsEnabled ? "Browser booking alerts are enabled" : "Enable browser booking alerts"}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden xl:inline">{alertsEnabled ? "Alerts on" : "Enable alerts"}</span>
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={bookings.length === 0}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium"
            >
              <RefreshCw className={"h-4 w-4 " + (refreshing ? "animate-spin" : "")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={
                  "surface-card p-5 text-left transition ring-offset-2 " +
                  (filter === status ? "ring-2 ring-primary" : "")
                }
              >
                <p className="text-sm text-muted-foreground">{statusLabels[status]}</p>
                <p className="mt-1 font-display text-4xl">{counts[status]}</p>
              </button>
            ),
          )}
        </section>

        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone, reference, service or address"
              className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={
              "rounded-full border px-5 py-3 text-sm font-medium " +
              (filter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border")
            }
          >
            All bookings
          </button>
        </section>

        <p className="mt-5 text-sm text-muted-foreground">
          Showing {visibleBookings.length} of {bookings.length} bookings
        </p>

        <section className="mt-4 space-y-4">
          {visibleBookings.length === 0 && (
            <div className="surface-card p-10 text-center">
              <CalendarCheck className="mx-auto h-8 w-8 text-gold" />
              <h2 className="mt-3 text-xl">No bookings in this view</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Try another status or search term.
              </p>
            </div>
          )}

          {visibleBookings.map((booking) => {
            const draft = scheduleDrafts[booking.id] ?? {
              date: booking.confirmedDate || booking.appointmentDate,
              time: booking.confirmedTime || booking.appointmentTime,
              note: booking.internalNote,
            };
            const saving = savingId === booking.id;

            return (
              <article key={booking.id} className="surface-card overflow-hidden">
                <div className="grid gap-6 p-5 lg:grid-cols-[1.2fr_0.9fr] lg:p-6">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl">{booking.name || "Unnamed customer"}</h2>
                          <span
                            className={
                              "rounded-full border px-2.5 py-1 text-xs font-semibold " +
                              statusClasses[booking.status]
                            }
                          >
                            {statusLabels[booking.status]}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {booking.reference}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Requested {booking.createdAt ? new Date(booking.createdAt).toLocaleString("ro-RO") : "—"}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Requested appointment
                        </p>
                        <p className="mt-1 font-medium">
                          {dateTimeLabel(booking.appointmentDate, booking.appointmentTime)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Treatment
                        </p>
                        <p className="mt-1 font-medium">{booking.serviceName}</p>
                        <p className="mt-1 text-muted-foreground">
                          {booking.sessionName} · {booking.durationMinutes} min · {booking.priceLei} lei
                        </p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Contact
                        </p>
                        <p className="mt-1 font-medium">{booking.phone}</p>
                        {booking.whatsapp && booking.whatsapp !== booking.phone && (
                          <p className="mt-1 text-muted-foreground">WhatsApp: {booking.whatsapp}</p>
                        )}
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Location
                        </p>
                        <p className="mt-1 font-medium">{booking.sector}</p>
                        <p className="mt-1 text-muted-foreground">{booking.address}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={"tel:" + booking.phone}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                      <a
                        href={customerWhatsAppLink(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-medium text-whatsapp-foreground"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    {booking.message && (
                      <div className="mt-4 rounded-xl border border-border bg-background p-4">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          Customer message
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                          {booking.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-gold" />
                      <h3 className="font-semibold">Owner actions</h3>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Confirmed date
                        </label>
                        <input
                          type="date"
                          value={draft.date}
                          onChange={(event) => updateDraft(booking.id, "date", event.target.value)}
                          className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground">
                          Confirmed time
                        </label>
                        <input
                          type="time"
                          value={draft.time}
                          onChange={(event) => updateDraft(booking.id, "time", event.target.value)}
                          className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">
                        Internal note
                      </label>
                      <textarea
                        rows={4}
                        maxLength={1500}
                        value={draft.note}
                        onChange={(event) => updateDraft(booking.id, "note", event.target.value)}
                        placeholder="Private note for the owner"
                        className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => void applyUpdate(booking, undefined, true)}
                      disabled={saving}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary px-4 py-2.5 text-sm font-medium text-primary disabled:opacity-50"
                    >
                      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                      Save schedule / note
                    </button>

                    <div className="mt-4 grid gap-2">
                      {booking.status !== "confirmed" && booking.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => void applyUpdate(booking, "confirmed", true)}
                          disabled={saving}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                          <CalendarCheck className="h-4 w-4" />
                          Confirm booking
                        </button>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          type="button"
                          onClick={() => void applyUpdate(booking, "completed")}
                          disabled={saving}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Mark completed
                        </button>
                      )}
                      {booking.status !== "cancelled" && booking.status !== "completed" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Cancel booking " + booking.reference + "?")) {
                              void applyUpdate(booking, "cancelled");
                            }
                          }}
                          disabled={saving}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-destructive/40 px-4 py-3 text-sm font-medium text-destructive disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel booking
                        </button>
                      )}
                    </div>

                    <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <UserRound className="h-3.5 w-3.5" />
                        {session?.email}
                      </p>
                      {booking.updatedBy && (
                        <p className="mt-2">
                          Last updated by {booking.updatedBy}
                          {booking.updatedAt
                            ? " · " + new Date(booking.updatedAt).toLocaleString("ro-RO")
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
