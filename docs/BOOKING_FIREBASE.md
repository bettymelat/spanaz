# SPA NAZ booking storage

The website stores appointment requests in a Firestore collection named `bookings`.

## Fast setup

The repository includes an idempotent bootstrap script that can create or reuse the Firebase project, create the default Firestore database, register the SpaNaz Web App, deploy `firestore.rules`, and write the required web values to `.env.local`.

From the repository root:

```bash
bash scripts/setup-firebase.sh <firebase-project-id>
```

Example:

```bash
bash scripts/setup-firebase.sh spanaz-ro-prod
```

The default Firestore region is `europe-central2`. To choose another region, pass it as the second argument:

```bash
bash scripts/setup-firebase.sh spanaz-ro-prod europe-west3
```

The script intentionally asks for confirmation immediately before creating a new Firestore database because its location cannot be changed later. For a non-interactive run, set `ASSUME_YES=1`.

```bash
ASSUME_YES=1 bash scripts/setup-firebase.sh spanaz-ro-prod europe-central2
```

After the script completes, copy the two `VITE_FIREBASE_*` values from `.env.local` into the production/Lovable environment and redeploy the site.

## 1. Create / select the Firebase project

If you do not use the script, create or select a Firebase project manually and enable **Cloud Firestore**. Production mode is fine because this repository provides explicit rules in `firestore.rules`.

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
firebase deploy --only firestore:rules --project <your-project-id>
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
