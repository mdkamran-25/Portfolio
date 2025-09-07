export const techColors: Record<string, string> = {
  // Frontend Frameworks
  React: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "React 18": "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  "Next.js": "bg-gray-800/20 text-gray-300 border border-gray-600/30",
  "Vue.js": "bg-green-500/20 text-green-300 border border-green-500/30",

  // Languages
  TypeScript: "bg-blue-600/20 text-blue-300 border border-blue-600/30",
  JavaScript: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",

  // Build Tools
  Vite: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  Webpack: "bg-blue-400/20 text-blue-300 border border-blue-400/30",

  // Routing
  "React Router DOM": "bg-red-500/20 text-red-300 border border-red-500/30",

  // State Management
  "Redux Toolkit": "bg-purple-600/20 text-purple-300 border border-purple-600/30",
  "React Redux": "bg-purple-600/20 text-purple-300 border border-purple-600/30",

  // Styling
  "Tailwind CSS": "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
  CSS: "bg-blue-400/20 text-blue-300 border border-blue-400/30",
  PostCSS: "bg-orange-500/20 text-orange-300 border border-orange-500/30",

  // Icons & UI
  "Lucide React": "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",

  // Backend & Database
  "Node.js": "bg-green-600/20 text-green-300 border border-green-600/30",
  "Express.js": "bg-gray-600/20 text-gray-300 border border-gray-600/30",
  MongoDB: "bg-green-500/20 text-green-300 border border-green-500/30",
  Firebase: "bg-yellow-600/20 text-yellow-300 border border-yellow-600/30",

  // HTTP Client
  Axios: "bg-blue-500/20 text-blue-300 border border-blue-500/30",

  // Tools & Linting
  ESLint: "bg-purple-500/20 text-purple-300 border border-purple-500/30",

  // Animation & Effects
  "Particles.js": "bg-pink-500/20 text-pink-300 border border-pink-500/30",

  // SEO & Meta
  "React Helmet Async": "bg-orange-500/20 text-orange-300 border border-orange-500/30",

  // Deployment
  Netlify: "bg-teal-500/20 text-teal-300 border border-teal-500/30",
  Vercel: "bg-gray-800/20 text-gray-300 border border-gray-600/30",

  // Mobile
  "React Native": "bg-blue-500/20 text-blue-300 border border-blue-500/30",

  // Default fallback
  default: "bg-neutral-600/20 text-neutral-300 border border-neutral-600/30",
};

export const getTechColor = (tech: string): string => {
  return techColors[tech] || techColors.default;
};
