import { useEffect, useMemo, useState } from "react";
import type { CustomerBooking } from "@/lib/customer-booking-store";
import { getReviewForBooking } from "@/lib/review-store";
import { ReviewForm } from "@/components/account/ReviewForm";

type Props = {
  bookings: CustomerBooking[];
  lang: "ro" | "en";
};

export function PendingReviewPrompt({ bookings, lang }: Props) {
  const text = (ro: string, en: string) => (lang === "ro" ? ro : en);
  const completed = useMemo(
    () =>
      bookings
        .filter((booking) => booking.status === "completed")
        .sort((a, b) =>
          (
            (b.confirmedDate || b.appointmentDate) +
            (b.confirmedTime || b.appointmentTime)
          ).localeCompare(
            (a.confirmedDate || a.appointmentDate) +
              (a.confirmedTime || a.appointmentTime),
          ),
        ),
    [bookings],
  );
  const [candidate, setCandidate] = useState<CustomerBooking | null>(null);

  useEffect(() => {
    let active = true;

    const findUnreviewed = async () => {
      for (const booking of completed) {
        try {
          const existing = await getReviewForBooking(booking.id);
          if (!existing) {
            if (active) setCandidate(booking);
            return;
          }
        } catch {
          // Keep checking other completed bookings if one review lookup fails.
        }
      }
      if (active) setCandidate(null);
    };

    void findUnreviewed();
    return () => {
      active = false;
    };
  }, [completed]);

  if (!candidate) return null;

  return (
    <section className="mt-6 rounded-[1.75rem] border border-gold/35 bg-card p-5 shadow-soft sm:p-7">
      <p className="eyebrow">{text("SPUNE-NE CUM A FOST", "TELL US HOW IT WAS")}</p>
      <h2 className="mt-2 text-3xl">
        {text("Cum a fost experiența ta SPA NAZ?", "How was your SPA NAZ experience?")}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {text(
          `Programarea ${candidate.reference} a fost finalizată. Ne-ar ajuta mult să ne lași o recenzie.`,
          `Your appointment ${candidate.reference} is completed. We would really appreciate your review.`,
        )}
      </p>
      <ReviewForm booking={candidate} lang={lang} initiallyOpen />
    </section>
  );
}
