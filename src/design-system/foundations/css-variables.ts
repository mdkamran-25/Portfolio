/**
 * CSS Variables Generation from Design Tokens
 * Generates CSS custom properties for theming support
 */

import tokensData from "../tokens/tokens.json";

// Type definitions for tokens
interface ColorScale {
  [key: string]: string;
}

interface DesignTokens {
  colors: {
    [key: string]: ColorScale;
  };
  spacing: {
    [key: string]: string;
  };
  borderRadius: {
    [key: string]: string;
  };
  typography: {
    fontFamily: {
      [key: string]: string[];
    };
    fontSize: {
      [key: string]: [string, { lineHeight: string }];
    };
    fontWeight: {
      [key: string]: string;
    };
  };
  shadows: {
    [key: string]: string;
  };
  zIndex: {
    [key: string]: string | number;
  };
}

const tokens = tokensData as unknown as DesignTokens;

export function generateCSSVariables() {
  const cssVars: Record<string, string> = {};

  // Generate color variables
  Object.entries(tokens.colors).forEach(([colorName, colorShades]) => {
    if (typeof colorShades === "object" && colorShades !== null) {
      Object.entries(colorShades).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value as string;
      });
    }
  });

  // Generate spacing variables
  Object.entries(tokens.spacing).forEach(([name, value]) => {
    cssVars[`--spacing-${name}`] = value as string;
  });

  // Generate border radius variables
  Object.entries(tokens.borderRadius).forEach(([name, value]) => {
    cssVars[`--radius-${name}`] = value as string;
  });

  // Generate typography variables
  Object.entries(tokens.typography.fontFamily).forEach(([name, value]) => {
    cssVars[`--font-${name}`] = Array.isArray(value) ? value.join(", ") : (value as string);
  });

  Object.entries(tokens.typography.fontSize).forEach(([name, value]) => {
    if (Array.isArray(value)) {
      cssVars[`--text-${name}`] = value[0];
      cssVars[`--text-${name}-line-height`] = value[1].lineHeight;
    }
  });

  Object.entries(tokens.typography.fontWeight).forEach(([name, value]) => {
    cssVars[`--font-weight-${name}`] = value as string;
  });

  // Generate shadow variables
  Object.entries(tokens.shadows).forEach(([name, value]) => {
    cssVars[`--shadow-${name}`] = value as string;
  });

  // Generate z-index variables
  Object.entries(tokens.zIndex).forEach(([name, value]) => {
    cssVars[`--z-${name}`] = value.toString();
  });

  return cssVars;
}

export function generateCSSString() {
  const variables = generateCSSVariables();

  const cssString = Object.entries(variables)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n");

  return `:root {
${cssString}
}

[data-theme="dark"] {
  /* Dark theme overrides can be added here */
  --color-neutral-50: #0a0a0a;
  --color-neutral-900: #fafafa;
  --color-neutral-800: #f5f5f5;
  --color-neutral-700: #e5e5e5;
  --color-neutral-600: #d4d4d8;
  --color-neutral-400: #71717a;
  --color-neutral-300: #52525b;
  --color-neutral-200: #404040;
  --color-neutral-100: #262626;
  --color-neutral-950: #fafafa;
}`;
}

// Export for use in Tailwind config
export const cssVariables = generateCSSVariables();
export { tokens };
