import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import type { CustomerBooking } from "@/lib/customer-booking-store";
import { getReviewForBooking, submitReview, type SpaReview } from "@/lib/review-store";

type Props = {
  booking: CustomerBooking;
  lang: "ro" | "en";
  initiallyOpen?: boolean;
};

export function ReviewForm({ booking, lang, initiallyOpen = false }: Props) {
  const text = (ro: string, en: string) => (lang === "ro" ? ro : en);
  const [existing, setExisting] = useState<SpaReview | null>(null);
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(initiallyOpen);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setChecking(true);
    void getReviewForBooking(booking.id)
      .then((review) => {
        if (active) setExisting(review);
      })
      .catch(() => {
        if (active) setError(text("Nu am putut verifica recenzia.", "Could not check review status."));
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [booking.id, lang]);

  if (checking) {
    return (
      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground" role="status">
        <Loader2 className="h-4 w-4 animate-spin" />
        {text("Verificăm recenzia…", "Checking review…")}
      </div>
    );
  }

  if (existing) {
    const label =
      existing.status === "approved"
        ? text("Recenzie publicată", "Review published")
        : existing.status === "rejected"
          ? text("Recenzie nepublicată", "Review not published")
          : text("Recenzie trimisă pentru aprobare", "Review submitted for approval");

    return (
      <div className="mt-5 rounded-2xl border border-border bg-background p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold">{label}</p>
          <div
            className="flex gap-0.5 text-gold"
            aria-label={text(
              `${existing.rating} din 5 stele`,
              `${existing.rating} out of 5 stars`,
            )}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={
                  "h-4 w-4 " + (index < existing.rating ? "fill-current" : "opacity-30")
                }
              />
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{existing.comment}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          {text(
            "Recenziile apar pe site numai după aprobarea SPA NAZ.",
            "Reviews appear on the website only after SPA NAZ approval.",
          )}
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
        }}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <Star className="h-4 w-4" />
        {text("Lasă o recenzie", "Leave a review")}
      </button>
    );
  }

  const submit = async () => {
    setError("");
    if (author.trim().length < 2) {
      setError(text("Introdu numele care va apărea public.", "Enter the name to display publicly."));
      return;
    }
    if (rating < 1) {
      setError(text("Alege între 1 și 5 stele.", "Choose between 1 and 5 stars."));
      return;
    }
    if (comment.trim().length < 10) {
      setError(
        text(
          "Scrie cel puțin 10 caractere despre experiența ta.",
          "Write at least 10 characters about your experience.",
        ),
      );
      return;
    }

    setSubmitting(true);
    try {
      const review = await submitReview(booking, { author, rating, comment, language: lang });
      setExisting(review);
      setOpen(false);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : text("Recenzia nu a putut fi trimisă.", "Could not submit the review."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-gold/30 bg-background p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">{text("RECENZIE VERIFICATĂ", "VERIFIED REVIEW")}</p>
          <h3 className="mt-2 text-2xl">
            {text("Cum a fost experiența ta?", "How was your experience?")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {text(
              "Recenzia este legată de această programare finalizată și va fi publicată numai după aprobare.",
              "This review is tied to this completed appointment and is published only after approval.",
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm underline"
          disabled={submitting}
        >
          {text("Închide", "Close")}
        </button>
      </div>

      <label className="mt-5 block text-sm font-medium">
        {text("Nume afișat public", "Public display name")}
        <input
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          maxLength={60}
          placeholder={text("Ex. Ana M.", "e.g. Ana M.")}
          className="mt-2 min-h-12 w-full rounded-xl border border-input bg-card px-4 outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </label>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium">{text("Evaluare", "Rating")}</legend>
        <div className="mt-2 flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            const active = value <= (hovered || rating);
            return (
              <button
                key={value}
                type="button"
                onMouseEnter={() => setHovered(value)}
                onMouseLeave={() => setHovered(0)}
                onFocus={() => setHovered(value)}
                onBlur={() => setHovered(0)}
                onClick={() => setRating(value)}
                aria-label={text(`${value} stele`, `${value} stars`)}
                aria-pressed={rating === value}
                className="rounded-lg p-1"
              >
                <Star className={"h-7 w-7 text-gold " + (active ? "fill-current" : "opacity-35")} />
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-5 block text-sm font-medium">
        {text("Recenzia ta", "Your review")}
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          maxLength={1200}
          placeholder={text(
            "Spune-ne ce ți-a plăcut și cum te-ai simțit după experiență.",
            "Tell us what you liked and how you felt after the experience.",
          )}
          className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </label>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{text("Minimum 10 caractere", "Minimum 10 characters")}</span>
        <span>{comment.length}/1200</span>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={submitting}
        className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {text("Trimite recenzia", "Submit review")}
      </button>
    </div>
  );
}
