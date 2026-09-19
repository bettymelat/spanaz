# SPA NAZ owner booking dashboard

SPA NAZ now has a private owner workflow for customer booking requests.

## Owner dashboard

Production URL:

```
https://spanaz.ro/admin/login
```

After login, the owner can:

- view the newest booking requests
- filter Pending / Confirmed / Completed / Cancelled
- search by booking reference, customer name, phone, treatment, sector or address
- see customer phone and WhatsApp details
- call the customer directly
- open a prefilled WhatsApp conversation
- confirm a requested appointment
- change the confirmed date/time
- add a private internal note
- mark an appointment completed
- cancel an appointment without deleting its history
- refresh the booking list

The owner can also sign in from the **Account** section on the homepage. When
the signed-in Firebase user is the verified `homespanaz@gmail.com` account, the
homepage shows **Open admin dashboard**. The dashboard reuses that Firebase
session and does not grant admin access to other customer accounts.

The dashboard warns before confirming a time that overlaps another confirmed booking. The overlap check uses the treatment duration plus a 30-minute buffer.

## Security model

Public visitors can create a validated booking request, but they cannot list, read, edit or delete booking documents.

Owner access requires all three:

1. Firebase Authentication session
2. verified email address
3. exact authorized email: `homespanaz@gmail.com`

There is no public admin registration.

Firestore permits the owner to update only workflow fields:

- `status`
- `confirmedDate`
- `confirmedTime`
- `internalNote`
- `updatedAt`
- `updatedBy`

Customer-submitted booking information is immutable from the dashboard.

Bookings are never deleted by normal dashboard operations. Cancellation preserves the record with `status = cancelled`.

## One-time setup

### 1. Complete Firebase / Firestore setup

From the repository root:

```bash
bash scripts/setup-firebase.sh
```

This creates or reuses the Firebase project, configures Firestore, deploys `firestore.rules`, and creates a verified local `.env.local` file containing the Firebase web project ID and API key.

### 2. Enable Email/Password Authentication

In Firebase Console:

1. Open the SPA NAZ Firebase project.
2. Go to **Authentication**.
3. Open **Sign-in method**.
4. Enable **Email/Password**.
5. Save.

Do not add a public signup page to the website.

### 3. Create the owner account

In Firebase Console:

1. Go to **Authentication -> Users**.
2. Select **Add user**.
3. Email: `homespanaz@gmail.com`
4. Choose a strong unique password.
5. Create the user.

The password should not be stored in the repository, source code, Cloudflare variables or documentation.

### 4. Verify the owner email

Open:

```
https://spanaz.ro/admin/login
```

Sign in once with the owner credentials.

If the Firebase user is not email-verified, the login flow requests a verification email and refuses dashboard access. Open the verification email, verify the address, then sign in again.

### 5. Deploy production

From the repository root:

```bash
npm run build
bash scripts/deploy-cloudflare.sh --yes
```

The production build must use the same `VITE_FIREBASE_PROJECT_ID` and `VITE_FIREBASE_API_KEY` values created by `scripts/setup-firebase.sh`.

## Password recovery

The owner login page includes **Forgot password?**.

It sends a Firebase password-reset email only for the configured owner address.

## Booking lifecycle

Public bookings start as:

```
pending
```

Expected workflow:

```
pending -> confirmed -> completed
pending -> cancelled
confirmed -> cancelled
```

A confirmed booking can also have an adjusted date/time.

## Booking references

New bookings receive a readable reference, for example:

```
SN-260919-K7M4
```

The customer sees this only after Firestore successfully stores the request.

Older bookings that were created before references existed remain readable in the dashboard; a safe fallback reference is generated from their Firestore document ID.

## Owner actions

### Confirm

The requested date/time is prefilled. The owner can change it before confirming.

The dashboard checks confirmed bookings for a time overlap. If it finds one, it warns before allowing an override.

### Reschedule

Change the confirmed date/time and select **Save schedule / note**.

### Internal note

Internal notes are private. They are not shown on the public booking form.

### Complete

A confirmed appointment can be marked `completed`.

### Cancel

Pending or confirmed bookings can be marked `cancelled`.

The document is retained for operational history.

## Changing the owner email

The MVP deliberately uses one explicit owner identity.

To change the owner email, update it consistently in:

- `src/lib/admin-auth.ts`
- `firestore.rules`

Then redeploy Firestore rules and the website.

For a future multi-staff dashboard, replace the single email rule with Firebase custom claims or a server-managed role model.

## Production acceptance test

Before using the system with real customers:

1. Deploy the latest site and Firestore rules.
2. Open the public website in a private/incognito window.
3. Submit a test booking.
4. Confirm the customer gets an `SN-...` reference.
5. Verify the request appears in Firestore with `status = pending`.
6. Sign in from the homepage Account section as the verified owner, then open the admin dashboard.
7. Confirm the test booking appears under Pending.
8. Test Call and WhatsApp.
9. Change date/time and save.
10. Confirm the booking.
11. Verify it moves to Confirmed.
12. Create an overlapping test booking and verify the dashboard warns before confirming it.
13. Mark the first booking Completed.
14. Cancel the second booking.
15. Log out.
16. Open `/admin/bookings` directly and verify it returns to login.
17. Verify an unauthenticated Firestore request cannot list bookings.

Only after this complete flow passes should online booking be considered production-ready.
