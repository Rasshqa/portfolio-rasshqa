import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rashqa Andrean Fitrah Sulaeman — Full Stack Developer",
  description: "Portfolio of Rashqa Andrean Fitrah Sulaeman - Full Stack Developer specializing in Next.js, Laravel, Golang, Vue JS, Python, and cloud systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${jetbrainsMono.variable} ${caveat.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
