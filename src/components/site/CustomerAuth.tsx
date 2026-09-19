import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { User } from "firebase/auth";
import {
  customerAuthError,
  loginCustomer,
  loginCustomerWithGoogle,
  logoutCustomer,
  registerCustomer,
  resendCustomerVerification,
  resetCustomerPassword,
  subscribeToCustomerAuth,
} from "@/lib/customer-auth";

const OWNER_ADMIN_EMAIL = "homespanaz@gmail.com";

function hasAdminPermission(user: User) {
  return user.email?.trim().toLowerCase() === OWNER_ADMIN_EMAIL && user.emailVerified;
}

export function CustomerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let active = true;
    void subscribeToCustomerAuth((nextUser) => {
      if (active) setUser(nextUser);
    })
      .then((cleanup) => {
        if (active) unsubscribe = cleanup;
        else cleanup();
      })
      .catch((authError) => {
        if (active) setError(customerAuthError(authError));
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const submit = async () => {
    if (submitting) return;
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      if (mode === "register") {
        await registerCustomer(email, password);
        setNotice("Account created. Check your email for the verification link.");
      } else {
        await loginCustomer(email, password);
      }
      setPassword("");
    } catch (authError) {
      setError(customerAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const googleSignIn = async () => {
    if (submitting) return;
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      await loginCustomerWithGoogle();
    } catch (authError) {
      setError(customerAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  const forgotPassword = async () => {
    setError("");
    setNotice("");
    try {
      await resetCustomerPassword(email);
      setNotice("Password reset email sent.");
    } catch (authError) {
      setError(customerAuthError(authError));
    }
  };

  if (user) {
    return (
      <section id="account" className="scroll-mt-24 border-y border-border bg-background py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">SPA NAZ ACCOUNT</p>
            <h2 className="mt-2 text-2xl">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
            {!user.emailVerified && (
              <div className="mt-3">
                <p className="text-sm text-amber-800">Verify your email to fully secure your account.</p>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setNotice("");
                    void resendCustomerVerification()
                      .then(() => setNotice("Verification email sent."))
                      .catch((authError) => setError(customerAuthError(authError)));
                  }}
                  className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Resend verification email
                </button>
              </div>
            )}
            {notice && <p className="mt-3 text-sm text-primary">{notice}</p>}
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/account"
                className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                My bookings
              </Link>
              {hasAdminPermission(user) && (
                <Link
                  to="/admin/bookings"
                  className="inline-flex rounded-full border border-primary px-5 py-3 text-sm font-medium text-primary"
                >
                  Open admin dashboard
                </Link>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => void logoutCustomer()}
            className="inline-flex rounded-full border border-border px-5 py-3 text-sm font-medium"
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="account" className="scroll-mt-24 border-y border-border bg-background py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="eyebrow">SPA NAZ ACCOUNT</p>
          <h2 className="mt-2 text-3xl">Keep your SPA NAZ details close</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Sign in before booking to keep your appointments together, track their status and cancel a pending or confirmed request from your account.
          </p>
        </div>

        <div className="surface-card p-5 sm:p-6">
          <div className="flex gap-5 border-b border-border">
            {(["login", "register"] as const).map((nextMode) => (
              <button
                key={nextMode}
                type="button"
                onClick={() => {
                  setMode(nextMode);
                  setError("");
                  setNotice("");
                }}
                className={`border-b-2 pb-3 text-sm font-medium ${
                  mode === nextMode
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {nextMode === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>

          <form
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-primary">{notice}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          {mode === "login" && (
            <button
              type="button"
              onClick={() => void forgotPassword()}
              className="mt-3 w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </button>
          )}

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={() => void googleSignIn()}
            disabled={submitting}
            className="w-full rounded-full border border-border px-5 py-3 text-sm font-medium disabled:opacity-50"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            By creating an account, you agree to the SPA NAZ terms and acknowledge the privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}
