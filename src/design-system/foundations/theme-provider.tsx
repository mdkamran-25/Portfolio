/**
 * Design System Foundation - Theme Provider
 * Provides theme context and CSS variables to the entire application
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig } from "@/types";
import { tokens } from "@/design-system/tokens";

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Partial<ThemeConfig>;
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>({
    mode: "light",
    primaryColor: tokens.colors.primary[500],
    fontFamily: tokens.typography.fontFamily.sans.join(", "),
    ...defaultTheme,
  });

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;

    // Set theme mode class
    root.classList.remove("light", "dark");
    if (theme.mode === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme.mode);
    }

    // Set CSS custom properties
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--font-family-sans", theme.fontFamily);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(mediaQuery.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    return undefined;
  }, [theme.mode]);

  // Persist theme to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("theme", JSON.stringify(theme));
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setThemeState((prev) => ({ ...prev, ...parsedTheme }));
      }
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
    }
  }, []);

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState((prev) => ({ ...prev, ...newTheme }));
  };

  const toggleMode = () => {
    setTheme({
      mode: theme.mode === "light" ? "dark" : "light",
    });
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Theme toggle component for easy theme switching
 */
export function ThemeToggle() {
  const { theme, toggleMode } = useTheme();

  return (
    <button
      onClick={toggleMode}
      className="rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label={`Switch to ${theme.mode === "light" ? "dark" : "light"} mode`}
    >
      {theme.mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}
