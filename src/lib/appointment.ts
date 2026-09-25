/** Appointment wall times always belong to Bucharest, regardless of the visitor's device. */
export function bucharestNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Bucharest",
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

export function futureAppointment(date: string, time: string, now = new Date()) {
  if (!validDate(date) || timeMinutes(time) === null) return false;
  const current = bucharestNow(now);
  return `${date}T${time}` > `${current.date}T${current.time}`;
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
