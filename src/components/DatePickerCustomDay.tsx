import React from "react";

interface Props {
  dayOfMonth: number;
  date?: Date;
}

const DatePickerCustomDay = ({ dayOfMonth, date }: Props) => {
  return (
    <div className="nc-DatePickerCustomDay">
      {dayOfMonth}
    </div>
  );
};

export default DatePickerCustomDay;
