import { Header } from "@/app/_components/layout/Header";
import { Footer } from "@/app/_components/layout/Footer";
import { LanguageProvider } from "@/app/_context/LanguageContext";
import { SITE_CONFIG } from "@/app/_constants/site";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: "Lombok Travel Organizer | Tours, Airport Transfer & Luxury Property",
  description:
    "Plan your Lombok holiday with curated tours, airport transfers, private drivers, and verified villas and land in South Lombok.",
  keywords: [
    "Lombok travel",
    "Lombok tour packages",
    "Lombok airport transfer",
    "Lombok villa investment",
    "South Lombok property",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Lombok Travel Organizer",
    title: "Lombok Travel Organizer | Tours, Transfers & Properties",
    description:
      "Book memorable Lombok experiences, reliable airport transfers, and explore verified property opportunities in South Lombok.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lombok Travel Organizer | Tours, Transfers & Properties",
    description:
      "Curated Lombok tours, airport transfers, private drivers, and verified property opportunities.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#F7FCFF] text-[#0C4A6E]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: SITE_CONFIG.name,
              url: SITE_CONFIG.url,
              description: SITE_CONFIG.description,
              areaServed: {
                "@type": "Place",
                name: "Lombok, West Nusa Tenggara, Indonesia",
              },
              serviceType: [
                "Lombok tour packages",
                "Airport transfers",
                "Private driver service",
                "Scooter & car rentals",
                "Lombok property consultation",
              ],
              sameAs: [
                SITE_CONFIG.socials.instagram,
                SITE_CONFIG.socials.tiktok,
              ],
            }),
          }}
        />
        <LanguageProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
