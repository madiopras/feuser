import React from "react";
import Logo from "@/shared/Logo";
import Navigation from "@/shared/Navigation";
import SwitchDarkMode from "@/shared/SwitchDarkMode";

const MainNav1 = () => {
  return (
    <div className="nc-MainNav1 relative z-10">
      <div className="px-4 lg:container h-20 relative flex justify-between">
        <div className="hidden md:flex justify-start flex-1 space-x-4 sm:space-x-10">
          <Logo />
          <div suppressHydrationWarning={true}>
            <Navigation />
          </div>
        </div>
        <div className="flex lg:hidden flex-[3] max-w-lg !mx-auto md:px-3">
          <div className="self-center flex-1">
            {/* Content */}
          </div>
        </div>
        <div className="hidden md:flex flex-shrink-0 justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="hidden xl:flex space-x-0.5">
            <div suppressHydrationWarning={true}>
              <SwitchDarkMode />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav1;
