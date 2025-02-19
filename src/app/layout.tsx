import { Poppins } from "next/font/google";
import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import ClientCommons from "./ClientCommons";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sumatra Bus', // Judul halaman
  description: 'Web aplikasi pemesanan tiket bus', // Deskripsi halaman
  icons: {
    icon: '/favicon.ico', // Favicon standar
    apple: '/apple-touch-icon.png', // Icon untuk perangkat Apple
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  // Deteksi path checkout
  const isCheckoutPage = params?.segments?.[0] === "checkout";

  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200" style={{ isolation: 'isolate' }}>
        <div className="relative" style={{ isolation: 'isolate' }}>
          {/* Mobile search bar space */}
          <div className="h-[60px] lg:hidden" aria-hidden="true" />
          
          {/* Header */}
          <div className={`${isCheckoutPage ? 'hidden lg:block' : ''}`}>
            <SiteHeader />
          </div>

          {/* Main content */}
          {children}

          {/* Footer */}
          <div className={`${isCheckoutPage ? 'hidden lg:block' : ''}`}>
            <FooterNav />
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
