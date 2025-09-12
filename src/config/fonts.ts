/**
 * Font Configuration using next/font
 * Optimized font loading for better performance
 */

import { Inter, JetBrains_Mono } from "next/font/google";

// Configure Inter font
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

// Configure JetBrains Mono font for code
export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
  preload: true,
});

// Font class names for easy usage
export const fontClassNames = `${inter.variable} ${jetBrainsMono.variable}`;

// Export individual font class names
export const fontSans = inter.className;
export const fontMono = jetBrainsMono.className;
