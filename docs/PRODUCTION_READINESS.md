# SPA NAZ production readiness

This checklist is the release gate for spanaz.ro.

## Implemented in the application

### Customer booking
- Guest booking remains available.
- Signed-in bookings are linked to the Firebase user UID and email.
- Booking success is shown only after Firestore accepts the write.
- Customer-friendly references use the format `SN-YYMMDD-XXXX`.
- Booking requests begin as `pending` and are not presented as automatically confirmed.

### Customer account
- Email/password registration and login.
- Google login.
- Email verification.
- Password reset.
- `/account` booking history.
- Customers can read only bookings linked to their UID.
- Customers can cancel only their own `pending` or `confirmed` bookings.

Older guest bookings are intentionally not attached automatically to a later account because the old records do not contain a trusted Firebase UID.

### Owner operations
- Verified owner authentication.
- Pending / Confirmed / Completed / Cancelled views.
- Search.
- Confirm and reschedule.
- Private internal notes.
- Call and WhatsApp actions.
- Conflict warning.
- Automatic dashboard refresh every 60 seconds while visible.
- CSV booking export.
- Customer cancellation appears in the same owner dashboard.

### Legal and discovery
- `/privacy`
- `/terms`
- `/cancellation`
- booking consent links to the policies
- account creation links to terms/privacy
- absolute production canonical URL
- `/sitemap.xml`
- private `/admin` and `/account` routes excluded from crawlers

## Release procedure

### 1. Pull and install

```bash
git checkout main
git pull
bun install --frozen-lockfile
```

### 2. Validate locally

```bash
bun run typecheck
bun run build
```

### 3. Deploy Firestore rules

Customer booking history and customer cancellation will not work until the new rules are deployed.

```bash
firebase deploy --only firestore:rules --project <SPA_NAZ_FIREBASE_PROJECT_ID>
```

### 4. Firebase Authentication checks

In Firebase Console -> Authentication:

- Email/Password is enabled.
- Google is enabled if the Google button is shown.
- `spanaz.ro` is in Authorized domains.
- Add `www.spanaz.ro` as well if that hostname serves the site.
- The owner account email is verified.

### 5. Deploy Cloudflare

Use the normal SPA NAZ production deployment path.

Verify the production build contains the same public Firebase web configuration that works locally.

## Mandatory production acceptance test

Use at least two different customer accounts plus one incognito guest session.

### Account A

1. Register or sign in.
2. Verify the email flow.
3. Submit a booking while signed in.
4. Open `/account`.
5. Confirm the booking appears.
6. Confirm the reference, service, price, requested date/time and address are correct.

### Account B

1. Sign in with a different customer.
2. Open `/account`.
3. Confirm Account A's booking is not visible.
4. Create a booking and confirm only Account B can see it.

### Cancellation

1. Cancel an Account A pending booking from `/account`.
2. Confirm it becomes `cancelled`.
3. Open the owner dashboard and confirm the same booking is cancelled.
4. Confirm a completed booking cannot be cancelled by the customer.

### Guest booking

1. Use an incognito browser without signing in.
2. Submit a booking.
3. Confirm it succeeds.
4. Sign into a customer account.
5. Confirm the guest booking does not appear in that account.

### Owner workflow

1. Owner signs in.
2. New booking appears.
3. Confirm/reschedule it.
4. Test Call and WhatsApp.
5. Mark it completed.
6. Export CSV and verify the row contains the expected booking.

### Public pages

Verify:

- `/`
- `/privacy`
- `/terms`
- `/cancellation`
- `/sitemap.xml`
- `/robots.txt`

Verify `/admin/*` and `/account` are not intended for indexing.

## Business information that must be verified outside the code

Before treating the legal pages as final, confirm the exact legal operator information for the business.

If SPA NAZ operates through a registered company/PFA or another legal entity, update the public policy pages with the exact legal name and any business identifiers/contact address that must be disclosed for that operator.

Do not invent these details in source code.

## Operational follow-up

The owner dashboard is currently the source of truth for incoming booking requests.

A later production improvement can add transactional email/WhatsApp notifications when a booking is created or its status changes. That should be implemented through an authenticated server-side provider/webhook rather than exposing email-provider credentials in the browser.

## Data handling

The published privacy policy currently uses a 24-month normal operational retention period for booking records, subject to longer retention where a legal obligation or dispute requires it.

If the business chooses a different retention policy, update both the operational process and the public privacy policy together.
