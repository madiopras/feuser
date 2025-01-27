"use client";

import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

interface Props {
  className?: string;
}

const SwitchDarkMode: React.FC<Props> = ({ className = "" }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`w-12 h-12 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 ${className}`}
    >
      <span className="sr-only">Enable dark mode</span>
      {isDarkMode ? (
        <SunIcon className="w-7 h-7" />
      ) : (
        <MoonIcon className="w-7 h-7" />
      )}
    </button>
  );
};

export default SwitchDarkMode;
