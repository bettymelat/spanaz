import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, KeyRound, Loader2, LockKeyhole, Mail } from "lucide-react";
import {
  OWNER_ADMIN_EMAIL,
  getValidAdminSession,
  sendOwnerPasswordReset,
  signInOwner,
} from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "SPA NAZ Owner Login" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    void getValidAdminSession().then((session) => {
      if (session) window.location.replace("/admin/bookings");
    });
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      await signInOwner(OWNER_ADMIN_EMAIL, password);
      window.location.replace("/admin/bookings");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async () => {
    if (resetting) return;
    setError("");
    setNotice("");
    setResetting(true);
    try {
      await sendOwnerPasswordReset(OWNER_ADMIN_EMAIL);
      setNotice("Password reset email sent to the owner account.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Could not send reset email.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sand px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to SPA NAZ
        </a>

        <div className="surface-card mt-8 p-6 sm:p-8">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-clay">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <p className="eyebrow mt-5">SPA NAZ OWNER</p>
          <h1 className="mt-2 text-3xl">Booking dashboard</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Sign in with the verified owner account to review and manage customer bookings.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
                Owner email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  value={OWNER_ADMIN_EMAIL}
                  readOnly
                  className="w-full rounded-xl border border-input bg-muted/40 py-3 pl-11 pr-4 text-sm text-foreground outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-input bg-card py-3 pl-11 pr-4 text-base text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {notice && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || password.length < 8}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </button>
          </form>

          <button
            type="button"
            onClick={resetPassword}
            disabled={resetting}
            className="mt-4 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
          >
            {resetting ? "Sending reset email…" : "Forgot password?"}
          </button>

          <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            There is no public admin registration. The owner account is created with the repository setup script and must verify its email before dashboard access is allowed.
          </p>
        </div>
      </div>
    </main>
  );
}
