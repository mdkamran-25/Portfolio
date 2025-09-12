/**
 * WCAG Color Contrast Audit Tool
 *
 * Analyzes color combinations for WCAG 2.1 AA compliance
 * AA Standards: 4.5:1 for normal text, 3:1 for large text
 */

// Hex to RGB conversion
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3]
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Calculate relative luminance
function relativeLuminance(r: number, g: number, b: number): number {
  const components = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  const [rs = 0, gs = 0, bs = 0] = components;
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function contrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  const lum1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Color compliance check
export function checkColorCompliance(
  foreground: string,
  background: string,
  isLargeText = false
): {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  level: "AAA" | "AA" | "FAIL";
} {
  const ratio = contrastRatio(foreground, background);
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;

  const aa = ratio >= aaThreshold;
  const aaa = ratio >= aaaThreshold;

  return {
    ratio: Math.round(ratio * 100) / 100,
    aa,
    aaa,
    level: aaa ? "AAA" : aa ? "AA" : "FAIL",
  };
}

// Current design system colors from the portfolio
export const DESIGN_COLORS = {
  // Background colors
  backgrounds: {
    black: "#000000",
    neutral900: "#171717", // bg-neutral-900
    neutral800: "#262626", // bg-neutral-800
    neutral700: "#404040", // bg-neutral-700
    neutral600: "#525252", // bg-neutral-600
    orange500_20: "rgba(249, 115, 22, 0.2)", // bg-orange-500/20
    neutral800_50: "rgba(38, 38, 38, 0.5)", // bg-neutral-800/50
    white: "#ffffff",
  },

  // Text colors
  text: {
    white: "#ffffff", // text-white
    neutral300: "#d4d4d4", // text-neutral-300
    neutral400: "#a3a3a3", // text-neutral-400
    neutral600: "#525252", // text-neutral-600
    orange500: "#f97316", // text-orange-500
    orange600: "#ea580c", // text-orange-600
    yellow400: "#facc15", // text-yellow-400
    red600: "#dc2626", // text-red-600
    blue600: "#2563eb", // text-blue-600
    gray600: "#4b5563", // text-gray-600
    gray500: "#6b7280", // text-gray-500
    gray300: "#d1d5db", // text-gray-300
    black: "#000000",
  },

  // Button and interactive colors
  interactive: {
    orange500: "#f97316", // bg-orange-500
    orange600: "#ea580c", // hover:bg-orange-600
    neutral800: "#262626", // bg-neutral-800
    neutral700: "#404040", // hover:bg-neutral-700
    blue600: "#2563eb", // bg-blue-600
    blue700: "#1d4ed8", // hover:bg-blue-700
  },
};

// Color combinations to audit
export const COLOR_COMBINATIONS = [
  // Main text combinations
  {
    name: "White text on black background",
    fg: DESIGN_COLORS.text.white,
    bg: DESIGN_COLORS.backgrounds.black,
    context: "Main headings",
  },
  {
    name: "White text on neutral-900",
    fg: DESIGN_COLORS.text.white,
    bg: DESIGN_COLORS.backgrounds.neutral900,
    context: "Content cards",
  },
  {
    name: "Neutral-300 text on neutral-900",
    fg: DESIGN_COLORS.text.neutral300,
    bg: DESIGN_COLORS.backgrounds.neutral900,
    context: "Body text",
  },
  {
    name: "Neutral-400 text on neutral-900",
    fg: DESIGN_COLORS.text.neutral400,
    bg: DESIGN_COLORS.backgrounds.neutral900,
    context: "Secondary text",
  },

  // Orange theme combinations (UPDATED - WCAG AA compliant)
  {
    name: "Orange-500 text on neutral-800",
    fg: DESIGN_COLORS.text.orange500,
    bg: DESIGN_COLORS.backgrounds.neutral800,
    context: "Action buttons",
  },
  {
    name: "Orange-600 text on white",
    fg: DESIGN_COLORS.text.orange600,
    bg: DESIGN_COLORS.backgrounds.white,
    context: "Payment dialog",
  },
  {
    name: "White text on orange-900",
    fg: DESIGN_COLORS.text.white,
    bg: "#7c2d12",
    context: "Primary buttons",
  },

  // Interactive elements
  {
    name: "White text on neutral-800",
    fg: DESIGN_COLORS.text.white,
    bg: DESIGN_COLORS.interactive.neutral800,
    context: "Secondary buttons",
  },
  {
    name: "Blue-600 text on white",
    fg: DESIGN_COLORS.text.blue600,
    bg: DESIGN_COLORS.backgrounds.white,
    context: "Links",
  },
  {
    name: "White text on blue-600",
    fg: DESIGN_COLORS.text.white,
    bg: DESIGN_COLORS.interactive.blue600,
    context: "Primary actions",
  },

  // Error states
  {
    name: "Red-600 text on white",
    fg: DESIGN_COLORS.text.red600,
    bg: DESIGN_COLORS.backgrounds.white,
    context: "Error messages",
  },

  // Rating stars (UPDATED - WCAG AA compliant)
  {
    name: "Yellow-400 on neutral-900",
    fg: DESIGN_COLORS.text.yellow400,
    bg: DESIGN_COLORS.backgrounds.neutral900,
    context: "Rating stars",
  },
  {
    name: "Neutral-400 on neutral-900",
    fg: DESIGN_COLORS.text.neutral400,
    bg: DESIGN_COLORS.backgrounds.neutral900,
    context: "Empty stars",
  },

  // Form elements
  {
    name: "Gray-600 text on white",
    fg: DESIGN_COLORS.text.gray600,
    bg: DESIGN_COLORS.backgrounds.white,
    context: "Form labels",
  },
  {
    name: "Gray-500 text on white",
    fg: DESIGN_COLORS.text.gray500,
    bg: DESIGN_COLORS.backgrounds.white,
    context: "Helper text",
  },
  {
    name: "Black text on white",
    fg: DESIGN_COLORS.text.black,
    bg: DESIGN_COLORS.backgrounds.white,
    context: "Form inputs",
  },
];

// Audit all color combinations
export function auditColorContrast(): {
  results: Array<{
    name: string;
    context: string;
    foreground: string;
    background: string;
    normal: ReturnType<typeof checkColorCompliance>;
    large: ReturnType<typeof checkColorCompliance>;
    status: "PASS" | "WARNING" | "FAIL";
  }>;
  summary: {
    total: number;
    passing: number;
    warning: number;
    failing: number;
  };
} {
  const results = COLOR_COMBINATIONS.map((combo) => {
    const normal = checkColorCompliance(combo.fg, combo.bg, false);
    const large = checkColorCompliance(combo.fg, combo.bg, true);

    let status: "PASS" | "WARNING" | "FAIL" = "FAIL";
    if (normal.aa && large.aa) {
      status = "PASS";
    } else if (large.aa) {
      status = "WARNING"; // Only passes for large text
    }

    return {
      name: combo.name,
      context: combo.context,
      foreground: combo.fg,
      background: combo.bg,
      normal,
      large,
      status,
    };
  });

  const summary = {
    total: results.length,
    passing: results.filter((r) => r.status === "PASS").length,
    warning: results.filter((r) => r.status === "WARNING").length,
    failing: results.filter((r) => r.status === "FAIL").length,
  };

  return { results, summary };
}

// Generate accessibility report
export function generateAccessibilityReport(): string {
  const audit = auditColorContrast();

  let report = `# WCAG 2.1 AA Color Contrast Audit Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total combinations tested:** ${audit.summary.total}\n`;
  report += `- **✅ Passing (AA compliant):** ${audit.summary.passing}\n`;
  report += `- **⚠️ Warning (large text only):** ${audit.summary.warning}\n`;
  report += `- **❌ Failing (non-compliant):** ${audit.summary.failing}\n\n`;

  const passRate = Math.round((audit.summary.passing / audit.summary.total) * 100);
  report += `**Overall compliance rate:** ${passRate}%\n\n`;

  report += `## WCAG 2.1 AA Standards\n\n`;
  report += `- **Normal text:** Minimum contrast ratio of 4.5:1\n`;
  report += `- **Large text (18pt+/14pt bold+):** Minimum contrast ratio of 3:1\n\n`;

  // Failing combinations
  const failing = audit.results.filter((r) => r.status === "FAIL");
  if (failing.length > 0) {
    report += `## ❌ Failing Combinations (Require Fixes)\n\n`;
    failing.forEach((result) => {
      report += `### ${result.name}\n`;
      report += `- **Context:** ${result.context}\n`;
      report += `- **Colors:** ${result.foreground} on ${result.background}\n`;
      report += `- **Normal text ratio:** ${result.normal.ratio}:1 (${result.normal.level})\n`;
      report += `- **Large text ratio:** ${result.large.ratio}:1 (${result.large.level})\n`;
      report += `- **Required:** 4.5:1 for normal text, 3:1 for large text\n\n`;
    });
  }

  // Warning combinations
  const warnings = audit.results.filter((r) => r.status === "WARNING");
  if (warnings.length > 0) {
    report += `## ⚠️ Warning Combinations (Large Text Only)\n\n`;
    warnings.forEach((result) => {
      report += `### ${result.name}\n`;
      report += `- **Context:** ${result.context}\n`;
      report += `- **Colors:** ${result.foreground} on ${result.background}\n`;
      report += `- **Normal text ratio:** ${result.normal.ratio}:1 (${result.normal.level})\n`;
      report += `- **Large text ratio:** ${result.large.ratio}:1 (${result.large.level})\n`;
      report += `- **Recommendation:** Use only for large text (18pt+ or 14pt bold+)\n\n`;
    });
  }

  // Passing combinations
  const passing = audit.results.filter((r) => r.status === "PASS");
  if (passing.length > 0) {
    report += `## ✅ Passing Combinations (WCAG AA Compliant)\n\n`;
    passing.forEach((result) => {
      report += `### ${result.name}\n`;
      report += `- **Context:** ${result.context}\n`;
      report += `- **Colors:** ${result.foreground} on ${result.background}\n`;
      report += `- **Normal text ratio:** ${result.normal.ratio}:1 (${result.normal.level})\n`;
      report += `- **Large text ratio:** ${result.large.ratio}:1 (${result.large.level})\n\n`;
    });
  }

  report += `## Recommendations\n\n`;
  if (failing.length > 0) {
    report += `### Immediate Actions Required\n\n`;
    report += `1. **Review failing combinations** and consider:\n`;
    report += `   - Darkening light colors or lightening dark colors\n`;
    report += `   - Using alternative color combinations from the passing list\n`;
    report += `   - Adding background colors or borders to improve contrast\n\n`;
  }

  if (warnings.length > 0) {
    report += `### Best Practices\n\n`;
    report += `1. **For warning combinations:** Ensure they're only used for large text\n`;
    report += `2. **Consider alternative colors** for better accessibility\n`;
    report += `3. **Test with actual users** who have visual impairments\n\n`;
  }

  report += `### General Recommendations\n\n`;
  report += `1. **Use high contrast mode testing** to verify readability\n`;
  report += `2. **Test with screen readers** to ensure compatibility\n`;
  report += `3. **Consider color blindness** - don't rely solely on color for information\n`;
  report += `4. **Provide focus indicators** with sufficient contrast\n`;
  report += `5. **Regular audits** as the design system evolves\n\n`;

  return report;
}

// Export audit function for immediate use
export { auditColorContrast as default };
