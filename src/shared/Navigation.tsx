import React from "react";
import Link from "next/link";
import { Route } from "@/routers/types";

const Navigation = () => {
  const menuItems = [
    { href: "/" as Route, label: "Home" },
    { href: "/bus-search" as Route, label: "Bus" },
    { href: "/about" as Route, label: "About" },
    { href: "/contact" as Route, label: "Contact" },
  ];

  return (
    <nav className="nc-Navigation">
      <ul className="flex space-x-8">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link 
              href={item.href}
              className="inline-flex items-center text-sm xl:text-base font-normal text-neutral-700 dark:text-neutral-300 py-2 px-4 xl:px-5 rounded-full hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;