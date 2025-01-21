"use client";

import DatePicker from "react-datepicker";
import React, { FC } from "react";
import DatePickerCustomHeaderTwoMonth from "@/components/DatePickerCustomHeaderTwoMonth";
import DatePickerCustomDay from "@/components/DatePickerCustomDay";

interface Props {
  defaultValue: Date | null;
  onChange?: (date: Date | null) => void;
}

const DatesRangeInput: FC<Props> = ({ defaultValue, onChange }) => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // Batas 3 bulan ke depan

  const onChangeHandler = (date: Date | null) => {
    onChange && onChange(date);
  };

  return (
    <div>
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          Pilih Tanggal Keberangkatan
        </span>
      </div>
      <div className="relative flex-shrink-0 flex justify-center z-10 py-5">
        <DatePicker
          selected={defaultValue}
          onChange={onChangeHandler}
          monthsShown={1}
          showPopperArrow={false}
          inline
          minDate={today} // Tanggal minimal hari ini
          maxDate={maxDate} // Tanggal maksimal 3 bulan ke depan
          renderCustomHeader={(p) => <DatePickerCustomHeaderTwoMonth {...p} />}
          renderDayContents={(day, date) => (
            <DatePickerCustomDay dayOfMonth={day} date={date} />
          )}
          // Tambahan properti untuk meningkatkan UX
          calendarClassName="bg-white dark:bg-neutral-800 rounded-xl shadow-lg"
          dateFormat="dd MMMM yyyy"
          locale="id"
          showDisabledMonthNavigation
          // Properti untuk mengatur navigasi bulan
          //previousMonthButtonDisabled={true} // Nonaktifkan tombol bulan sebelumnya
          //previousYearButtonDisabled={true} // Nonaktifkan tombol tahun sebelumnya
        />
      </div>
    </div>
  );
};

export default DatesRangeInput;
