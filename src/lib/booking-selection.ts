export type BookingSelection = { service?: string; session?: string };
export function selectBooking(selection: BookingSelection) {
  window.dispatchEvent(
    new CustomEvent<BookingSelection>("spanaz:booking-selection", { detail: selection }),
  );
}
