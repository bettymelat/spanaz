import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, ro, type Copy } from "@/content/copy";

export type Lang = "ro" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Copy };

const LanguageContext = createContext<Ctx>({ lang: "ro", setLang: () => {}, t: ro });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ro");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("spanaz-lang");
      if (stored === "en" || stored === "ro") setLangState(stored);
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem("spanaz-lang", l);
    } catch {
      /* Keep language usable without storage. */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: lang === "en" ? en : ro }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useI18n = () => useContext(LanguageContext);
