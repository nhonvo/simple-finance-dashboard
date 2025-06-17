// NO 'use client' directive here. This is a Server Component.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Now this metadata export is valid because this is a Server Component.
export const metadata: Metadata = {
  title: "Financial Dashboard",
  description: "My Personal Financial Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 bg-gray-100`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}