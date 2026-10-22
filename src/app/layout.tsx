import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=JetBrains+Mono:ital,wght@0,400;0,600;0,800;1,400&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
