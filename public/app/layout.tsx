import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marketplace.country"),
  title: {
    default: "Axodus Marketplace — Digital Distribution Infrastructure",
    template: "%s | Axodus Marketplace",
  },
  description:
    "Marketplace infrastructure for digital products, AI services, enterprise solutions and ecosystem capabilities. Follow the Axodus Marketplace live development.",
  keywords: [
    "Axodus Marketplace",
    "digital distribution infrastructure",
    "AI services marketplace",
    "enterprise marketplace",
    "ACS",
    "digital products",
    "tenant marketplace",
  ],
  openGraph: {
    title: "Axodus Marketplace — Build, Distribute and Scale",
    description:
      "The digital distribution infrastructure for products, AI services, enterprise solutions and the Axodus ecosystem.",
    type: "website",
    siteName: "Axodus Marketplace",
    url: "https://marketplace.country",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axodus Marketplace — Digital Distribution Infrastructure",
    description:
      "Follow the live development of the Axodus ecosystem distribution layer.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "theme-color": "#060809",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
