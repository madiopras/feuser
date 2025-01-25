"use client";

import React, { useState, useEffect } from "react";
import LocationInput from "../LocationInput";
import DatesRangeInput from "../DatesRangeInput";
import GuestsInput from "../GuestsInput";
import { GuestsObject } from "../../type";

const StaySearchForm = () => {
  const [fieldNameShow, setFieldNameShow] = useState<"location" | "dates" | "guests">("location");
  const [locationInputValue, setLocationInputValue] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [guestInput, setGuestInput] = useState<GuestsObject>({
    guestAdults: 0,
    guestChildren: 0,
    guestInfants: 0,
  });

  const renderInputLocation = () => {
    const isActive = fieldNameShow === "location";
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
            onClick={() => setFieldNameShow("location")}
          >
            <span className="text-neutral-400">Location</span>
            <span>{locationInputValue || "Location"}</span>
          </button>
        ) : (
          <LocationInput
            defaultValue={locationInputValue}
            onChange={(value) => {
              setLocationInputValue(value);
              setFieldNameShow("dates");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputDates = () => {
    const isActive = fieldNameShow === "dates";
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
            onClick={() => setFieldNameShow("dates")}
          >
            <span className="text-neutral-400">When</span>
            <span>
              {mounted && startDate ? 
                startDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : "Add date"}
            </span>
          </button>
        ) : (
          <DatesRangeInput 
            defaultValue={startDate}
            onChange={(date) => {
              setStartDate(date);
              setFieldNameShow("guests");
            }}
          />
        )}
      </div>
    );
  };

  const renderInputGuests = () => {
    const isActive = fieldNameShow === "guests";
    const guestCount = (guestInput?.guestAdults || 0) + (guestInput?.guestChildren || 0);
    const guestText = `${guestCount} Guest${guestCount > 1 ? 's' : ''}${guestInput?.guestInfants ? `, ${guestInput.guestInfants} Infant${guestInput.guestInfants > 1 ? 's' : ''}` : ''}`;

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
            <span className="text-neutral-400">Guests</span>
            <span>{guestText}</span>
          </button>
        ) : (
          <GuestsInput
            defaultValue={guestInput}
            onChange={setGuestInput}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="w-full space-y-5">
        {renderInputLocation()}
        {renderInputDates()}
        {renderInputGuests()}
      </div>
    </div>
  );
};

export default StaySearchForm;
