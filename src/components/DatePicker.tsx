"use client";
import React, { useState } from "react";
import DatePickerCustomDay from "./DatePickerCustomDay";
import DatePickerCustomHeaderTwoMonth from "./DatePickerCustomHeaderTwoMonth";
import ReactDatePicker from "react-datepicker";

interface Props {
  className?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

const DatePicker: React.FC<Props> = ({ className = "", value, onChange }) => {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`nc-DatePicker ${className}`}>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        dateFormat="MMMM d, yyyy"
        placeholderText="Select date"
        className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm font-normal"
        renderCustomHeader={DatePickerCustomHeaderTwoMonth}
        renderDayContents={(day, date) => (
          <DatePickerCustomDay dayOfMonth={day} date={date} />
        )}
      />
    </div>
  );
};

export default DatePicker;
