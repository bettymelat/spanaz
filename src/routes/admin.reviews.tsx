import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, RefreshCw, Star, XCircle } from "lucide-react";
import { getValidAdminSession, type AdminSession } from "@/lib/admin-auth";
import {
  listAdminReviews,
  moderateReview,
  type ReviewStatus,
  type SpaReview,
} from "@/lib/review-store";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({
    meta: [{ title: "SPA NAZ Reviews" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminReviews,
});

const statusLabel: Record<ReviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const statusClass: Record<ReviewStatus, string> = {
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-emerald-50 text-emerald-800",
  rejected: "bg-zinc-100 text-zinc-700",
};

function AdminReviews() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [reviews, setReviews] = useState<SpaReview[]>([]);
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const validSession = await getValidAdminSession();
      if (!validSession) {
        window.location.replace("/admin/login");
        return;
      }
      setSession(validSession);
      setReviews(await listAdminReviews(validSession));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const counts = useMemo(
    () => ({
      pending: reviews.filter((review) => review.status === "pending").length,
      approved: reviews.filter((review) => review.status === "approved").length,
      rejected: reviews.filter((review) => review.status === "rejected").length,
    }),
    [reviews],
  );

  const visible = reviews.filter((review) => filter === "all" || review.status === filter);

  const moderate = async (review: SpaReview, status: "approved" | "rejected") => {
    if (!session || busyId) return;
    setBusyId(review.id);
    setError("");
    try {
      await moderateReview(session, review, status);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update review.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <main className="min-h-screen bg-sand pb-16">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="eyebrow">SPA NAZ OWNER</p>
            <h1 className="mt-1 text-2xl">Customer reviews</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="/admin/bookings"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Bookings
            </a>
            <button
              type="button"
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => {
            const count = status === "all" ? reviews.length : counts[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                aria-pressed={filter === status}
                className={
                  "surface-card p-4 text-left ring-offset-2 " +
                  (filter === status ? "ring-2 ring-primary" : "")
                }
              >
                <p className="text-sm capitalize text-muted-foreground">{status}</p>
                <p className="mt-1 font-display text-3xl">{count}</p>
              </button>
            );
          })}
        </section>

        <div className="mt-5 rounded-2xl border border-gold/30 bg-card p-4 text-sm text-muted-foreground">
          Approve only genuine customer feedback you are comfortable publishing. Approved reviews
          become publicly readable on the SPA NAZ homepage. Rejected reviews stay private.
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-xl bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-8 surface-card p-10 text-center" role="status">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            <p className="mt-3 text-sm text-muted-foreground">Loading reviews…</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-8 surface-card p-10 text-center">
            <Star className="mx-auto h-7 w-7 text-gold" />
            <h2 className="mt-3 text-2xl">No reviews in this view</h2>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {visible.map((review) => (
              <article key={review.id} className="surface-card p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex gap-0.5 text-gold" aria-label={review.rating + " out of 5"}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={
                            "h-4 w-4 " + (index < review.rating ? "fill-current" : "opacity-25")
                          }
                        />
                      ))}
                    </div>
                    <h2 className="mt-3 text-2xl">{review.author}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{review.serviceName}</p>
                  </div>
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold " + statusClass[review.status]
                    }
                  >
                    {statusLabel[review.status]}
                  </span>
                </div>

                <blockquote className="mt-5 text-base leading-7">“{review.comment}”</blockquote>
                <p className="mt-4 text-xs text-muted-foreground">
                  Submitted {review.createdAt ? new Date(review.createdAt).toLocaleString("ro-RO") : "—"}
                </p>

                {review.status === "pending" && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void moderate(review, "approved")}
                      disabled={Boolean(busyId)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {busyId === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void moderate(review, "rejected")}
                      disabled={Boolean(busyId)}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-destructive/30 px-5 text-sm font-semibold text-destructive disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
