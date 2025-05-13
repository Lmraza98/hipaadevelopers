import 'dotenv/config'
import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from "@/components/ui/toast";
import PlausibleProvider from 'next-plausible';
import "./globals.css";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'HIPAA Compliance Checklist',
  description: 'Get your comprehensive guide to HIPAA compliance. Perfect for healthcare providers and software developers.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlausibleProvider enabled={false} domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'hipaadevelopers.com'}>
      <html lang="en" suppressHydrationWarning>
        <head />
        {/* Geist font classes on <body> keep typography consistent */}
        <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          {/* Plausible analytics script with custom extensions */}
          <Script
            strategy="afterInteractive"
            data-domain="hipaadevelopers.com"
            src="https://plausible.io/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js"
            defer
          />
          <Script
            id="plausible-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html:
                "window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }",
            }}
          />
          {/* Google Analytics (ID provided via .env) */}
          <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID!} />
          {/* Vercel Analytics */}
          <Analytics />
          <Toaster />
        </body>
      </html>
    </PlausibleProvider>
  );
}
