import type { AdminSession } from "@/lib/admin-auth";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type AdminBooking = {
  id: string;
  reference: string;
  name: string;
  phone: string;
  whatsapp: string;
  serviceKey: string;
  serviceName: string;
  sessionKey: string;
  sessionName: string;
  durationMinutes: number;
  priceLei: number;
  appointmentDate: string;
  appointmentTime: string;
  confirmedDate: string;
  confirmedTime: string;
  sector: string;
  address: string;
  people: number;
  message: string;
  internalNote: string;
  language: "ro" | "en";
  status: BookingStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type BookingAdminPatch = {
  status?: BookingStatus;
  confirmedDate?: string;
  confirmedTime?: string;
  internalNote?: string;
};

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  timestampValue?: string;
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

function getProjectId() {
  const projectId = import.meta.env["VITE_FIREBASE_PROJECT_ID"]?.trim();
  if (!projectId) throw new Error("Firebase project is not configured.");
  return projectId;
}

function getApiKey() {
  const apiKey = import.meta.env["VITE_FIREBASE_API_KEY"]?.trim();
  if (!apiKey) throw new Error("Firebase API key is not configured.");
  return apiKey;
}

function stringField(fields: Record<string, FirestoreValue>, key: string) {
  return fields[key]?.stringValue ?? "";
}

function intField(fields: Record<string, FirestoreValue>, key: string) {
  return Number(fields[key]?.integerValue ?? 0);
}

function timestampField(fields: Record<string, FirestoreValue>, key: string) {
  return fields[key]?.timestampValue ?? "";
}

function parseBooking(document: FirestoreDocument): AdminBooking {
  const fields = document.fields ?? {};
  const id = document.name?.split("/").pop() ?? "";
  const createdAt = timestampField(fields, "createdAt");
  const fallbackReference = id ? "SN-" + id.slice(0, 8).toUpperCase() : "SN-UNKNOWN";

  return {
    id,
    reference: stringField(fields, "reference") || fallbackReference,
    name: stringField(fields, "name"),
    phone: stringField(fields, "phone"),
    whatsapp: stringField(fields, "whatsapp"),
    serviceKey: stringField(fields, "serviceKey"),
    serviceName: stringField(fields, "serviceName"),
    sessionKey: stringField(fields, "sessionKey"),
    sessionName: stringField(fields, "sessionName"),
    durationMinutes: intField(fields, "durationMinutes"),
    priceLei: intField(fields, "priceLei"),
    appointmentDate: stringField(fields, "appointmentDate"),
    appointmentTime: stringField(fields, "appointmentTime"),
    confirmedDate: stringField(fields, "confirmedDate"),
    confirmedTime: stringField(fields, "confirmedTime"),
    sector: stringField(fields, "sector"),
    address: stringField(fields, "address"),
    people: intField(fields, "people"),
    message: stringField(fields, "message"),
    internalNote: stringField(fields, "internalNote"),
    language: stringField(fields, "language") === "en" ? "en" : "ro",
    status: (stringField(fields, "status") || "pending") as BookingStatus,
    source: stringField(fields, "source"),
    createdAt,
    updatedAt: timestampField(fields, "updatedAt") || createdAt,
    updatedBy: stringField(fields, "updatedBy"),
  };
}

async function readError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: { message?: string } };
    return payload.error?.message || "Firestore request failed.";
  } catch {
    return "Firestore request failed with status " + response.status + ".";
  }
}

export async function listAdminBookings(session: AdminSession): Promise<AdminBooking[]> {
  const endpoint =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(getProjectId()) +
    "/databases/(default)/documents:runQuery?key=" +
    encodeURIComponent(getApiKey());

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + session.idToken,
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "bookings" }],
        orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
        limit: 200,
      },
    }),
  });

  if (!response.ok) throw new Error(await readError(response));

  const rows = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return rows
    .filter((row) => Boolean(row.document?.name))
    .map((row) => parseBooking(row.document as FirestoreDocument));
}

const stringValue = (value: string) => ({ stringValue: value });
const timestampValue = (value: string) => ({ timestampValue: value });

export async function updateAdminBooking(
  session: AdminSession,
  bookingId: string,
  patch: BookingAdminPatch,
): Promise<void> {
  const fields: Record<string, FirestoreValue> = {
    updatedAt: timestampValue(new Date().toISOString()),
    updatedBy: stringValue(session.email),
  };

  if (patch.status) fields["status"] = stringValue(patch.status);
  if (patch.confirmedDate !== undefined) {
    fields["confirmedDate"] = stringValue(patch.confirmedDate);
  }
  if (patch.confirmedTime !== undefined) {
    fields["confirmedTime"] = stringValue(patch.confirmedTime);
  }
  if (patch.internalNote !== undefined) {
    fields["internalNote"] = stringValue(patch.internalNote.slice(0, 1500));
  }

  const endpoint = new URL(
    "https://firestore.googleapis.com/v1/projects/" +
      encodeURIComponent(getProjectId()) +
      "/databases/(default)/documents/bookings/" +
      encodeURIComponent(bookingId),
  );
  endpoint.searchParams.set("key", getApiKey());
  endpoint.searchParams.set("currentDocument.exists", "true");
  Object.keys(fields).forEach((field) => {
    endpoint.searchParams.append("updateMask.fieldPaths", field);
  });

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + session.idToken,
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) throw new Error(await readError(response));
}
