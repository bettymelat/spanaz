import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en, ro, type Copy } from "@/content/copy";

export type Lang = "ro" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Copy };

const LanguageContext = createContext<Ctx>({ lang: "ro", setLang: () => {}, t: ro });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ro");

  useEffect(() => {
    const stored = window.localStorage.getItem("spanaz-lang");
    if (stored === "en" || stored === "ro") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("spanaz-lang", l);
    document.documentElement.lang = l;
  }, []);

  const value = useMemo(() => ({ lang, setLang, t: lang === "en" ? en : ro }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useI18n = () => useContext(LanguageContext);
