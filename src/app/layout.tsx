import type { Metadata } from "next";

import { SkipLinks } from "@/components/ui/skip-link";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import { fontClassNames } from "@/config/fonts";
import { QueryProvider } from "@/state/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Kamran - Front End Engineer",
  description:
    "Front End Engineer specializing in creating beautiful and functional web experiences",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/favicon.svg",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontClassNames}>
      <body className="bg-black font-sans antialiased">
        {/* Skip links for keyboard navigation */}
        <SkipLinks />

        {/* Using font-sans from design tokens */}
        <QueryProvider>
          <WebVitalsReporter />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
