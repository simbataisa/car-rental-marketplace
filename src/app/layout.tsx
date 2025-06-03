import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Rental Marketplace - Revolutionizing Car Rentals in Vietnam",
  description: "Discover the future of car rentals in Vietnam with our comprehensive marketplace. Connect with traditional dealers and automated self-service options powered by cutting-edge technology. 24/7 availability, instant booking, premium fleet.",
  keywords: ["car rental", "Vietnam", "marketplace", "automated rental", "self-service", "24/7 availability", "instant booking", "premium cars"],
  authors: [{ name: "Car Rental Marketplace" }],
  creator: "Car Rental Marketplace",
  publisher: "Car Rental Marketplace",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://car-rental-marketplace.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Car Rental Marketplace - Revolutionizing Car Rentals in Vietnam",
    description: "Discover the future of car rentals in Vietnam with our comprehensive marketplace. Connect with traditional dealers and automated self-service options powered by cutting-edge technology.",
    url: 'https://car-rental-marketplace.vercel.app',
    siteName: 'Car Rental Marketplace',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Car Rental Marketplace - Revolutionizing Car Rentals in Vietnam',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Car Rental Marketplace - Revolutionizing Car Rentals in Vietnam",
    description: "Discover the future of car rentals in Vietnam. 24/7 availability, instant booking, premium fleet.",
    images: ['/og-image.svg'],
    creator: '@carrentalvn',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
