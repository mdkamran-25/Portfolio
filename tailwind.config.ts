import type { Config } from "tailwindcss";
import { tokens } from "./src/design-system/foundations/css-variables";

// Transform tokens for Tailwind
function transformTokensForTailwind() {
  const tailwindTokens: any = {};

  // Transform colors to use CSS variables
  tailwindTokens.colors = {};
  Object.entries(tokens.colors).forEach(([colorName, colorShades]) => {
    tailwindTokens.colors[colorName] = {};
    Object.entries(colorShades).forEach(([shade, _]) => {
      tailwindTokens.colors[colorName][shade] = `var(--color-${colorName}-${shade})`;
    });
  });

  // Transform spacing
  tailwindTokens.spacing = {};
  Object.entries(tokens.spacing).forEach(([name, _]) => {
    tailwindTokens.spacing[name] = `var(--spacing-${name})`;
  });

  // Transform border radius
  tailwindTokens.borderRadius = {};
  Object.entries(tokens.borderRadius).forEach(([name, _]) => {
    tailwindTokens.borderRadius[name] = `var(--radius-${name})`;
  });

  // Transform font family
  tailwindTokens.fontFamily = {};
  Object.entries(tokens.typography.fontFamily).forEach(([name, _]) => {
    tailwindTokens.fontFamily[name] = `var(--font-${name})`;
  });

  // Transform font size
  tailwindTokens.fontSize = {};
  Object.entries(tokens.typography.fontSize).forEach(([name, _]) => {
    tailwindTokens.fontSize[name] = [
      `var(--text-${name})`,
      { lineHeight: `var(--text-${name}-line-height)` },
    ];
  });

  // Transform font weight
  tailwindTokens.fontWeight = {};
  Object.entries(tokens.typography.fontWeight).forEach(([name, _]) => {
    tailwindTokens.fontWeight[name] = `var(--font-weight-${name})`;
  });

  // Transform box shadow
  tailwindTokens.boxShadow = {};
  Object.entries(tokens.shadows).forEach(([name, _]) => {
    tailwindTokens.boxShadow[name] = `var(--shadow-${name})`;
  });

  // Transform z-index
  tailwindTokens.zIndex = {};
  Object.entries(tokens.zIndex).forEach(([name, _]) => {
    tailwindTokens.zIndex[name] = `var(--z-${name})`;
  });

  return tailwindTokens;
}

const designTokens = transformTokensForTailwind();

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Design system tokens
      colors: {
        ...designTokens.colors,
        // Keep existing variables for backward compatibility
        background: "var(--background)",
        foreground: "var(--foreground)",
        bgGray: "var(--bggray)",
      },
      spacing: designTokens.spacing,
      borderRadius: designTokens.borderRadius,
      fontFamily: designTokens.fontFamily,
      fontSize: designTokens.fontSize,
      fontWeight: designTokens.fontWeight,
      boxShadow: designTokens.boxShadow,
      zIndex: designTokens.zIndex,
    },
  },
  plugins: [],
} satisfies Config;
