"use client";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import React, { useState } from "react";
import DatesRangeInput from "../DatesRangeInput";
import LocationInput from "../LocationInput";

const CarsSearchForm = () => {
  //
  const [fieldNameShow, setFieldNameShow] = useState<"location" | "dates">("location");
  const [locationInputValue, setLocationInputValue] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);

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
              {startDate ? startDate.toLocaleDateString() : "Add date"}
            </span>
          </button>
        ) : (
          <DatesRangeInput 
            defaultValue={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
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
      </div>
    </div>
  );
};

export default CarsSearchForm;
