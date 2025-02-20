import { Poppins } from "next/font/google";
import SiteHeader from "./(client-components)/(Header)/SiteHeader";
import ClientCommons from "./ClientCommons";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/components/Footer";
import FooterNav from "@/components/FooterNav";
import { headers } from 'next/headers';
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
}: {
  children: React.ReactNode;
}) {
  // Use pathname directly for more reliable detection
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const isCheckoutPage = pathname.includes("/checkout");

  return (
    <html lang="en" className={poppins.className}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <ClientCommons />
        <div className="relative">
          {/* Mobile search bar space */}
          <div className="h-[60px] lg:hidden" aria-hidden="true" />
          
          {/* Header - completely hidden on checkout */}
          {!isCheckoutPage && <SiteHeader />}

          {/* Main content */}
          {children}

          {/* Footer - completely hidden on checkout */}
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
