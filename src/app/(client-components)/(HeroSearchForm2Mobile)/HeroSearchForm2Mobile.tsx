"use client";

import React, { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import ButtonSubmit from "./ButtonSubmit";
import { useTimeoutFn } from "react-use";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import LocationInput from "./LocationInput";
import GuestsInput from "./GuestsInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from 'date-fns/locale';
import MobileSearchBar from "@/components/MobileSearchBar";

interface BusSearchFormRef {
  handleSubmit: () => Promise<void>;
  handleReset: () => void;
}

interface Location {
  id: number;
  name: string;
  place: string;
}

interface BusClass {
  id: number;
  name: string;
}

interface GuestsObject {
  guestAdults: number;
  guestChildren: number;
  guestInfants: number;
}

const HeroSearchForm2Mobile = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const busSearchFormRef = useRef<BusSearchFormRef>(null);
  let [, , resetIsShowingDialog] = useTimeoutFn(() => setShowDialog(true), 1);
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
  const router = useRouter();
  const [fieldNameShow, setFieldNameShow] = useState<
    "locationPickup" | "locationDropoff" | "dates" | "guests" | "general"
  >("dates");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cek halaman checkout setelah component mounted
  const isCheckoutPage = pathname?.startsWith("/checkout");

  useEffect(() => {
    if (isCheckoutPage) return;

    const handleScroll = () => {
      setIsTop(window.pageYOffset < 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCheckoutPage]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/guest/locations/get-name');
        if (response.data.status && response.data.data) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const fetchBusClasses = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/guest/classes/get-name');
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

    if (mounted) {
      fetchLocations();
      fetchBusClasses();
    }
  }, [mounted]);

  if (!mounted) return null;
  if (isCheckoutPage) return null;

  function closeModal() {
    setShowModal(false);
  }

  function openModal() {
    setShowModal(true);
  }

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const selectedPickup = locations.find(loc => loc.name === locationInputPickUp);
      const selectedDropoff = locations.find(loc => loc.name === locationInputDropOff);

      if (!selectedDate || !selectedPickup || !selectedDropoff) {
        alert("Mohon lengkapi semua data pencarian");
        return;
      }

      const departureDate = new Date(selectedDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 7);

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
          params.class = selectedClass.id.toString();
        }
      }

      const response = await axios.get('http://127.0.0.1:8000/api/guest/schedule-rutes', { params });
      
      if (response.data.status && response.data.data) {
        const searchParams = new URLSearchParams(params);
        router.push(`/listing-buses?${searchParams.toString()}`);
        closeModal();
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
  };

  const renderButtonOpenModal = () => {
    return (
      <button
        onClick={openModal}
        className="relative flex items-center w-full border border-neutral-200 dark:border-neutral-6000 px-4 py-2 pr-11 rounded-full shadow-lg"
      >
        <MagnifyingGlassIcon className="flex-shrink-0 w-5 h-5" />

        <div className="ml-3 flex-1 text-left overflow-hidden">
          <span className="block font-medium text-sm">Pergi kemana?</span>
          <span className="block mt-0.5 text-xs font-light text-neutral-500 dark:text-neutral-400 ">
            <span className="line-clamp-1">
              Cari Tiket • Mudah • Cepat
            </span>
          </span>
        </div>

        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-6000 dark:text-neutral-300">
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="block w-4 h-4"
            fill="currentColor"
          >
            <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
          </svg>
        </span>
      </button>
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
              <div className="react-datepicker-wrapper">
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
                  disabledKeyboardNavigation
                  calendarClassName="custom-calendar shadow-lg border border-neutral-200 dark:border-neutral-700"
                  dayClassName={(date) => {
                    const dateString = date.toDateString();
                    const selectedDateString = selectedDate?.toDateString();
                    const isSelected = selectedDateString === dateString;
                    const isToday = new Date().toDateString() === dateString;

                    let className = "hover:bg-neutral-100 dark:hover:bg-neutral-700 relative text-sm font-medium rounded-full";
                    if (isSelected) {
                      className += " bg-primary-600 text-white hover:bg-primary-600";
                    } else if (isToday) {
                      className += " text-primary-600 font-bold";
                    }
                    return className;
                  }}
                  monthClassName={() => "text-lg font-medium"}
                  weekDayClassName={() => "text-neutral-500 font-medium"}
                  renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                  }) => (
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-neutral-800">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        type="button"
                        className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                          prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        tabIndex={0}
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
                        tabIndex={0}
                      >
                        <i className="las la-chevron-right text-xl"></i>
                      </button>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
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
              setLocationInputPickUp(value);
              setFieldNameShow("locationDropoff");
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
      <div className={`w-full bg-white dark:bg-neutral-800 ${
        isActive ? "rounded-2xl shadow-lg" : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
      }`}>
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
              setLocationInputDropOff(value);
              setFieldNameShow("general");
            }}
          />
        )}
      </div>
    );
  };

  const renderGenerals = () => {
    const isActive = fieldNameShow === "general";
    const selectedClass = busClasses.find(bc => bc.name === flightClassState);
    
    return (
      <div className={`w-full bg-white dark:bg-neutral-800 ${
        isActive ? "rounded-2xl shadow-lg" : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
      }`}>
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
                      className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300"
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
        )}
      </div>
    );
  };

  const renderInputGuests = () => {
    const isActive = fieldNameShow === "guests";
    return (
      <div className={`w-full bg-white dark:bg-neutral-800 ${
        isActive ? "rounded-2xl shadow-lg" : "rounded-xl shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)]"
      }`}>
        {!isActive ? (
          <button
            className="w-full flex flex-col items-start p-4 gap-1"
            onClick={() => setFieldNameShow("guests")}
          >
            <span className="text-primary-600 font-medium text-sm">Jumlah Kursi</span>
            <div className="flex justify-between w-full">
              <span className="text-neutral-900 dark:text-white">
                {guestInput.guestAdults} penumpang
              </span>
              <span className="text-neutral-400">
                <i className="las la-user-friends text-lg"></i>
              </span>
            </div>
          </button>
        ) : (
          <GuestsInput
            defaultValue={guestInput}
            onChange={(data) => setGuestInput({
              ...guestInput,
              ...data
            })}
            maxValue={4}
            minValue={1}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <MobileSearchBar onOpenModal={openModal} />
      
      {/* Spacer */}
      <div className="h-[60px] lg:h-0" />

      {/* Modal */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="fixed inset-0 z-[2147483647] overflow-y-auto"
          onClose={closeModal}
        >
          <div className="fixed inset-0 bg-neutral-100 dark:bg-neutral-900">
            <div className="flex h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out transition-transform"
                enterFrom="opacity-0 translate-y-52"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in transition-transform"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-52"
              >
                <Dialog.Panel className="relative h-full overflow-hidden flex-1 flex flex-col">
                  {showDialog && (
                    <Tab.Group manual>
                      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-4">
                        <div className="flex items-center justify-between">
                          <button className="p-2" onClick={closeModal}>
                            <XMarkIcon className="w-5 h-5 text-white" />
                          </button>
                          <h2 className="text-xl font-bold">Pesan Tiket Bus</h2>
                          <div className="w-5" />
                        </div>
                        <p className="text-sm text-white/80 mt-1 text-center">
                          Temukan jadwal perjalanan terbaik untuk Anda
                        </p>
                      </div>

                      <div className="flex-1 overflow-y-auto">
                        <Tab.Panels className="py-4 px-1.5 sm:px-4">
                          <Tab.Panel>
                            <div className="transition-opacity animate-[myblur_0.4s_ease-in-out]">
                              <div className="space-y-5">
                                {renderInputDates()}
                                {renderInputLocationPickup()}
                                {renderInputLocationDropoff()}
                                {renderGenerals()}
                                {renderInputGuests()}
                              </div>
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </div>

                      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="px-4 py-3 flex justify-between items-center">
                          <button
                            type="button"
                            className="text-neutral-500 underline text-sm"
                            onClick={handleReset}
                          >
                            Reset
                          </button>
                          <ButtonSubmit 
                            onClick={handleSearch}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mencari...
                              </span>
                            ) : (
                              "Cari Jadwal"
                            )}
                          </ButtonSubmit>
                        </div>
                      </div>
                    </Tab.Group>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default HeroSearchForm2Mobile;
