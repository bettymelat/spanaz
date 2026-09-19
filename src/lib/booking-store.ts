export type BookingRequest = {
  name: string;
  phone: string;
  whatsapp: string;
  serviceKey: string;
  serviceName: string;
  sessionKey: string;
  sessionName: string;
  durationMinutes: number;
  priceLei: number;
  date: string;
  time: string;
  sector: string;
  address: string;
  people: number;
  message: string;
  language: "ro" | "en";
};

export class BookingConfigurationError extends Error {
  constructor() {
    super("Firebase booking storage is not configured.");
    this.name = "BookingConfigurationError";
  }
}

const stringValue = (value: string) => ({ stringValue: value });
const integerValue = (value: number) => ({ integerValue: String(value) });
const timestampValue = (value: string) => ({ timestampValue: value });

function createBookingReference() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  let suffix = "";
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
  return "SN-" + yy + mm + dd + "-" + suffix;
}

export async function createBooking(
  input: BookingRequest,
): Promise<{ id: string; reference: string }> {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim();
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim();

  if (!projectId || !apiKey) throw new BookingConfigurationError();

  const reference = createBookingReference();
  const endpoint = new URL(
    "https://firestore.googleapis.com/v1/projects/" +
      encodeURIComponent(projectId) +
      "/databases/(default)/documents/bookings",
  );
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fields: {
        reference: stringValue(reference),
        name: stringValue(input.name),
        phone: stringValue(input.phone),
        whatsapp: stringValue(input.whatsapp),
        serviceKey: stringValue(input.serviceKey),
        serviceName: stringValue(input.serviceName),
        sessionKey: stringValue(input.sessionKey),
        sessionName: stringValue(input.sessionName),
        durationMinutes: integerValue(input.durationMinutes),
        priceLei: integerValue(input.priceLei),
        appointmentDate: stringValue(input.date),
        appointmentTime: stringValue(input.time),
        sector: stringValue(input.sector),
        address: stringValue(input.address),
        people: integerValue(input.people),
        message: stringValue(input.message),
        language: stringValue(input.language),
        status: stringValue("pending"),
        source: stringValue("website"),
        createdAt: timestampValue(new Date().toISOString()),
      },
    }),
  });

  if (!response.ok) {
    let detail = "Firestore returned " + response.status;
    try {
      const payload = (await response.json()) as { error?: { message?: string } };
      if (payload.error?.message) detail = payload.error.message;
    } catch {
      // Keep the status-only message when Firestore does not return JSON.
    }
    throw new Error(detail);
  }

  const payload = (await response.json()) as { name?: string };
  const id = payload.name?.split("/").pop();
  if (!id) throw new Error("Booking was stored but no booking id was returned.");
  return { id, reference };
}
