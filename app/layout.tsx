import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AuthProvider from "@/components/auth/AuthProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Book India's Top Artists`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `Discover and book from premium artists across India including Bollywood singers, comedians, DJs, and live bands for your next event.`,
  keywords: ["artist booking", "book singers", "live bands", "bollywood artists", "event entertainment india"],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} | Book India's Top Artists`,
    description: `Discover and book from premium artists across India.`,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Book India's Top Artists`,
    description: `Discover and book from premium artists across India.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${playfair.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollReveal />
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
