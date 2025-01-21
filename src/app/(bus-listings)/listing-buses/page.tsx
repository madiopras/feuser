import SectionHeroArchivePage from "@/app/(server-components)/SectionHeroArchivePage";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import SectionSubscribe2 from "@/components/SectionSubscribe2";
import React, { FC } from "react";
import SectionGridFilterCard from "../SectionGridFilterCard";

export interface ListingBusesPageProps {}

const ListingBusesPage: FC<ListingBusesPageProps> = ({}) => {
  return (
    <div className={`nc-ListingBusesPage relative overflow-hidden `}>
      <BgGlassmorphism />

      <div className="container relative">
        {/* SECTION HERO */}
        <SectionHeroArchivePage
          currentPage="Flights"
          currentTab="Flights"
          className="pt-0 pb-14 lg:pb-18 lg:pt-12 "
        />

        {/* SECTION */}
        <SectionGridFilterCard className="pb-24 lg:pb-28" />

        {/* SECTION 1 */}
        {/* <SectionSliderNewCategories
          heading="Explore top destination ✈"
          subHeading="Explore thousands of destinations around the world"
          categoryCardType="card4"
          itemPerRow={4}
        /> */}

        {/* SECTION */}
        {/* <SectionSubscribe2 className="py-24 lg:py-28" /> */}
      </div>
    </div>
  );
};

export default ListingBusesPage;
