"use client";

import React, { FC, useState } from "react";
import BusSearchForm from "./(bus-search-form)/BusSearchForm";

export type SearchTab = "Stays" | "Experiences" | "Cars" | "Flights";

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: SearchTab;
  currentPage?: "Stays" | "Experiences" | "Cars" | "Flights";
}

const HeroSearchForm: FC<HeroSearchFormProps> = ({
}) => {
  return (
    <div
      className="nc-HeroSearchForm w-full max-w-6xl py-5 lg:py-0"
    >
      <BusSearchForm />
    </div>
  );
};

export default HeroSearchForm;
