const BUCHAREST_TIME_ZONE = "Europe/Bucharest";

/** Appointment wall times always belong to Bucharest, regardless of the visitor's device. */
export function bucharestNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUCHAREST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

export function validDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T12:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function timeMinutes(time: string) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const [hour, minute] = time.split(":").map(Number);
  return hour! * 60 + minute!;
}

function bucharestWallParts(instant: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUCHAREST_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return {
    year: Number(part("year")),
    month: Number(part("month")),
    day: Number(part("day")),
    hour: Number(part("hour")),
    minute: Number(part("minute")),
  };
}

/**
 * Convert a Bucharest wall-clock appointment to a real UTC instant.
 * Returns null for malformed values and for wall times that do not exist
 * during a daylight-saving transition.
 */
export function bucharestAppointmentIso(date: string, time: string) {
  if (!validDate(date) || timeMinutes(time) === null) return null;

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const targetWallMs = Date.UTC(year!, month! - 1, day!, hour!, minute!);
  let instantMs = targetWallMs;

  // Resolve the timezone offset from Intl instead of assuming the visitor's
  // device timezone or hard-coding EET/EEST.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const wall = bucharestWallParts(new Date(instantMs));
    const representedWallMs = Date.UTC(
      wall.year,
      wall.month - 1,
      wall.day,
      wall.hour,
      wall.minute,
    );
    const difference = representedWallMs - targetWallMs;
    if (difference === 0) break;
    instantMs -= difference;
  }

  const resolved = new Date(instantMs);
  const wall = bucharestWallParts(resolved);
  if (
    wall.year !== year ||
    wall.month !== month ||
    wall.day !== day ||
    wall.hour !== hour ||
    wall.minute !== minute
  ) {
    return null;
  }

  return resolved.toISOString();
}

export function futureAppointment(date: string, time: string, now = new Date()) {
  const iso = bucharestAppointmentIso(date, time);
  return iso !== null && new Date(iso).getTime() > now.getTime();
}

export function calendarLink(booking: {
  serviceName: string;
  confirmedDate: string;
  appointmentDate: string;
  confirmedTime: string;
  appointmentTime: string;
  durationMinutes: number;
  address: string;
  reference: string;
  people?: number;
}) {
  const date = booking.confirmedDate || booking.appointmentDate;
  const time = booking.confirmedTime || booking.appointmentTime;
  if (!validDate(date) || timeMinutes(time) === null) return "";
  // UTC arithmetic here preserves wall time; the calendar receives an explicit Bucharest timezone.
  const start = new Date(`${date}T${time}:00Z`);
  const end = new Date(
    start.getTime() + booking.durationMinutes * Math.max(1, booking.people ?? 1) * 60_000,
  );
  const format = (d: Date) => d.toISOString().replace(/[-:]/g, "").slice(0, 15);
  return (
    "https://calendar.google.com/calendar/render?" +
    new URLSearchParams({
      action: "TEMPLATE",
      text: `SPA NAZ · ${booking.serviceName}`,
      dates: `${format(start)}/${format(end)}`,
      ctz: "Europe/Bucharest",
      location: booking.address,
      details: `Booking ${booking.reference}. Contact SPA NAZ to change your appointment.`,
    })
  );
}

export function csvCell(value: string | number) {
  const text = String(value ?? "");
  // Quoting alone does not stop spreadsheets from evaluating user-supplied formulas.
  const safe = /^[\s]*[=+@-]|^[\t\r\n]/.test(text) ? "'" + text : text;
  return '"' + safe.replaceAll('"', '""') + '"';
}
