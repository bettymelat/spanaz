import { getFirebasePublicConfig } from "@/lib/runtime-config";
import { timeMinutes, validDate } from "@/lib/appointment";
type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

export type BookedSlot = {
  id: string;
  startTime: string;
  durationMinutes: number;
};

export async function getBookedSlots(date: string): Promise<BookedSlot[]> {
  if (!validDate(date)) return [];
  const { projectId, apiKey } = await getFirebasePublicConfig();

  const endpoint =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(projectId) +
    "/databases/(default)/documents/availability/" +
    encodeURIComponent(date) +
    "/slots?pageSize=100&key=" +
    encodeURIComponent(apiKey);

  const response = await fetch(endpoint, { headers: { accept: "application/json" } });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error("Could not check current availability.");

  const payload = (await response.json()) as { documents?: FirestoreDocument[] };
  return (payload.documents ?? []).map((document) => {
    const fields = document.fields ?? {};
    return {
      id: document.name?.split("/").pop() ?? "",
      startTime: fields["startTime"]?.stringValue ?? "",
      durationMinutes: Number(fields["durationMinutes"]?.integerValue ?? 0),
    };
  });
}

export function slotIsAvailable(
  booked: BookedSlot[],
  startTime: string,
  durationMinutes: number,
  travelBufferMinutes = 30,
) {
  const requestedStart = timeMinutes(startTime);
  if (
    requestedStart === null ||
    !Number.isFinite(durationMinutes) ||
    durationMinutes <= 0 ||
    requestedStart + durationMinutes > 1440
  )
    return false;
  const requestedEnd = requestedStart + durationMinutes + travelBufferMinutes;

  return !booked.some((slot) => {
    const existingStart = timeMinutes(slot.startTime);
    if (existingStart === null) return false;
    const existingEnd = existingStart + Math.max(30, slot.durationMinutes) + travelBufferMinutes;
    return requestedStart < existingEnd && existingStart < requestedEnd;
  });
}
