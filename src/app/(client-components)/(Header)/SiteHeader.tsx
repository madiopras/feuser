"use client";

import React from "react";
import Header from "./Header";
import { useThemeMode } from "@/utils/useThemeMode";
import { usePathname } from "next/navigation";

const SiteHeader = () => {
  useThemeMode();
  const pathname = usePathname();
  
  // Cek apakah halaman checkout
  const isCheckoutPage = pathname?.startsWith("/checkout");

  return (
    <>
      <Header 
        className={`shadow-sm dark:border-b dark:border-neutral-700 ${
          isCheckoutPage ? 'hide-search-form' : ''
        }`} 
        navType="MainNav1" 
      />
    </>
  );
};

export default SiteHeader;
