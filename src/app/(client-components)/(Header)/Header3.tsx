"use client";

import React, { FC, useEffect, useState } from "react";
import Logo from "@/shared/Logo";
import MenuBar from "@/shared/MenuBar";
import LangDropdown from "./LangDropdown";
import NotifyDropdown from "./NotifyDropdown";
import AvatarDropdown from "./AvatarDropdown";
import CurrencyDropdown from "./CurrencyDropdown";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import HeroSearchForm from "../(HeroSearchForm)/HeroSearchForm";

interface Header3Props {
  className?: string;
}

const Header3: FC<Header3Props> = ({ className = "" }) => {
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    // Initial check after mount
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Ensure server/client initial render match
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = () => {
    setIsTop(window.scrollY === 0);
  };

  const renderSearchForm = () => {
    return (
      <div
        className={`absolute inset-x-0 top-0 transition-all will-change-[transform,opacity] ${
          showSearchForm
            ? "visible"
            : "-translate-x-0 -translate-y-[90px] scale-x-[0.395] scale-y-[0.6] opacity-0 invisible pointer-events-none"
        }`}
      >
        <div className={`w-full max-w-4xl mx-auto pb-6`}>
          <HeroSearchForm />
        </div>
      </div>
    );
  };

  const renderButtonOpenSearchForm = () => {
    return (
      <button
        onClick={() => setShowSearchForm(!showSearchForm)}
        className="flex items-center justify-center px-4 py-2 border border-neutral-200 dark:border-neutral-6000 hover:border-neutral-300 dark:hover:border-neutral-500 rounded-full shadow hover:shadow-lg"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
        <span className="ml-2 text-sm font-medium">Search</span>
      </button>
    );
  };

  return (
    <>
      <div
        className={`nc-Header nc-Header3 fixed z-40 top-0 inset-x-0 ${
          mounted && !isTop ? "bg-white dark:bg-neutral-900 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="relative h-20 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-full space-x-4 xl:space-x-8">
            <div className="flex items-center space-x-3 sm:space-x-8">
              <div suppressHydrationWarning={true}>
                <Logo />
              </div>
              <div className="hidden sm:block h-10 border-l border-neutral-300 dark:border-neutral-500"></div>
              <div className="hidden sm:block">
                <MenuBar />
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              {renderButtonOpenSearchForm()}
              <CurrencyDropdown />
              <LangDropdown />
              <NotifyDropdown />
              <AvatarDropdown />
            </div>
          </div>
        </div>
        {renderSearchForm()}
      </div>
    </>
  );
};

export default Header3;
