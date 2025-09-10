/**
 * Technology-specific color mappings
 * Migrated from /src/constants/tech-text-color.ts
 */

import { tokens } from "./index";

type TechColorConfig = {
  bg: string;
  text: string;
  border: string;
};

export const techColors: Record<string, TechColorConfig> = {
  // Frontend Frameworks
  React: tokens.colors.tech.react,
  "React 18": tokens.colors.tech.react,
  "Next.js": tokens.colors.tech.nextjs,
  "Vue.js": {
    bg: "rgb(34 197 94 / 0.2)",
    text: "rgb(134 239 172)",
    border: "rgb(34 197 94 / 0.3)",
  },

  // Languages
  TypeScript: tokens.colors.tech.typescript,
  JavaScript: {
    bg: "rgb(234 179 8 / 0.2)",
    text: "rgb(254 240 138)",
    border: "rgb(234 179 8 / 0.3)",
  },

  // Build Tools
  Vite: {
    bg: "rgb(168 85 247 / 0.2)",
    text: "rgb(196 181 253)",
    border: "rgb(168 85 247 / 0.3)",
  },
  Webpack: {
    bg: "rgb(96 165 250 / 0.2)",
    text: "rgb(147 197 253)",
    border: "rgb(96 165 250 / 0.3)",
  },

  // Routing
  "React Router DOM": {
    bg: "rgb(239 68 68 / 0.2)",
    text: "rgb(252 165 165)",
    border: "rgb(239 68 68 / 0.3)",
  },

  // State Management
  "Redux Toolkit": {
    bg: "rgb(147 51 234 / 0.2)",
    text: "rgb(196 181 253)",
    border: "rgb(147 51 234 / 0.3)",
  },
  "React Redux": {
    bg: "rgb(147 51 234 / 0.2)",
    text: "rgb(196 181 253)",
    border: "rgb(147 51 234 / 0.3)",
  },

  // Styling
  "Tailwind CSS": tokens.colors.tech.tailwind,
  CSS: {
    bg: "rgb(96 165 250 / 0.2)",
    text: "rgb(147 197 253)",
    border: "rgb(96 165 250 / 0.3)",
  },
  PostCSS: {
    bg: "rgb(249 115 22 / 0.2)",
    text: "rgb(254 215 170)",
    border: "rgb(249 115 22 / 0.3)",
  },

  // Icons & UI
  "Lucide React": {
    bg: "rgb(99 102 241 / 0.2)",
    text: "rgb(165 180 252)",
    border: "rgb(99 102 241 / 0.3)",
  },

  // Backend & Database
  "Node.js": tokens.colors.tech.nodejs,
  "Express.js": {
    bg: "rgb(115 115 115 / 0.2)",
    text: "rgb(212 212 212)",
    border: "rgb(115 115 115 / 0.3)",
  },
  MongoDB: {
    bg: "rgb(34 197 94 / 0.2)",
    text: "rgb(134 239 172)",
    border: "rgb(34 197 94 / 0.3)",
  },
  Firebase: {
    bg: "rgb(217 119 6 / 0.2)",
    text: "rgb(254 215 170)",
    border: "rgb(217 119 6 / 0.3)",
  },

  // HTTP Client
  Axios: {
    bg: "rgb(59 130 246 / 0.2)",
    text: "rgb(147 197 253)",
    border: "rgb(59 130 246 / 0.3)",
  },

  // Tools & Linting
  ESLint: {
    bg: "rgb(168 85 247 / 0.2)",
    text: "rgb(196 181 253)",
    border: "rgb(168 85 247 / 0.3)",
  },

  // Animation & Effects
  "Particles.js": {
    bg: "rgb(236 72 153 / 0.2)",
    text: "rgb(251 207 232)",
    border: "rgb(236 72 153 / 0.3)",
  },

  // SEO & Meta
  "React Helmet Async": {
    bg: "rgb(249 115 22 / 0.2)",
    text: "rgb(254 215 170)",
    border: "rgb(249 115 22 / 0.3)",
  },

  // Deployment
  Netlify: {
    bg: "rgb(20 184 166 / 0.2)",
    text: "rgb(153 246 228)",
    border: "rgb(20 184 166 / 0.3)",
  },
  Vercel: {
    bg: "rgb(115 115 115 / 0.2)",
    text: "rgb(212 212 212)",
    border: "rgb(115 115 115 / 0.3)",
  },

  // Mobile
  "React Native": tokens.colors.tech.react,
} as const;

export const getTechColor = (tech: string): string => {
  const techConfig = techColors[tech];

  if (techConfig) {
    return `bg-[${techConfig.bg}] text-[${techConfig.text}] border border-[${techConfig.border}]`;
  }

  // Default fallback
  return `bg-neutral-600/20 text-neutral-300 border border-neutral-600/30`;
};

export const getTechColorConfig = (tech: string): TechColorConfig => {
  return (
    techColors[tech] || {
      bg: "rgb(115 115 115 / 0.2)",
      text: "rgb(212 212 212)",
      border: "rgb(115 115 115 / 0.3)",
    }
  );
};
