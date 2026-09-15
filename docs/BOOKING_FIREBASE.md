# SPA NAZ booking storage

The website stores appointment requests in a Firestore collection named `bookings`.

## 1. Create / select the Firebase project

Enable **Cloud Firestore** in the Firebase console. Production mode is fine because this repository provides explicit rules in `firestore.rules`.

## 2. Configure the website

Copy `.env.example` to your local environment configuration and provide the Firebase web values:

```bash
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_API_KEY=your-web-api-key
```

These are Firebase web identifiers, not administrator credentials. Never put a service-account private key in a `VITE_*` variable.

Configure the same variables in the Lovable/deployment environment used for production.

## 3. Deploy Firestore rules

The repository includes `firebase.json` and `firestore.rules`.

```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

The public website is allowed to **create** a validated booking request only. Public clients cannot list, read, edit, confirm, or delete bookings.

## 4. Booking document

A new document contains:

- customer name, phone and WhatsApp
- massage type
- session (`Relax`, `Restore`, or `Signature`)
- duration and price
- requested date and time
- Bucharest sector and address
- number of people
- optional message
- language
- status (`pending`)
- source (`website`)
- creation timestamp

The booking form only displays a success state after Firestore acknowledges the write.

## 5. Operations

For the first MVP, staff can manage requests from the Firebase console. A private staff dashboard should be the next booking-system milestone so SPA NAZ can move bookings through `pending`, `confirmed`, `completed`, and `cancelled` states without opening Firestore directly.

## 6. Recommended production hardening

Before paid acquisition or high traffic, add Firebase App Check or a server-side booking endpoint/rate limiter to reduce automated spam. Keep the Firestore rules in place even after adding server-side protections.
