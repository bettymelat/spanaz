import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function LegalShell({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {updated}
        </p>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground [&_h2]:text-2xl [&_h2]:font-normal [&_p]:mt-2 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
