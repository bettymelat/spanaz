import { MessageCircle, CalendarCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { whatsappLink } from "@/content/business";

export function StickyCta() {
  const { t, lang } = useI18n();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-3 py-2.5 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2.5 pb-[env(safe-area-inset-bottom)]">
        <a
          href="/#rezervare"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground"
        >
          <CalendarCheck className="h-4 w-4" />
          {t.cta.bookShort}
        </a>
        <a
          href={whatsappLink(lang)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3.5 text-sm font-medium text-whatsapp-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          {t.cta.whatsappShort}
        </a>
      </div>
    </div>
  );
}
