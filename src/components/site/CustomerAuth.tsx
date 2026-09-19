import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  customerAuthError,
  loginCustomer,
  loginCustomerWithGoogle,
  logoutCustomer,
  registerCustomer,
  subscribeToCustomerAuth,
} from "@/lib/customer-auth";

export function CustomerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
    setSubmitting(true);
    try {
      if (mode === "register") await registerCustomer(email, password);
      else await loginCustomer(email, password);
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
    setSubmitting(true);
    try {
      await loginCustomerWithGoogle();
    } catch (authError) {
      setError(customerAuthError(authError));
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return (
      <section id="account" className="scroll-mt-24 border-y border-border bg-background py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">SPA NAZ ACCOUNT</p>
            <h2 className="mt-2 text-2xl">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
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
            Create an account or sign in with Google to make returning to SPA NAZ simple.
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
                }}
                className={`border-b-2 pb-3 text-sm font-medium ${mode === nextMode ? "border-primary text-foreground" : "border-transparent text-muted-foreground"}`}
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
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

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
        </div>
      </div>
    </section>
  );
}
