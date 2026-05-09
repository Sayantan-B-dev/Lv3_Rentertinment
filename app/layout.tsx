import type { Metadata } from "next";
import { Playfair_Display, Outfit } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "TaranumTalent | Book India's Top Artists",
    template: "%s | TaranumTalent",
  },
  description: "Discover and book from 20,000+ premium artists across India including Bollywood singers, comedians, DJs, and live bands for your next event.",
  keywords: ["artist booking", "book singers", "live bands", "bollywood artists", "event entertainment india"],
  authors: [{ name: "TaranumTalent" }],
  creator: "TaranumTalent",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://taranumtalent.com",
    title: "TaranumTalent | Book India's Top Artists",
    description: "Discover and book from 20,000+ premium artists across India.",
    siteName: "TaranumTalent",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaranumTalent | Book India's Top Artists",
    description: "Discover and book from 20,000+ premium artists across India.",
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
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
