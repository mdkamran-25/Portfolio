import type { Metadata } from "next";
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
    <html lang="en">
      <body className="bg-black antialiased">
        {children}
      </body>
    </html>
  );
}
