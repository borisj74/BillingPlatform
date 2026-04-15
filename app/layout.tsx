import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body
        className={`${inter.className} flex h-full min-h-0 flex-col overflow-hidden bg-[#FAF9F9] text-[#111827]`}
      >
        {children}
      </body>
    </html>
  );
}
