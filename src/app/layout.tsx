import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Toaster } from 'react-hot-toast';
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TMTC Travel Planner - Explore Cities Around the World",
  description: "Discover cities, check weather, explore places of interest, and plan your next adventure with TMTC Travel Planner.",
  keywords: "travel, cities, weather, places, tourism, planning",
  authors: [{ name: 'TMTC Travel Team' }],
  creator: "TMTC Travel",
  publisher: "TMTC Travel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: 'en_US',
    title: 'TMTC Travel Planner - Explore Cities Around the World',
    description: 'Discover cities, check weather, explore places of interest, and plan your next adventure.',
    siteName: 'TMTC Travel Planner',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TMTC Travel Planner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TMTC Travel Planner - Explore Cities Around the World',
    description: 'Discover cities, check weather, explore places of interest, and plan your next adventure.',
    images: ['/og-image.jpg'],
    creator: '',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        {/* <link rel="manifest" href="/manifest.json" /> */}

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TMTC Travel Team" />
        <meta name="keywords" content="travel, cities, weather, places, tourism, planning" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="TMTC Travel Planner" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="" />

        {/* Performance Optimizations */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TMTC Travel" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "TMTC Travel Planner",
              "description": "Discover cities, check weather, explore places of interest, and plan your next adventure.",
              "url": "https://yourdomain.com",
              "applicationCategory": "TravelApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />

        {/* Canonical URL for SEO */}
        <link rel="canonical" href={`https://tmtc.com${typeof window !== 'undefined' ? window.location.pathname : ''}`} />
      </head>
      <body className="bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white min-h-screen">
        <Providers>
          <Navigation />
          <div className="min-h-screen">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}