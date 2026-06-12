import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easy Approval - India's Leading Corporate Services & Compliance Platform",
  description: "Complete business registration, GST, Income Tax, MCA compliance, and trademark services. AI-powered platform with expert CA support.",
  keywords: "company registration, GST filing, income tax, trademark, MCA compliance, business registration India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Script src="https://cdn.accessme.xyz/v1/agent.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
