import { getCurrentCustomerSession } from "@/lib/customer-auth";
import type { CustomerBooking } from "@/lib/customer-booking-store";
import type { AdminSession } from "@/lib/admin-auth";
import { getFirebasePublicConfig } from "@/lib/runtime-config";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type SpaReview = {
  id: string;
  version: string;
  author: string;
  rating: number;
  comment: string;
  serviceName: string;
  language: "ro" | "en";
  status: ReviewStatus;
  createdAt: string;
  moderatedAt: string;
  moderatedBy: string;
};

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  timestampValue?: string;
};

type FirestoreDocument = {
  name?: string;
  updateTime?: string;
  fields?: Record<string, FirestoreValue>;
};

const stringValue = (value: string) => ({ stringValue: value });
const integerValue = (value: number) => ({ integerValue: String(value) });
const timestampValue = (value: string) => ({ timestampValue: value });

function stringField(fields: Record<string, FirestoreValue>, key: string) {
  return fields[key]?.stringValue ?? "";
}

function intField(fields: Record<string, FirestoreValue>, key: string) {
  return Number(fields[key]?.integerValue ?? 0);
}

function timestampField(fields: Record<string, FirestoreValue>, key: string) {
  return fields[key]?.timestampValue ?? "";
}

function parseReview(document: FirestoreDocument): SpaReview {
  const fields = document.fields ?? {};
  return {
    id: document.name?.split("/").pop() ?? "",
    version: document.updateTime ?? "",
    author: stringField(fields, "author"),
    rating: intField(fields, "rating"),
    comment: stringField(fields, "comment"),
    serviceName: stringField(fields, "serviceName"),
    language: stringField(fields, "language") === "en" ? "en" : "ro",
    status: (stringField(fields, "status") || "pending") as ReviewStatus,
    createdAt: timestampField(fields, "createdAt"),
    moderatedAt: timestampField(fields, "moderatedAt"),
    moderatedBy: stringField(fields, "moderatedBy"),
  };
}

async function readError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: { message?: string } };
    return payload.error?.message || "Review request failed.";
  } catch {
    return "Review request failed with status " + response.status + ".";
  }
}

function documentName(projectId: string, path: string) {
  return "projects/" + projectId + "/databases/(default)/documents/" + path;
}

export async function getReviewForBooking(bookingId: string): Promise<SpaReview | null> {
  const session = await getCurrentCustomerSession();
  if (!session) return null;

  const { projectId, apiKey } = await getFirebasePublicConfig();
  const endpoint =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(projectId) +
    "/databases/(default)/documents/reviews/" +
    encodeURIComponent(bookingId) +
    "?key=" +
    encodeURIComponent(apiKey);

  const response = await fetch(endpoint, {
    headers: { authorization: "Bearer " + session.idToken },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await readError(response));
  return parseReview((await response.json()) as FirestoreDocument);
}

export async function submitReview(
  booking: CustomerBooking,
  input: { author: string; rating: number; comment: string; language: "ro" | "en" },
): Promise<SpaReview> {
  const session = await getCurrentCustomerSession();
  if (!session) throw new Error("Sign in to leave a review.");
  if (booking.status !== "completed") throw new Error("Only completed appointments can be reviewed.");

  const author = input.author.trim();
  const comment = input.comment.trim();
  if (author.length < 2 || author.length > 60) throw new Error("Display name must be 2–60 characters.");
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)
    throw new Error("Choose a rating from 1 to 5.");
  if (comment.length < 10 || comment.length > 1200)
    throw new Error("Review must be 10–1200 characters.");

  const { projectId, apiKey } = await getFirebasePublicConfig();
  const endpoint = new URL(
    "https://firestore.googleapis.com/v1/projects/" +
      encodeURIComponent(projectId) +
      "/databases/(default)/documents/reviews",
  );
  endpoint.searchParams.set("documentId", booking.id);
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + session.idToken,
    },
    body: JSON.stringify({
      fields: {
        author: stringValue(author),
        rating: integerValue(input.rating),
        comment: stringValue(comment),
        serviceName: stringValue(booking.serviceName),
        language: stringValue(input.language),
        status: stringValue("pending"),
        createdAt: timestampValue(new Date().toISOString()),
      },
    }),
  });

  if (response.status === 409) throw new Error("A review already exists for this appointment.");
  if (!response.ok) throw new Error(await readError(response));
  return parseReview((await response.json()) as FirestoreDocument);
}

export async function listPublicReviews(): Promise<SpaReview[]> {
  const { projectId, apiKey } = await getFirebasePublicConfig();
  const endpoint =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(projectId) +
    "/databases/(default)/documents:runQuery?key=" +
    encodeURIComponent(apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "reviews" }],
        where: {
          fieldFilter: {
            field: { fieldPath: "status" },
            op: "EQUAL",
            value: { stringValue: "approved" },
          },
        },
        limit: 12,
      },
    }),
  });

  if (!response.ok) throw new Error(await readError(response));
  const rows = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return rows
    .filter((row) => Boolean(row.document?.name))
    .map((row) => parseReview(row.document as FirestoreDocument))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAdminReviews(session: AdminSession): Promise<SpaReview[]> {
  const { projectId, apiKey } = await getFirebasePublicConfig();
  const endpoint =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(projectId) +
    "/databases/(default)/documents:runQuery?key=" +
    encodeURIComponent(apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + session.idToken,
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "reviews" }],
        orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
      },
    }),
  });

  if (!response.ok) throw new Error(await readError(response));
  const rows = (await response.json()) as Array<{ document?: FirestoreDocument }>;
  return rows
    .filter((row) => Boolean(row.document?.name))
    .map((row) => parseReview(row.document as FirestoreDocument));
}

export async function moderateReview(
  session: AdminSession,
  review: SpaReview,
  status: "approved" | "rejected",
) {
  const { projectId, apiKey } = await getFirebasePublicConfig();
  const now = new Date().toISOString();
  const endpoint =
    "https://firestore.googleapis.com/v1/projects/" +
    encodeURIComponent(projectId) +
    "/databases/(default)/documents:commit?key=" +
    encodeURIComponent(apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: "Bearer " + session.idToken,
    },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: documentName(projectId, "reviews/" + review.id),
            fields: {
              status: stringValue(status),
              moderatedAt: timestampValue(now),
              moderatedBy: stringValue(session.email),
            },
          },
          updateMask: { fieldPaths: ["status", "moderatedAt", "moderatedBy"] },
          currentDocument: review.version ? { updateTime: review.version } : { exists: true },
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(await readError(response));
}
