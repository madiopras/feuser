"use client";
import React, { useState, Fragment } from "react";
import LocationInput from "../LocationInput";
import GuestsInput from "../GuestsInput";
import DatesRangeInput from "../DatesRangeInput";
import { GuestsObject } from "../../type";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";

const BusSearchForm = () => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<
    "locationPickup" | "locationDropoff" | "dates" | "guests" | "general"
  >("dates");
  //
  const [locationInputPickUp, setLocationInputPickUp] = useState("");
  const [locationInputDropOff, setLocationInputDropOff] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showDateModal, setShowDateModal] = useState(false);

  const [flightClassState, setFlightClassState] = useState("Economy");

  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });

  const renderInputLocationPickup = () => {
    const isActive = fieldNameShow === "locationPickup";
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
                {locationInputPickUp || "Pilih kota keberangkatan Anda"}
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
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("locationDropoff")}
          >
            <span className="text-neutral-400">Pergi ke</span>
            <span>{locationInputDropOff || "Location"}</span>
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
          <DatesRangeInput 
            defaultValue={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              setFieldNameShow("locationPickup");
            }}
          />
        )}
      </div>
    );
  };

  const renderGenerals = () => {
    const isActive = fieldNameShow === "general";
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
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("general")}
          >
            <span className="text-neutral-400">Kelas Bus</span>
            <span>{flightClassState}</span>
          </button>
        ) : (
          <div className="p-5">
            <span className="block font-semibold text-xl sm:text-2xl">
              Pilih Kelas Bus
            </span>
            <div className="relative mt-5">
              <div className="mt-6">
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {renderRadio("class", "Economy", "Ekonomi")}
                  {renderRadio("class", "Business", "Bisnis")}
                  {renderRadio("class", "Multiple", "Eksekutif")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRadio = (
    name: string,
    id: string,
    label: string,
    defaultChecked?: boolean
  ) => {
    return (
      <div className="flex items-center ">
        <input
          defaultChecked={flightClassState === label}
          id={id + name}
          name={name}
          onChange={() => setFlightClassState(label)}
          type="radio"
          className="focus:ring-primary-500 h-6 w-6 text-primary-500 border-neutral-300 !checked:bg-primary-500 bg-transparent"
        />
        <label
          htmlFor={id + name}
          className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      </div>
    );
  };

  const renderInputGuests = () => {
    const isActive = fieldNameShow === "guests";
    let guestSelected = "";
    if (guestInput.guestAdults) {
      const guest =
        (guestInput.guestAdults || 0);
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
            className={`w-full flex justify-between text-sm font-medium p-4`}
            onClick={() => setFieldNameShow("guests")}
          >
            <span className="text-neutral-400">Jumlah Kursi</span>
            <span>{guestSelected || `Tambah penumpang`}</span>
          </button>
        ) : (
          <GuestsInput defaultValue={guestInput} onChange={setGuestInput} />
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
      </div>
    </div>
  );
};

export default BusSearchForm;
