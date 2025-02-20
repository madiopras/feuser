"use client";

import React from 'react';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname } from 'next/navigation';

interface MobileSearchBarProps {
  onOpenModal: () => void;
}

const MobileSearchBar = ({ onOpenModal }: MobileSearchBarProps) => {
  const pathname = usePathname();
  const isBusSearchPage = pathname === '/bus-search';

  if (isBusSearchPage) {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2147483647,
        transform: 'translate3d(0,0,0)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      className="lg:hidden shadow-sm"
    >
      <div className="container mx-auto px-4 py-2">
        <button
          onClick={onOpenModal}
          className="relative flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg"
        >
          <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />
          <div className="ml-3 flex-1 text-left overflow-hidden">
            <span className="block font-medium text-sm">Pergi kemana?</span>
            <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400">
              <span className="line-clamp-1">
                Cari Tiket • Mudah • Cepat
              </span>
            </span>
          </div>
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              className="block w-4 h-4"
              fill="currentColor"
            >
              <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileSearchBar;