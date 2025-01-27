import React, { FC } from "react";
import { PathName } from "@/routers/types";

interface Props {
  className?: string;
  onClick?: () => void;
  href?: PathName;
  children?: React.ReactNode;
  disabled?: boolean;
}

const ButtonSubmit: FC<Props> = ({
  className = "",
  onClick = () => {},
  href = "/listing-stay",
  children,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={`flex-shrink-0 px-4 py-2.5 cursor-pointer rounded-xl bg-primary-6000 flex items-center justify-center text-neutral-50 focus:outline-none ${className} relative z-20 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

export default ButtonSubmit;
