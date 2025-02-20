"use client";

import ClientCommons from "./ClientCommons";
import ToasterProvider from "./providers/ToasterProvider";
import { usePathname } from 'next/navigation';
import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import FooterNav from "@/components/FooterNav";
import Footer from "@/components/Footer";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCheckoutPage = pathname?.includes("/checkout");

  return (
    <>
      <ToasterProvider />
      <ClientCommons />
      <div className="relative h-full min-h-screen flex flex-col">
        {!isCheckoutPage && <SiteHeader />}
        <main className="flex-grow">
          {children}
        </main>
        {!isCheckoutPage && (
          <>
            <FooterNav />
            <Footer />
          </>
        )}
      </div>
    </>
  );
}