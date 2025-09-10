/**
 * Design Tokens
 * Central source of truth for design values
 */

export const tokens = {
  colors: {
    // Primary brand colors
    primary: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316", // Main orange
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
      950: "#431407",
    },

    // Neutral colors
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },

    // Semantic colors
    success: {
      50: "#f0fdf4",
      500: "#10b981",
      600: "#059669",
      900: "#064e3b",
    },

    error: {
      50: "#fef2f2",
      500: "#ef4444",
      600: "#dc2626",
      900: "#7f1d1d",
    },

    warning: {
      50: "#fffbeb",
      500: "#f59e0b",
      600: "#d97706",
      900: "#78350f",
    },

    // Tech stack specific colors
    tech: {
      react: {
        bg: "rgb(59 130 246 / 0.2)",
        text: "rgb(147 197 253)",
        border: "rgb(59 130 246 / 0.3)",
      },
      typescript: {
        bg: "rgb(37 99 235 / 0.2)",
        text: "rgb(147 197 253)",
        border: "rgb(37 99 235 / 0.3)",
      },
      nextjs: {
        bg: "rgb(115 115 115 / 0.2)",
        text: "rgb(212 212 212)",
        border: "rgb(115 115 115 / 0.3)",
      },
      tailwind: {
        bg: "rgb(6 182 212 / 0.2)",
        text: "rgb(103 232 249)",
        border: "rgb(6 182 212 / 0.3)",
      },
      nodejs: {
        bg: "rgb(34 197 94 / 0.2)",
        text: "rgb(134 239 172)",
        border: "rgb(34 197 94 / 0.3)",
      },
    },
  },

  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
  },

  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    base: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Menlo", "Monaco", "monospace"],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
      sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
      base: ["1rem", { lineHeight: "1.5rem" }], // 16px
      lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
      xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
      "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
      "5xl": ["3rem", { lineHeight: "1" }], // 48px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export type Tokens = typeof tokens;

// Type-safe token access helpers
export const getColor = (path: string) => {
  const keys = path.split(".");
  let value: unknown = tokens.colors;

  for (const key of keys) {
    if (typeof value === "object" && value !== null && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      console.warn(`Color token not found: ${path}`);
      return tokens.colors.neutral[500];
    }
  }

  return value as string;
};

export const getSpacing = (key: keyof typeof tokens.spacing) => {
  return tokens.spacing[key];
};

export const getBorderRadius = (key: keyof typeof tokens.borderRadius) => {
  return tokens.borderRadius[key];
};
