import 'dotenv/config'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
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
  title: "HIPAA Developer Resources __TITLE__ Tutorials",
  description: "Guides, code __DESCRIPTION__ best-practices for developers building HIPAA-compliant software.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Geist font classes on <body> keep typography consistent */}
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        {/* Google Analytics (ID provided via .env) */}
        <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
