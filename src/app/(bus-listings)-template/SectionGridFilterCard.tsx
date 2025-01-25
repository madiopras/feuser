import React, { FC } from "react";
import TabFilters from "./TabFilters";
import Heading2 from "@/shared/Heading2";
import BusCard, { BusCardProps } from "@/components/BusCard";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface SectionGridFilterCardProps {
  className?: string;
}

const DEMO_DATA: BusCardProps["data"][] = [
  {
    id: "1",
    price: "Rp. 50.000",
    buses: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/KE.png",
      name: "Sumatera Eksekutif",
    },
  },
  {
    id: "2",
    price: "Rp. 85.000",
    buses: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/SQ.png",
      name: "Sumatra VIP",
    },
  },
  {
    id: "3",
    price: "Rp. 100.000",
    buses: {
      logo: "https://www.gstatic.com/flights/airline_logos/70px/multi.png",
      name: "Sumatra Double Decker",
    },
  },
];

const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard">
      <Heading2
        heading="Medan - Pematangsiantar"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            22 Bus
            <span className="mx-2">·</span>
            Semua Kelas
            <span className="mx-2">·</span>2 Kursi
          </span>
        }
      />
      <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div>
      <div className="lg:p-10 lg:bg-neutral-50 lg:dark:bg-black/20 grid grid-cols-1 gap-6  rounded-3xl">
        {DEMO_DATA.map((item, index) => (
          <BusCard key={index} data={item} />
        ))}

        <div className="flex mt-12 justify-center items-center">
          <ButtonPrimary loading>Show more</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
