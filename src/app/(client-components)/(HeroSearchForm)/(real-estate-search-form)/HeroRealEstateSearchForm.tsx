"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import convertNumbThousand from "@/utils/convertNumbThousand";
import LocationInput from "../../(HeroSearchForm2Mobile)/LocationInput";
import PriceRangeInput from "../../(HeroSearchForm2Mobile)/(real-estate-search-form)/PriceRangeInput";
import PropertyTypeSelect from "../../(HeroSearchForm2Mobile)/(real-estate-search-form)/PropertyTypeSelect";
import { ClassOfProperties } from "../../type";
import ButtonSubmit from "../../(HeroSearchForm2Mobile)/ButtonSubmit";

const HeroRealEstateSearchForm = () => {
  const [mounted, setMounted] = useState(false);
  const [locationInputTo, setLocationInputTo] = useState("");
  const [rangePrices, setRangePrices] = useState([100000, 4000000]);
  const [typeOfProperty, setTypeOfProperty] = useState<ClassOfProperties[]>([
    {
      name: "Duplex House",
      description: "Have a place to yourself",
      checked: true,
    },
    {
      name: "Ferme House",
      description: "Have your own room and share some common spaces",
      checked: true,
    },
    {
      name: "Chalet House",
      description:
        "Have a private or shared room in a boutique hotel, hostel, and more",
      checked: true,
    },
    {
      name: "Maison House",
      description: "Stay in a shared space, like a common room",
      checked: false,
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <form className="w-full relative mt-8 rounded-[40px] xl:rounded-[49px] h-[70px] xl:h-[88px] bg-white dark:bg-neutral-800">
      <div className="absolute left-0 inset-y-0 flex items-center pl-5 xl:pl-8">
        <LocationInput
          className="text-left flex-1"
          defaultValue={locationInputTo}
          onChange={(value) => setLocationInputTo(value)}
        />
      </div>
      <div className="absolute right-0 inset-y-0 flex items-center pr-2">
        <div className="relative flex items-center space-x-2">
          <div className="border-l border-neutral-200 dark:border-neutral-700 h-8"></div>
          <ButtonSubmit>Search</ButtonSubmit>
        </div>
      </div>
    </form>
  );
};

export default dynamic(() => Promise.resolve(HeroRealEstateSearchForm), {
  ssr: false
}); 