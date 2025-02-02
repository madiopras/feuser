"use client";

import React from "react";
import { PathName } from "@/routers/types";
import HeroSearchForm2Mobile from "./HeroSearchForm2Mobile";
//import HeroSearchForm2RealEstateMobile from "./HeroSearchForm2RealEstateMobile";
import { usePathname } from "next/navigation";



const HeroSearchForm2MobileFactory = () => {
  return <HeroSearchForm2Mobile />;
};

export default HeroSearchForm2MobileFactory;