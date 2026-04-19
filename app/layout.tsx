import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BillingPlatform — Payment allocations",
  description: "Allocate remittances to invoices (prototype)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
      <body
        className={`${geist.className} flex h-full min-h-0 flex-col overflow-hidden bg-[#FAF9F9] text-[#111827]`}
      >
        {children}
      </body>
    </html>
  );
}
