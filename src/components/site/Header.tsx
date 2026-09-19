import { Link } from "@tanstack/react-router";
import { Menu, X, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/content/business";
import { subscribeToCustomerAuth } from "@/lib/customer-auth";

const OWNER_ADMIN_EMAIL = "homespanaz@gmail.com";

const sections = [
  { id: "despre", key: "about" },
  { id: "servicii", key: "services" },
  { id: "preturi", key: "prices" },
  { id: "intrebari", key: "faq" },
  { id: "contact", key: "contact" },
] as const;

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

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
      .catch(() => undefined);

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const isOwner =
    user?.email?.trim().toLowerCase() === OWNER_ADMIN_EMAIL && user.emailVerified;
  const accountHref = user ? "/account" : "/#account";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="font-display text-xl tracking-[0.18em] text-foreground">SPA NAZ</span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 lg:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t.nav[s.key]}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center rounded-full border border-border bg-card p-0.5 sm:flex">
            {(["ro", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 text-xs uppercase tracking-widest transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {isOwner && (
            <Link
              to="/admin/bookings"
              className="hidden items-center gap-1.5 rounded-full border border-primary/30 px-3 py-2 text-xs font-medium text-primary md:inline-flex"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}

          <a
            href="/#rezervare"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 sm:inline-flex"
          >
            {t.cta.bookShort}
          </a>

          <a
            href={accountHref}
            aria-label={user ? "My account" : "Log in or create account"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <UserRound className="h-4.5 w-4.5" />
          </a>

          <button
            type="button"
            aria-label="Meniu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            <a
              href={accountHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b border-border/60 py-3.5 text-base font-medium text-foreground"
            >
              <UserRound className="h-4 w-4 text-primary" />
              {user ? (lang === "ro" ? "Contul meu" : "My account") : lang === "ro" ? "Autentificare / Cont" : "Login / Account"}
            </a>

            {isOwner && (
              <Link
                to="/admin/bookings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-border/60 py-3.5 text-base font-medium text-primary"
              >
                <ShieldCheck className="h-4 w-4" />
                {lang === "ro" ? "Panou administrare" : "Admin dashboard"}
              </Link>
            )}

            {sections.map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3.5 text-base text-foreground"
              >
                {t.nav[s.key]}
              </a>
            ))}

            <div className="flex items-center gap-3 py-4">
              <a
                href="/#rezervare"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
              >
                {t.cta.bookShort}
              </a>
              <a
                href={whatsappLink(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground"
                aria-label={t.cta.whatsapp}
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>

            <div className="flex items-center gap-2 pb-4">
              {(["ro", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest ${
                    lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
