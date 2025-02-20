"use client";

import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import ClientCommons from "./ClientCommons";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";
import { usePathname } from 'next/navigation';
import ToasterProvider from "./providers/ToasterProvider";
import { NextFont } from 'next/dist/compiled/@next/font';

interface RootLayoutClientProps {
  children: React.ReactNode;
  poppins: NextFont;
}

export default function RootLayoutClient({ children, poppins }: RootLayoutClientProps) {
  const pathname = usePathname();
  const isCheckoutPage = pathname?.includes("/checkout");

  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <ClientCommons />
        <ToasterProvider />
        <div className="relative">
          {!isCheckoutPage && <SiteHeader />}
          {children}
          {!isCheckoutPage && (
            <>
              <FooterNav />
              <Footer />
            </>
          )}
        </div>
      </body>
    </html>
  );
}