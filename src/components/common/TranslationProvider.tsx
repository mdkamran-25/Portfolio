/**
 * Translation Provider
 *
 * A React context provider for accessing translations
 * Uses next-intl for internationalization support
 */
"use client";

import React, { createContext, useContext } from "react";
import { useTranslations } from "next-intl";

interface TranslationContextType {
  t: ReturnType<typeof useTranslations>;
  nav: ReturnType<typeof useTranslations>;
  hero: ReturnType<typeof useTranslations>;
  common: ReturnType<typeof useTranslations>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const t = useTranslations();
  const nav = useTranslations("nav");
  const hero = useTranslations("hero");
  const common = useTranslations("common");

  const value = {
    t,
    nav,
    hero,
    common,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within a TranslationProvider");
  }
  return context;
};
