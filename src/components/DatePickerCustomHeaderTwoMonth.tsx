import React from "react";
import { ReactDatePickerCustomHeaderProps } from "react-datepicker";

const DatePickerCustomHeaderTwoMonth = ({
  monthDate,
  customHeaderCount,
  decreaseMonth,
  increaseMonth,
}: ReactDatePickerCustomHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <button
        onClick={decreaseMonth}
        className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="flex-grow text-center">
        <span className="text-lg font-semibold">
          {monthDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </span>
      </div>
      <button
        onClick={increaseMonth}
        className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default DatePickerCustomHeaderTwoMonth;
