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
        <Script id="accessme-navigation-bridge" strategy="beforeInteractive">
          {`
            (function () {
              if (typeof window === 'undefined' || !window.fetch) return;

              var nativeFetch = window.fetch.bind(window);

              window.fetch = async function () {
                var response = await nativeFetch.apply(window, arguments);

                try {
                  var input = arguments[0];
                  var requestUrl = typeof input === 'string' ? input : (input && input.url) || '';

                  if (requestUrl.indexOf('/api/agent/intent') !== -1) {
                    var cloned = response.clone();
                    var data = await cloned.json();
                    var navigationUrl = data && (data.navigationUrl || (data.result && data.result.navigationUrl));

                    if (navigationUrl && window.location.pathname !== navigationUrl) {
                      setTimeout(function () {
                        window.location.assign(navigationUrl);
                      }, 250);
                    }
                  }
                } catch (error) {
                  // Keep the page working even if the bridge cannot parse the response.
                }

                return response;
              };
            })();
          `}
        </Script>
        <Script src="https://cdn.accessme.xyz/v1/agent.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
