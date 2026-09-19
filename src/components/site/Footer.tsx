import { Facebook, Instagram, LockKeyhole, Music2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { BUSINESS } from "@/content/business";

export function Footer() {
  const { t } = useI18n();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/#despre", label: t.nav.about },
    { href: "/#servicii", label: t.nav.services },
    { href: "/#preturi", label: t.nav.prices },
    { href: "/#intrebari", label: t.nav.faq },
    { href: "/#rezervare", label: t.nav.book },
    { href: "/#contact", label: t.nav.contact },
  ];

  const socials = [
    { href: BUSINESS.social.instagram, label: "Instagram", Icon: Instagram },
    { href: BUSINESS.social.facebook, label: "Facebook", Icon: Facebook },
    { href: BUSINESS.social.tiktok, label: "TikTok", Icon: Music2 },
  ].filter((item) => item.href && item.href !== "#");

  return (
    <footer className="border-t border-border bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-[0.18em]">SPA NAZ</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t.footer.tagline}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {BUSINESS.city}, {BUSINESS.country}
          </p>
          <a href={`mailto:${BUSINESS.bookingEmail}`} className="mt-2 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline">
            {BUSINESS.bookingEmail}
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">{t.footer.linksTitle}</h3>
          <ul className="mt-4 space-y-2.5">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {socials.length > 0 && (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground">{t.footer.socialTitle}</h3>
              <div className="mt-4 flex gap-3">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </>
          )}
          <h3 className={`${socials.length > 0 ? "mt-8" : ""} text-sm font-semibold uppercase tracking-widest text-foreground`}>
            {t.footer.legalTitle}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>{t.footer.privacy}</li>
            <li>{t.footer.terms}</li>
            <li>{t.footer.cancellation}</li>
          </ul>
          <Link
            to="/admin/login"
            className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LockKeyhole className="h-3.5 w-3.5" />
            Owner login
          </Link>
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">{t.footer.rights}</div>
    </footer>
  );
}
