"use client";

import React, { useState, useEffect } from "react";
import LocationInput from "@/app/(client-components)/(HeroSearchForm2Mobile)/LocationInput";
import GuestsInput from "@/app/(client-components)/(HeroSearchForm2Mobile)/GuestsInput";
import { GuestsObject } from "@/app/(client-components)/type";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/custom-datepicker.css";
import { id } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import ClientOnly from "@/components/ClientOnly";
import axiosInstance from "@/lib/axios";

interface Location {
  id: number;
  name: string;
  place: string;
}

interface BusClass {
  id: number;
  name: string;
}

const BusSearchForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldNameShow, setFieldNameShow] = useState<
    "locationPickup" | "locationDropoff" | "dates" | "guests" | "general"
  >("dates");

  const [locationInputPickUp, setLocationInputPickUp] = useState("");
  const [locationInputDropOff, setLocationInputDropOff] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [flightClassState, setFlightClassState] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [busClasses, setBusClasses] = useState<BusClass[]>([]);
  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 1,
    guestChildren: 0,
    guestInfants: 0,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/api/guest/locations/get-name');
        if (response.data.status && response.data.data) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchBusClasses = async () => {
      try {
        const response = await axiosInstance.get('/api/guest/classes/get-name');
        if (response.data.status && response.data.data) {
          const allClasses = [
            { id: 0, name: "Semua" },
            ...response.data.data
          ];
          setBusClasses(allClasses);
          setFlightClassState("Semua");
        }
      } catch (error) {
        console.error("Error fetching bus classes:", error);
      }
    };

    fetchLocations();
    fetchBusClasses();
  }, []);

  const handleSubmit = async () => {
    const selectedPickup = locations.find(loc => loc.name === locationInputPickUp);
    const selectedDropoff = locations.find(loc => loc.name === locationInputDropOff);

    if (!selectedDate || !selectedPickup || !selectedDropoff) {
      alert("Mohon lengkapi semua data pencarian");
      return;
    }

    setIsLoading(true);
    const departureDate = new Date(selectedDate);
    const endDate = new Date(departureDate);
      //endDate.setDate(endDate.getDate() + 7);

      endDate.setDate(endDate.getDate());

    try {
      const params: Record<string, string> = {
        page: "1",
        limit: "10",
        dari: selectedPickup.id.toString(),
        ke: selectedDropoff.id.toString(),
        departure_start: departureDate.toISOString().split('T')[0],
        departure_end: endDate.toISOString().split('T')[0],
        selected_seats: (guestInput.guestAdults || 1).toString()
      };

      if (flightClassState !== "Semua") {
        const selectedClass = busClasses.find(bc => bc.name === flightClassState);
        if (selectedClass) {
          params.class_bus = selectedClass.id.toString(); // Changed from class to class_bus
        }
      }

      const response = await axiosInstance.get('/api/guest/schedule-rutes', { params });
      
      if (response.data.status && response.data.data) {
        const searchParams = new URLSearchParams(params);
        router.push(`/listing-buses?${searchParams.toString()}`);
      } else {
        alert("Tidak ada jadwal yang tersedia untuk pencarian ini");
      }
    } catch (error) {
      console.error("Error searching schedules:", error);
      alert("Terjadi kesalahan saat mencari jadwal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setLocationInputPickUp("");
    setLocationInputDropOff("");
    setSelectedDate(new Date());
    setFlightClassState("Semua");
    setGuestInput({
      guestAdults: 1,
      guestChildren: 0,
      guestInfants: 0,
    });
    setFieldNameShow("dates");
  };

  const renderInputLocationPickup = () => {
    const isActive = fieldNameShow === "locationPickup";
    const selectedLocation = locations.find(loc => loc.name === locationInputPickUp);
    
    return (
      <div className={`w-full bg-white dark:bg-neutral-800 ${
        isActive ? "rounded-2xl shadow-lg" : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
      }`}>
        {!isActive ? (
          <button
            className="w-full flex flex-col items-start p-4 gap-1"
            onClick={() => setFieldNameShow("locationPickup")}
          >
            <span className="text-primary-600 font-medium text-sm">Kota Keberangkatan</span>
            <div className="flex justify-between w-full">
              <span className="text-neutral-900 dark:text-white">
                {selectedLocation ? selectedLocation.name : "Pilih kota keberangkatan Anda"}
              </span>
              <span className="text-neutral-400">
                <i className="las la-map-marker text-lg"></i>
              </span>
            </div>
          </button>
        ) : (
          <LocationInput
            headingText="Berangkat dari mana?"
            subHeading="Pilih kota atau terminal keberangkatan"
            defaultValue={locationInputPickUp}
            onChange={(value) => {
              const location = locations.find(loc => loc.name === value);
              if (location) {
                setLocationInputPickUp(location.name);
                setFieldNameShow("locationDropoff");
              }
            }}
          />
        )}
      </div>
    );
  };

  const renderInputLocationDropoff = () => {
    const isActive = fieldNameShow === "locationDropoff";
    const selectedLocation = locations.find(loc => loc.name === locationInputDropOff);
    
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className="w-full flex flex-col items-start p-4 gap-1"
            onClick={() => setFieldNameShow("locationDropoff")}
          >
            <span className="text-primary-600 font-medium text-sm">Kota Tujuan</span>
            <div className="flex justify-between w-full">
              <span className="text-neutral-900 dark:text-white">
                {selectedLocation ? selectedLocation.name : "Pilih kota tujuan Anda"}
              </span>
              <span className="text-neutral-400">
                <i className="las la-map-marker text-lg"></i>
              </span>
            </div>
          </button>
        ) : (
          <LocationInput
            headingText="Pergi ke?"
            defaultValue={locationInputDropOff}
            onChange={(value) => {
              const location = locations.find(loc => loc.name === value);
              if (location) {
                setLocationInputDropOff(location.name);
                setFieldNameShow("general");
              }
            }}
          />
        )}
      </div>
    );
  };

  const renderInputDates = () => {
    const isActive = fieldNameShow === "dates";
    return (
      <div className={`w-full bg-white dark:bg-neutral-800 ${
        isActive ? "rounded-2xl shadow-lg" : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
      }`}>
        {!isActive ? (
          <button
            className="w-full flex flex-col items-start p-4 gap-1"
            onClick={() => setFieldNameShow("dates")}
          >
            <span className="text-primary-600 font-medium text-sm">Tanggal Keberangkatan</span>
            <div className="flex justify-between w-full">
              <span className="text-neutral-900 dark:text-white">
                {selectedDate
                  ? selectedDate.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })
                  : "Pilih tanggal keberangkatan"}
              </span>
              <span className="text-neutral-400">
                <i className="las la-calendar text-lg"></i>
              </span>
            </div>
          </button>
        ) : (
          <div className="p-5">
            <div className="flex flex-col space-y-4">
              <span className="text-lg font-semibold">
                Pilih Tanggal Keberangkatan
              </span>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setFieldNameShow("locationPickup");
                }}
                inline
                minDate={new Date()}
                locale={id}
                dateFormat="dd MMMM yyyy"
                showDisabledMonthNavigation
                calendarClassName="custom-calendar"
                dayClassName={(date) => {
                  if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                    return "bg-indigo-500 text-white rounded-full hover:bg-indigo-600";
                  }
                  return "text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full";
                }}
                monthClassName={() => "custom-month"}
                weekDayClassName={() => "custom-week-day"}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex items-center justify-between px-4 py-2">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                        prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <i className="las la-chevron-left text-xl"></i>
                    </button>
                    <h3 className="text-lg font-semibold">
                      {date.toLocaleDateString('id-ID', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h3>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                        nextMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <i className="las la-chevron-right text-xl"></i>
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGenerals = () => {
    const isActive = fieldNameShow === "general";
    const selectedClass = busClasses.find(bc => bc.name === flightClassState);
    
    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className="w-full flex flex-col items-start p-4 gap-1"
            onClick={() => setFieldNameShow("general")}
          >
            <span className="text-primary-600 font-medium text-sm">Kelas Bus</span>
            <div className="flex justify-between w-full">
              <span className="text-neutral-900 dark:text-white">
                {selectedClass?.name || "Pilih kelas bus"}
              </span>
              <span className="text-neutral-400">
                <i className="las la-bus text-lg"></i>
              </span>
            </div>
          </button>
        ) : (
          <div className="p-5">
            <span className="block font-semibold text-xl sm:text-2xl">
              Pilih Kelas Bus
            </span>
            <div className="relative mt-5">
              <div className="mt-6">
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {busClasses.map((busClass) => (
                    <div key={busClass.id} className="flex items-center">
                      <input
                        id={`class-${busClass.id}`}
                        name="class"
                        type="radio"
                        checked={flightClassState === busClass.name}
                        onChange={() => {
                          setFlightClassState(busClass.name);
                          setFieldNameShow("guests");
                        }}
                        className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
                      />
                      <label
                        htmlFor={`class-${busClass.id}`}
                        className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                      >
                        {busClass.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInputGuests = () => {
    const isActive = fieldNameShow === "guests";
    let guestSelected = "";
    if (guestInput.guestAdults) {
      const guest = Math.min(Math.max(guestInput.guestAdults || 0, 1), 4);
      guestSelected += `${guest} penumpang`;
    }

    return (
      <div
        className={`w-full bg-white dark:bg-neutral-800 overflow-hidden ${
          isActive
            ? "rounded-2xl shadow-lg"
            : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
        }`}
      >
        {!isActive ? (
          <button
            className="w-full flex flex-col items-start p-4 gap-1"
            onClick={() => setFieldNameShow("guests")}
          >
            <span className="text-primary-600 font-medium text-sm">Jumlah Kursi</span>
            <div className="flex justify-between w-full">
              <span className="text-neutral-900 dark:text-white">
                {guestSelected || "1 penumpang"}
              </span>
              <span className="text-neutral-400">
                <i className="las la-user-friends text-lg"></i>
              </span>
            </div>
          </button>
        ) : (
          <GuestsInput 
            defaultValue={{
              ...guestInput,
              guestAdults: Math.min(Math.max(guestInput.guestAdults || 1, 1), 4)
            }} 
            onChange={(value) => {
              const adults = Math.min(Math.max(value.guestAdults || 1, 1), 4);
              setGuestInput({
                ...value,
                guestAdults: adults,
                guestChildren: 0,
                guestInfants: 0
              });
            }}
            maxValue={4}
            minValue={1}
          />
        )}
      </div>
    );
  };

  return (
    <div className="pb-24">
      <div className="w-full space-y-5">
        {renderInputDates()}
        {renderInputLocationPickup()}
        {renderInputLocationDropoff()}
        {renderGenerals()}
        {renderInputGuests()}
        <div className="flex gap-4 pt-8">
          <button
            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center w-full">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mencari...
              </span>
            ) : (
              <span className="inline-flex items-center justify-center w-full">
                Cari Jadwal
              </span>
            )}
          </button>
          <button
            className="px-6 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 font-medium"
            onClick={handleReset}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const BusSearchFormWrapper = () => {
  return (
    <ClientOnly>
      <BusSearchForm />
    </ClientOnly>
  );
};

export default BusSearchFormWrapper;