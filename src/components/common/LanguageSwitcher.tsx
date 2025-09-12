/**
 * Language Switcher Component
 *
 * A dropdown component for switching between different languages
 * Follows the design system patterns for accessibility and styling
 */
"use client";

import { useLocale } from "next-intl";
import React, { useState } from "react";

import { locales, localeLabels, localeFlags, type Locale } from "../../config/i18n";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = "" }) => {
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (locale: Locale) => {
    // In a real implementation, this would trigger locale change
    // For now, we'll just log it to demonstrate the structure
    console.log("Changing locale to:", locale);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <span>{localeFlags[currentLocale]}</span>
        <span>{localeLabels[currentLocale]}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <ul role="listbox" className="py-1">
            {locales.map((locale) => (
              <li key={locale}>
                <button
                  type="button"
                  onClick={() => handleLocaleChange(locale)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none ${
                    locale === currentLocale ? "bg-orange-50 text-orange-900" : "text-gray-700"
                  }`}
                  role="option"
                  aria-selected={locale === currentLocale}
                >
                  <span>{localeFlags[locale]}</span>
                  <span>{localeLabels[locale]}</span>
                  {locale === currentLocale && (
                    <svg
                      className="ml-auto h-4 w-4 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
