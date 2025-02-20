"use client";

import React, { useState, useEffect } from "react";

interface LocationInputProps {
  defaultValue: string;
  onChange?: (value: string) => void;
  headingText?: string;
  subHeading?: string;
}

interface Location {
  id: number;
  name: string;
  place: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  defaultValue,
  onChange,
  headingText = "Lokasi",
  subHeading = "Pilih lokasi",
}) => {
  const [value, setValue] = useState(defaultValue);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${apiUrl}/api/guest/locations/get-name`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.data) {
          setLocations(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  const filteredLocations = locations
    .filter(
      (location) =>
        location.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        location.place.toLowerCase().includes(searchValue.toLowerCase())
    )
    .slice(0, 10);

  const handleSelect = (location: Location) => {
    setValue(location.name);
    onChange?.(location.name);
  };

  return (
    <div className="w-full">
      <div className="p-5">
        <span className="block font-semibold text-xl sm:text-2xl">
          {headingText}
        </span>
        <span className="block mt-1 text-sm text-neutral-400">
          {subHeading}
        </span>
        <div className="relative mt-5">
          <input
            className="block w-full bg-transparent border px-4 py-3 pr-12 border-neutral-900 dark:border-neutral-200 rounded-xl focus:ring-0 focus:outline-none text-base leading-none placeholder-neutral-500 dark:placeholder-neutral-300 truncate font-bold placeholder:truncate"
            placeholder="Cari lokasi..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <i className="las la-search text-lg"></i>
          </span>
        </div>
      </div>

      <div className="mt-7 px-5">
        <div className="mt-2">
          {filteredLocations.map((location) => (
            <button
              key={location.id}
              className="flex items-center space-x-3 py-2 mb-1 w-full hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg px-4"
              onClick={() => handleSelect(location)}
            >
              <span className="block text-neutral-400">
                <i className="las la-map-marker text-lg"></i>
              </span>
              <div className="flex-grow">
                <span className="block font-medium text-neutral-700 dark:text-neutral-200">
                  {location.name}
                </span>
                <span className="block text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {location.place}
                </span>
              </div>
            </button>
          ))}
          {filteredLocations.length === 0 && (
            <div className="text-center text-neutral-500 dark:text-neutral-400 py-4">
              Tidak ada lokasi yang ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationInput;
