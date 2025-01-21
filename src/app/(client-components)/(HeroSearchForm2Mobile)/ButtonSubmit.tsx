import React, { FC } from "react";
import { PathName } from "@/routers/types";

interface Props {
  className?: string;
  onClick?: () => void;
  href?: PathName;
  children?: React.ReactNode;
}

const ButtonSubmit: FC<Props> = ({
  className = "",
  onClick = () => {},
  href = "/listing-stay",
  children,
}) => {
  return (
    <button
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex-shrink-0 px-4 py-2.5 cursor-pointer rounded-xl bg-primary-6000 flex items-center justify-center text-neutral-50 focus:outline-none ${className} relative z-20`}
    >
      {children}
    </button>
  );
};

export default ButtonSubmit;
