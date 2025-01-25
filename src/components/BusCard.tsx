"use client";

import Image from "next/image";
import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export interface BusCardProps {
  scheduleId: number;
  departureTime: string;
  arrivalTime: string;
  fromCity: string;
  fromTerminal: string;
  toCity: string;
  toTerminal: string;
  price: string;
  busCode: string;
  busName: string;
  busType: string;
  busClass: string;
  driver: string;
  totalSeats: number;
  facilities: string[];
  duration: string;
  logoUrl: string;
}

interface SeatData {
  seat_number: string;
  gender: string | null;
}

interface BusData {
  bus_id: number;
  bus_number: string;
  type_bus: string;
  bus_name: string;
  capacity: number;
  class_name: string;
  cargo: number;
  total_seats: number;
}

interface RouteData {
  schedule_rute_id: number;
  route_id: number;
  departure_time: string;
  arrival_time: string;
  price_rute: string;
  start_location_id: number;
  end_location_id: number;
  start_location: string;
  end_location: string;
  distance: number;
}

interface ApiResponse {
  status: boolean;
  data: {
    rute: RouteData;
    bus: BusData;
    seats: SeatData[];
  };
}

const BusCard: React.FC<BusCardProps> = ({
  scheduleId,
  departureTime,
  arrivalTime,
  fromCity,
  fromTerminal,
  toCity,
  toTerminal,
  price,
  busCode,
  busName,
  busType,
  busClass,
  driver,
  totalSeats,
  facilities,
  duration,
  logoUrl,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = () => {
    try {
      // Get selected_seats from URL
      const urlParams = new URLSearchParams(window.location.search);
      const selectedSeats = urlParams.get('selected_seats') || '';
      
      // Navigasi ke halaman checkout dengan menambahkan selected_seats
      router.push(`/checkout?schedule_id=${scheduleId}&selected_seats=${selectedSeats}`);
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const renderDetailTop = () => {
    return (
      <div>
        <div className="flex flex-col md:flex-row">
          {/* Logo dan Info Bus - Mobile */}
          <div className="flex items-center justify-between w-full md:hidden mb-5">
            <div className="flex items-center space-x-3">
              <Image
                src={logoUrl}
                className="w-10"
                alt={busName}
                sizes="40px"
                width={40}
                height={40}
              />
              <div>
                <div className="font-medium">{busName}</div>
                <div className="text-sm text-neutral-500">{busType}</div>
              </div>
            </div>
          </div>

          {/* Logo - Desktop */}
          <div className="hidden md:block w-24 md:w-20 lg:w-24 flex-shrink-0 md:pt-7">
            <Image
              src={logoUrl}
              className="w-10"
              alt={busName}
              sizes="40px"
              width={40}
              height={40}
            />
          </div>

          {/* Rute dan Waktu */}
          <div className="flex flex-1">
            <div className="flex-shrink-0 flex flex-col items-center py-2">
              <span className="block w-6 h-6 rounded-full border-2 border-primary-600"></span>
              <span className="block flex-grow border-l-2 border-primary-600 border-dashed my-1"></span>
              <span className="block w-6 h-6 rounded-full border-2 border-primary-600"></span>
            </div>
            <div className="ml-4 space-y-10 text-sm flex-1">
              <div className="flex flex-col space-y-1">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {new Date(departureTime).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} · {new Date(departureTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-semibold">
                  {fromTerminal} ({fromCity})
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-neutral-500 dark:text-neutral-400">
                  {new Date(arrivalTime).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} · {new Date(arrivalTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-semibold">
                  {toTerminal} ({toCity})
                </span>
              </div>
            </div>
          </div>

          {/* Info Bus - Desktop */}
          <div className="hidden md:block border-l border-neutral-200 dark:border-neutral-700 md:mx-6 lg:mx-10 pl-6">
            <ul className="text-sm text-neutral-500 dark:text-neutral-400 space-y-2">
              <li className="flex items-center space-x-2">
                <i className="las la-clock text-lg text-primary-600"></i>
                <span>{duration}</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="las la-bus text-lg text-primary-600"></i>
                <span>{busCode} · {busType}</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="las la-chair text-lg text-primary-600"></i>
                <span>{totalSeats} kursi tersedia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderDetail = () => {
    if (!isOpen) return null;
    return (
      <div className="p-4 md:p-8 border border-neutral-200 dark:border-neutral-700 rounded-2xl">
        {renderDetailTop()}
        <div className="mt-7 space-y-5">
          <div className="border-t border-neutral-200 dark:border-neutral-700" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
              <span className="font-medium">Fasilitas:</span> {facilities.join(" • ")}
            </div>
            <div className="md:hidden w-full">
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-primary-6000 hover:bg-primary-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <>
                    <span>Pesan Sekarang</span>
                    <i className="las la-arrow-right text-lg"></i>
                  </>
                )}
              </button>
            </div>
            <div className="hidden md:block">
              <button
                onClick={handleBooking}
                disabled={isLoading}
                className="px-6 py-2.5 bg-primary-6000 hover:bg-primary-700 text-white rounded-full font-medium text-sm transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Memproses...</span>
                  </span>
                ) : (
                  <>
                    <span>Pesan Sekarang</span>
                    <i className="las la-arrow-right text-lg"></i>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-700" />
        </div>
      </div>
    );
  };

  return (
    <div className="group nc-BusCardgroup p-4 sm:p-6 relative bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0">
          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start">
            <div className="flex items-center space-x-3">
              <Image
                src={logoUrl}
                width={40}
                height={40}
                className="w-10"
                alt={busName}
                sizes="40px"
              />
              <div className="block sm:hidden">
                <div className="font-medium">{busName}</div>
                <div className="text-sm text-neutral-500">{busType}</div>
              </div>
            </div>
            <button
              onClick={handleBooking}
              disabled={isLoading}
              className="block sm:hidden px-3 py-1.5 bg-primary-6000 hover:bg-primary-700 text-white rounded-full text-sm transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : "Pesan"}
            </button>
          </div>

          <div className="block sm:hidden space-y-4 w-full">
            <div className="flex justify-between items-center bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl">
              <div>
                <div className="text-lg font-medium">
                  {new Date(departureTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm text-neutral-500">{fromCity}</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium text-primary-600">{duration}</div>
                <div className="flex items-center justify-center w-full my-1">
                  <i className="las la-arrow-right text-lg text-primary-600"></i>
                </div>
                <div className="text-xs text-primary-600">Langsung</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {new Date(arrivalTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm text-neutral-500">{toCity}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-3">
              <div className="text-sm text-neutral-500">{fromTerminal}</div>
              <div className="text-sm text-neutral-500">{toTerminal}</div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-1">
                  <div className="text-xl font-semibold text-secondary-6000">
                    Rp {parseInt(price).toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs text-neutral-500">/kursi</div>
                </div>
                <div className="flex items-center text-sm text-neutral-500">
                  <i className="las la-chair text-lg"></i>
                  <span className="ml-1">Sisa {totalSeats}</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
              >
                <i className={`text-lg las la-angle-down transition-transform ${isOpen ? "-rotate-180" : ""}`}></i>
              </button>
            </div>
          </div>

          {/* Jam Keberangkatan */}
          <div className="hidden sm:block min-w-[150px] flex-[4] pl-8">
            <div className="font-medium text-lg">
              {new Date(departureTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(arrivalTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-neutral-500 font-normal mt-0.5">
              {busName}
            </div>
          </div>

          {/* Rute */}
          <div className="hidden sm:block flex-[4] whitespace-nowrap">
            <div className="font-medium text-lg flex items-center space-x-2">
              <span>{fromCity}</span>
              <i className="las la-arrow-right text-primary-600"></i>
              <span>{toCity}</span>
            </div>
            <div className="text-sm text-neutral-500 font-normal mt-0.5 flex items-center space-x-2">
              <span>{fromTerminal}</span>
              <span className="text-xs">•</span>
              <span>{toTerminal}</span>
            </div>
          </div>

          {/* Harga dan Tombol */}
          <div className="hidden sm:flex flex-[4] whitespace-nowrap items-center justify-end">
            <div className="flex items-center space-x-3">
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-semibold text-secondary-6000">
                    Rp {parseInt(price).toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-neutral-500">/kursi</span>
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {duration} · Sisa {totalSeats} kursi
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-6000 hover:bg-primary-700 text-white rounded-full font-medium text-sm transition-colors"
                >
                  {isLoading ? "..." : "Pesan"}
                </button>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-8 h-8 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <i className={`text-lg las la-angle-down transition-transform ${isOpen ? "-rotate-180" : ""}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderDetail()}
    </div>
  );
};

export default BusCard;
