"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import BusCard from "@/components/BusCard";
import TabFilters from "../TabFilters";
import SectionGridFilterCard from "../SectionGridFilterCard";
import Heading2 from "@/shared/Heading2";

interface BusSchedule {
  schedule_id: number;
  schedule_rute_id: number;
  departure_time: string;
  arrival_time: string;
  is_active: number;
  dari: string;
  dari_shelter: string;
  dari_id: number;
  ke: string;
  ke_shelter: string;
  ke_id: number;
  price_rute: string;
  kode_bus: string;
  nama_bus: string;
  tipe_bus: string;
  kelas_bus: string;
  class_id: number;
  supir: string;
  total_seats: number;
  name_facilities: string;
}

interface ApiResponse {
  status: boolean;
  data: BusSchedule[];
  current_page: number;
  total_pages: number;
  total_items: number;
}

const calculateDuration = (departure: string, arrival: string) => {
  const start = new Date(departure);
  const end = new Date(arrival);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}j ${minutes}m`;
};

const ListingBusesPage = () => {
  const searchParams = useSearchParams();
  const [schedules, setSchedules] = useState<BusSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const selectedSeats = searchParams?.get("selected_seats") || "1";
  const selectedClass = searchParams?.get("class") || "Semua";
  const fromCity = schedules[0]?.dari || "";
  const toCity = schedules[0]?.ke || "";

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const params = {
          page: searchParams?.get("page") || "1",
          limit: searchParams?.get("limit") || "10",
          dari: searchParams?.get("dari"),
          ke: searchParams?.get("ke"),
          departure_start: searchParams?.get("departure_start"),
          departure_end: searchParams?.get("departure_end"),
          class: searchParams?.get("class"),
          selected_seats: searchParams?.get("selected_seats") || "1",
        };

        const response = await axios.get<ApiResponse>("/api/guest/schedule-rutes", { params });

        if (response.data.status) {
          setSchedules(response.data.data);
          setCurrentPage(response.data.current_page);
          setTotalPages(response.data.total_pages);
          setTotalItems(response.data.total_items);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [searchParams]);

  const renderCard = (schedule: BusSchedule) => {
    const duration = calculateDuration(schedule.departure_time, schedule.arrival_time);
    const logoUrl = "https://www.gstatic.com/flights/airline_logos/70px/KE.png"; // Logo statis

    return (
      <BusCard
        key={schedule.schedule_id}
        scheduleId={schedule.schedule_rute_id}
        departureTime={schedule.departure_time}
        arrivalTime={schedule.arrival_time}
        fromCity={schedule.dari}
        fromTerminal={schedule.dari_shelter}
        toCity={schedule.ke}
        toTerminal={schedule.ke_shelter}
        price={schedule.price_rute}
        busCode={schedule.kode_bus}
        busName={schedule.nama_bus}
        busType={schedule.tipe_bus}
        busClass={schedule.kelas_bus}
        driver={schedule.supir}
        totalSeats={schedule.total_seats}
        facilities={schedule.name_facilities.split(", ")}
        duration={duration}
        logoUrl={logoUrl}
      />
    );
  };

  return (
    <div className="container relative">
      <div className="relative pt-8 pb-16 lg:pb-20 lg:pt-10 space-y-16 lg:space-y-20">
        <div className="listingSection__wrap">
          <div>
            <Heading2
              heading={`${fromCity} - ${toCity}`}
              subHeading={
                <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
                  {totalItems} Bus
                  <span className="mx-2">·</span>
                  {selectedClass === "1" ? "Ekonomi" : selectedClass === "2" ? "Bisnis" : selectedClass === "3" ? "Eksekutif" : "Semua Kelas"}
                  <span className="mx-2">·</span>
                  {selectedSeats} Kursi
                </span>
              }
            />
            <div className="mt-8">
              <TabFilters />
            </div>
          </div>

          <div className="mt-8">
            <SectionGridFilterCard
              schedules={schedules}
              isLoading={isLoading}
              currentPage={currentPage}
              totalPages={totalPages}
              renderCard={renderCard}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingBusesPage;
