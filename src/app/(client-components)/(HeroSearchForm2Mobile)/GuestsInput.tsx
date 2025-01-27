"use client";
import React, { FC } from "react";
import { GuestsObject } from "../../type";

export interface GuestsInputProps {
  defaultValue: GuestsObject;
  onChange?: (data: GuestsObject) => void;
  maxValue?: number;
  minValue?: number;
}

const GuestsInput: FC<GuestsInputProps> = ({
  defaultValue,
  onChange,
  maxValue = 4,
  minValue = 1,
}) => {
  const handleChangeData = (value: number) => {
    // Batasi nilai antara minValue dan maxValue
    const newValue = Math.min(Math.max(value, minValue), maxValue);
    onChange &&
      onChange({
        guestAdults: newValue,
        guestChildren: 0,
        guestInfants: 0,
      });
  };

  return (
    <div className="p-5">
      <span className="block font-semibold text-xl sm:text-2xl">
        Jumlah Penumpang
      </span>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              Jumlah Kursi
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Maksimal {maxValue} kursi
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
              onClick={() => handleChangeData(defaultValue.guestAdults - 1)}
              disabled={defaultValue.guestAdults <= minValue}
            >
              <i className="las la-minus"></i>
            </button>
            <span className="font-semibold">{defaultValue.guestAdults}</span>
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center border border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-900 focus:outline-none hover:border-neutral-700 dark:hover:border-neutral-400 disabled:hover:border-neutral-400 dark:disabled:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-default"
              onClick={() => handleChangeData(defaultValue.guestAdults + 1)}
              disabled={defaultValue.guestAdults >= maxValue}
            >
              <i className="las la-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestsInput;
