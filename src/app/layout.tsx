import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Covera — Tes assurances clarifiées",
  description: "Upload tes contrats d'assurance, comprends exactement ce qui est couvert et pose des questions à l'IA.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full antialiased bg-gray-50 font-sans">
        {children}
      </body>
    </html>
  );
}
