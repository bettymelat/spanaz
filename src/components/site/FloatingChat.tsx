import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/content/business";
import { useI18n } from "@/lib/i18n";

export function FloatingChat() {
  const { lang } = useI18n();

  return (
    <a
      href={whatsappLink(lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={lang === "ro" ? "Începe conversația pe WhatsApp" : "Start WhatsApp chat"}
      className="group fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-whatsapp-foreground shadow-lift transition-transform hover:-translate-y-0.5 sm:right-6 lg:bottom-6 lg:px-5"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm font-semibold lg:inline">
        {lang === "ro" ? "Începe conversația" : "Start chat"}
      </span>
    </a>
  );
}
