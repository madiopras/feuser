import React, { FC } from "react";
import MainNav1 from "./MainNav1";

export interface HeaderProps {
  navType?: "MainNav1" | "MainNav2";
  className?: string;
}

const Header: FC<HeaderProps> = () => {
  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block nc-Header sticky top-0 w-full left-0 right-0 z-40">
        <MainNav1 />
      </div>
      
      {/* Mobile Header - pushed down by search bar */}
      <div className="lg:hidden nc-Header sticky top-[60px] w-full left-0 right-0 z-30">
        <MainNav1 />
      </div>
    </>
  );
};

export default Header;
