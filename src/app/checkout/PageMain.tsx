"use client";

import { Tab } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { FC, Fragment, useState, useEffect, useMemo, useRef, ReactElement } from "react";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import StartRating from "@/components/StartRating";
import ModalSelectDate from "@/components/ModalSelectDate";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import ModalSelectGuests from "@/components/ModalSelectGuests";
import Image from "next/image";
import { GuestsObject } from "@/components/type";
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import qrisIcon from "@/images/logo-sumatra.png";
import vaIcon from "@/images/logo-sumatra.png";
import bankIcon from "@/images/logo-sumatra.png";
import axios from "@/lib/axios";
import BookingBusLayout from "@/app/booking-template/bussestype/BookingBusLayout";
import BookingBusMiniLayout from "@/app/booking-template/bussestype/BookingBusMiniLayout";
import BookingBusVipLayout from "@/app/booking-template/bussestype/BookingBusVipLayout";

export interface CheckOutPagePageMainProps {
  className?: string;
}

interface SeatSelection {
  seatNumber: string;
  passengerName: string;
  phoneNumber: string;
  birthDate?: string;
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

interface SeatData {
  seat_number: string;
  gender: string | null;
}

interface ApiResponse {
  status: boolean;
  data: {
    rute: RouteData;
    bus: BusData;
    seats: SeatData[];
  };
}

interface PaymentMethod {
  id: "qris" | "va" | "bank";
  name: string;
  description: string;
  icon: any; // Sesuaikan dengan tipe icon yang benar
}

interface PassengerData {
  id: number;
  name: string;
  phone: string;
  birthDate?: string;
  seatNumber: string;
  title: "tuan" | "nyonya";
}

interface PassengerErrors {
  name: string;
  phone: string;
  seatNumber: string;
}

interface BookingBusLayoutProps {
  seats: number[];
  unselectedSeats: number[];
  bookedSeats: {
    seatNumber: number;
    gender: string;
  }[];
  selectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

// Tambahkan komponen PhoneInput
const PhoneInput = ({
  value,
  onChange,
  placeholder = "Masukkan nomor HP",
  className = "",
  required = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  // Effect untuk menghandle initial value
  useEffect(() => {
    if (value) {
      // Jika dimulai dengan 62, tampilkan apa adanya
      if (value.startsWith("62")) {
        setDisplayValue(value);
      } 
      // Jika dimulai dengan 0, konversi ke format 62
      else if (value.startsWith("0")) {
        setDisplayValue("62" + value.substring(1));
      }
      // Format lainnya, tampilkan apa adanya
      else {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Hanya izinkan angka
    newValue = newValue.replace(/[^\d]/g, "");

    // Jika dimulai dengan 0, konversi ke format 62
    if (newValue.startsWith("0")) {
      newValue = "62" + newValue.substring(1);
    }

    setDisplayValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      type="tel"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      required={required}
      maxLength={13} // Batasi panjang input (62 + 11 digit nomor)
    />
  );
};

// Tambahkan komponen DateInput yang lebih baik
const DateInput = ({
  value,
  onChange,
  placeholder = "Pilih tanggal",
  className = "",
  required = false,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  id?: string;
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(formatDate(date));
  };

  const handleFinalSelection = () => {
    if (selectedDate) {
      onChange(formatDate(selectedDate));
      setShowDatePicker(false);
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="relative" ref={datePickerRef}>
      <div
        className={`w-full px-4 py-2.5 text-sm rounded-lg border border-neutral-200 focus-within:border-primary-500 focus-within:ring-primary-500 bg-white cursor-pointer flex items-center justify-between ${className}`}
        onClick={() => setShowDatePicker(!showDatePicker)}
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? formatDate(selectedDate) : placeholder}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-gray-400">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
        </svg>
      </div>

      {showDatePicker && (
        <div className="absolute z-50 mt-1 p-4 bg-white rounded-lg shadow-xl border border-gray-200 w-72">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Tahun */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
              <select
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
                value={selectedDate?.getFullYear() || new Date().getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(selectedDate || new Date());
                  newDate.setFullYear(parseInt(e.target.value));
                  handleDateSelect(newDate);
                }}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Bulan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
              <select
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
                value={selectedDate?.getMonth() || 0}
                onChange={(e) => {
                  const newDate = new Date(selectedDate || new Date());
                  newDate.setMonth(parseInt(e.target.value));
                  handleDateSelect(newDate);
                }}
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <button
                    key={day}
                    className={`p-2 text-sm rounded-md hover:bg-primary-50 ${
                      selectedDate?.getDate() === day
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'hover:text-primary-500'
                    }`}
                    onClick={() => {
                      const newDate = new Date(selectedDate || new Date());
                      newDate.setDate(day);
                      handleDateSelect(newDate);
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t">
            <button
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowDatePicker(false)}
            >
              Batal
            </button>
            <button
              className="text-sm text-primary-500 font-medium hover:text-primary-600"
              onClick={handleFinalSelection}
            >
              Pilih Tanggal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({ className = "" }): ReactElement => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod["id"] | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "cancelled" | null>(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("pemesan");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
  const [busData, setBusData] = useState<{
    rute: RouteData;
    bus: BusData;
    seats: SeatData[];
  } | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(8 * 60); // 8 menit dalam detik
  const [timerActive, setTimerActive] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [passengerErrors, setPassengerErrors] = useState<PassengerErrors[]>([]);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "qris",
      name: "QRIS",
      description: "Pembayaran menggunakan QRIS",
      icon: qrisIcon,
    },
    {
      id: "va",
      name: "Virtual Account",
      description: "Transfer melalui Virtual Account",
      icon: vaIcon,
    },
    {
      id: "bank",
      name: "Transfer Bank",
      description: "Transfer langsung ke rekening bank",
      icon: bankIcon,
    },
  ];

  // Inisialisasi data bus dan kursi dari API
  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const scheduleId = urlParams.get('schedule_id');
        
        if (!scheduleId) {
          throw new Error('Schedule ID tidak ditemukan');
        }

        const response = await axios.get<ApiResponse>(`/api/guest/schedule-rutes/${scheduleId}/seat`);
        
        if (response.data.status) {
          setBusData(response.data.data);
        } else {
          throw new Error('Gagal mendapatkan data bus');
        }
      } catch (error) {
        console.error("Error fetching bus data:", error);
        alert("Terjadi kesalahan saat memuat data bus. Silakan coba lagi.");
      }
    };

    fetchBusData();
  }, []);

  // Inisialisasi data penumpang saat komponen dimuat
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedSeatsCount = parseInt(urlParams.get('selected_seats') || '1');
    
    // Inisialisasi array penumpang sesuai jumlah kursi yang dipilih
    const initialPassengers = Array(selectedSeatsCount).fill(null).map((_, index) => ({
      id: index + 1,
      name: "",
      phone: "",
      birthDate: "",
      seatNumber: "",
      title: "tuan" as const
    }));
    
    setPassengers(initialPassengers);
    setSelectedSeats(Array(selectedSeatsCount).fill({
      seatNumber: "",
      passengerName: "",
      phoneNumber: "",
      birthDate: ""
    }));

    // Inisialisasi array error penumpang
    setPassengerErrors(Array(selectedSeatsCount).fill({
      name: '',
      phone: '',
      seatNumber: ''
    }));
  }, []);

  // Layout kursi bus dari data API
  const busSeats = useMemo(() => {
    if (!busData) return {
      seats: [],
      unselectedSeats: [],
      bookedSeats: [],
      selectedSeats: []
    };

    // Konversi data kursi dari API ke format yang dibutuhkan layout
    const seats = busData.seats.map(seat => parseInt(seat.seat_number));
    
    // Kursi yang tidak bisa dipilih (sudah dipesan)
    const unselectedSeats = busData.seats
      .filter(seat => seat.gender !== null)
      .map(seat => parseInt(seat.seat_number));
    
    // Data kursi yang sudah dipesan dengan gender
    const bookedSeats = busData.seats
      .filter(seat => seat.gender !== null)
      .map(seat => ({
        seatNumber: parseInt(seat.seat_number),
        gender: seat.gender === "L" ? "L" : seat.gender === "P" ? "P" : "R"
      }));

    // Kursi yang dipilih oleh penumpang saat ini
    const currentSelectedSeats = selectedSeats
      .filter(seat => seat.seatNumber)
      .map(seat => parseInt(seat.seatNumber));

    return {
      seats: seats.sort((a, b) => a - b),
      unselectedSeats,
      bookedSeats,
      selectedSeats: currentSelectedSeats
    };
  }, [busData, selectedSeats]);

  // Fungsi helper untuk format tanggal dan waktu
  const formatDateTime = (dateTimeStr: string | undefined) => {
    if (!dateTimeStr) return { date: '', time: '' };
    
    const date = new Date(dateTimeStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return {
      date: `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`,
      time: date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      }).replace('.', ':')
    };
  };

  // Fungsi helper untuk perhitungan biaya
  const calculatePriceDetails = (selectedPaymentMethod: PaymentMethod["id"] | null) => {
    if (!busData) return { subtotal: 0, serviceFee: 0, serviceFeeLabel: '', total: 0 };

    const price = parseFloat(busData.rute.price_rute);
    const subtotal = price * selectedSeats.length;
    let serviceFee = 0;
    let serviceFeeLabel = '';

    switch (selectedPaymentMethod) {
      case 'qris':
        serviceFee = Math.round(subtotal * 0.007);
        serviceFeeLabel = 'Biaya Layanan QRIS (0,7%)';
        break;
      case 'va':
        serviceFee = 2000;
        serviceFeeLabel = 'Biaya Layanan Virtual Account';
        break;
      case 'bank':
        serviceFee = 2000;
        serviceFeeLabel = 'Biaya Layanan Transfer Bank';
        break;
      default:
        serviceFeeLabel = 'Biaya Layanan';
    }

    return {
      subtotal,
      serviceFee,
      serviceFeeLabel,
      total: subtotal + serviceFee
    };
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeLeft]);

  // Format waktu untuk timer
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Fungsi untuk mengecek status pembayaran
  const handlePaymentCheck = async () => {
    try {
      if (!bookingData?.booking?.id) {
        throw new Error('Data booking tidak ditemukan');
      }

      const response = await axios.get(`/api/guest/check-payment/${bookingData.booking.id}`);
      const paymentData = response.data;

      if (paymentData.payment_status === 'UNPAID') {
        setTimerActive(true);
        setPaymentStatus('pending');
      } else if (paymentData.payment_status === 'PAID') {
        setPaymentStatus('success');
        setTimerActive(false);
      } else if (paymentData.payment_status === 'CANCELLED') {
        setPaymentStatus('cancelled');
        setTimerActive(false);
      }

      // Update booking data dengan data terbaru
      setBookingData({
        ...bookingData,
        booking: paymentData
      });
    } catch (error) {
      console.error('Error checking payment:', error);
      alert('Terjadi kesalahan saat mengecek status pembayaran');
    }
  };

  const handleAccordionChange = (section: string) => {
    // Jika section yang sama diklik, tutup
    // Jika section berbeda diklik, buka yang baru dan tutup yang lama
    setOpenSection(openSection === section ? null : section);
  };

  const renderStepIndicator = () => {
    if (!busData) return null;
    const { subtotal } = calculatePriceDetails(selectedPayment);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          {[
            { step: 1, label: "Data" },
            { step: 2, label: "Bayar" },
            { step: 3, label: "Tiket" }
          ].map((item) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 text-sm rounded-full flex items-center justify-center ${
                  item.step <= currentStep ? 'bg-primary-500 text-white' : 'bg-gray-200'
                }`}>
                  {item.step}
                </div>
                <span className="text-[10px] mt-1">{item.label}</span>
              </div>
              {item.step < 3 && (
                <div className={`w-12 h-0.5 mx-1 ${
                  item.step < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Detail Perjalanan & Total Pembayaran - Mobile View */}
        <div className="lg:hidden bg-primary-50 rounded-lg p-3">
          {/* Baris 1: Rute dan Waktu */}
          <div className="flex justify-between text-xs mb-2">
            <div>
              <p className="font-medium">{busData.rute.start_location} - {busData.rute.end_location}</p>
              <p className="text-neutral-500 text-[11px]">{formatDateTime(busData.rute.departure_time).date}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatDateTime(busData.rute.departure_time).time} - {formatDateTime(busData.rute.arrival_time).time}
              </p>
              <p className="text-neutral-500 text-[11px]">{busData.bus.type_bus}</p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-neutral-200 my-2"></div>

          {/* Baris 2: Detail Bus dan Total */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-[11px]">
                {busData.bus.class_name}
              </span>
              <span className="text-neutral-500">
                {selectedSeats.length} Kursi × Rp {parseInt(busData.rute.price_rute).toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-500">Subtotal</p>
              <p className="font-semibold">
                Rp {calculatePriceDetails(selectedPayment).subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeading = () => {
    switch (currentStep) {
      case 1:
        return (
          <h2 className="text-lg lg:text-2xl font-semibold text-center mb-4">
            Lengkapi data pemesanan
          </h2>
        );
      case 2:
        return (
          <h2 className="text-lg lg:text-2xl font-semibold text-center mb-4">
            Pilih metode pembayaran
          </h2>
        );
      default:
        return null;
    }
  };

  const handleNextStepClick = () => {
    if (currentStep === 1) {
      if (validateBookingInfo()) {
        setShowConfirmModal(true);
      }
    } else {
      handleNextStep();
    }
  };

  // Modifikasi fungsi handlePaymentConfirm
  const handlePaymentConfirm = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const scheduleId = urlParams.get('schedule_id');

      const requestData = {
        schedule_rute_id: parseInt(scheduleId || '0'),
        seats: selectedSeats.map(seat => parseInt(seat.seatNumber)),
        passengers: selectedSeats.map((seat, index) => ({
          seat_number: parseInt(seat.seatNumber),
          gender: passengers[index].title === 'tuan' ? 'L' : 'P',
          name: passengers[index].name,
          phone: passengers[index].phone,
          birth_date: passengers[index].birthDate
        })),
        booker: {
          name: bookingInfo.name,
          phone: bookingInfo.phone,
          email: bookingInfo.email
        },
        payment_method: selectedPayment === 'qris' ? 'QRIS' : 
                       selectedPayment === 'va' ? 'VA' : 'BANK',
        customer_type: 'GUEST'
      };

      const response = await axios.post('/api/guest/booking-transfer', requestData);

      if (response.data.status) {
        // Simpan data booking dari response
        setBookingData(response.data.data);
        setShowPaymentConfirmModal(false);
        handleNextStep();
        setTimerActive(true);
        setPaymentStatus('pending');
      } else {
        throw new Error(response.data.message || 'Gagal melakukan pembayaran');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    }
  };

  // Helper function untuk menentukan tipe bus
  const getBusType = (busData: ApiResponse['data'] | null) => {
    if (!busData) return 'regular';

    const { bus } = busData;
    const busType = bus.type_bus.toLowerCase();
    const className = bus.class_name.toLowerCase();
    const totalSeats = bus.total_seats || 0;

    if (busType.includes('mini')) {
      return 'mini';
    } else if (busType.includes('vip')) {
      return 'vip';
    }
    return 'regular';
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-8">
        {/* Sembunyikan search form di mobile */}
        <div className="hidden">
          {/* Search form content */}
        </div>

        {/* Data Pemesan */}
        <Disclosure as="div" className="border rounded-lg shadow-sm bg-white" defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                <span className="font-semibold">Data Pemesan</span>
                </div>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-primary-500 transition-transform duration-200`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-6 py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nama Lengkap <span className="text-red-500">*</span></Label>
                    <Input 
                      value={bookingInfo.name}
                      onChange={(e) => setBookingInfo({...bookingInfo, name: e.target.value})}
                      placeholder="Masukkan nama lengkap"
                      className={`py-2.5 ${formErrors.name ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>No. Telepon <span className="text-red-500">*</span></Label>
                    <PhoneInput 
                      value={bookingInfo.phone}
                      onChange={(value) => setBookingInfo({...bookingInfo, phone: value})}
                      className={`py-2.5 ${formErrors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email <span className="text-red-500">*</span></Label>
                    <Input 
                      type="email"
                      value={bookingInfo.email}
                      onChange={(e) => setBookingInfo({...bookingInfo, email: e.target.value})}
                      placeholder="Masukkan alamat email"
                      className={`py-2.5 ${formErrors.email ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Data Penumpang */}
        {passengers.map((passenger, index) => (
          <Disclosure 
            key={`passenger-${index}`}
            as="div"
            className="border rounded-lg shadow-sm bg-white"
            defaultOpen={index === 0}
          >
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full justify-between items-center px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-500">{index + 1}</span>
                    </div>
                    <div>
                  <span className="font-semibold">
                        {passenger.name 
                          ? `Penumpang ${index + 1} - ${passenger.name}`
                      : `Penumpang ${index + 1}`}
                  </span>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-primary-500 transition-transform duration-200`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-6 py-4 space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Label>Title <span className="text-red-500">*</span></Label>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`title-${index}`}
                            value="tuan"
                            checked={passenger.title === "tuan"}
                            onChange={(e) => handlePassengerChange(index, 'title', e.target.value as "tuan" | "nyonya")}
                            className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="group-hover:text-primary-500">Tuan</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="radio"
                            name={`title-${index}`}
                            value="nyonya"
                            checked={passenger.title === "nyonya"}
                            onChange={(e) => handlePassengerChange(index, 'title', e.target.value as "tuan" | "nyonya")}
                            className="w-4 h-4 text-primary-500 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="group-hover:text-primary-500">Nyonya</span>
                        </label>
                        {index === 0 && passengers.length === 1 && (
                          <button
                            type="button"
                            onClick={copyBookingInfoToPassenger}
                            className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                            </svg>
                            Salin Pemesan
                          </button>
                        )}
                    </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nama Penumpang <span className="text-red-500">*</span></Label>
                      <Input 
                        value={passenger.name}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className={`py-2.5 ${passengerErrors[index]?.name ? 'border-red-500' : ''}`}
                        required
                      />
                      {passengerErrors[index]?.name && (
                        <p className="text-red-500 text-sm mt-1">{passengerErrors[index].name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>No. Telepon <span className="text-red-500">*</span></Label>
                      <PhoneInput 
                        value={passenger.phone}
                        onChange={(value) => handlePassengerChange(index, 'phone', value)}
                        className={`py-2.5 ${passengerErrors[index]?.phone ? 'border-red-500' : ''}`}
                        required
                      />
                      {passengerErrors[index]?.phone && (
                        <p className="text-red-500 text-sm mt-1">{passengerErrors[index].phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Lahir</Label>
                      <DateInput
                        id={`birthdate-${index}`}
                        value={passenger.birthDate || ''}
                        onChange={(value) => handlePassengerChange(index, 'birthDate', value)}
                        className="py-2.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tempat Duduk <span className="text-red-500">*</span></Label>
                    <button
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 
                          ${passenger.seatNumber ? 'border-primary-500 text-primary-500' : 'border-gray-300'}
                          ${passengerErrors[index]?.seatNumber ? 'border-red-500' : ''}`}
                      onClick={() => {
                        setCurrentPassengerIndex(index);
                        setShowSeatModal(true);
                      }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {passenger.seatNumber ? `Tempat Duduk ${passenger.seatNumber}` : 'Pilih Tempat Duduk'}
                    </button>
                    {passengerErrors[index]?.seatNumber && (
                      <p className="text-red-500 text-sm mt-1">{passengerErrors[index].seatNumber}</p>
                    )}
                  </div>
              </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}

        {/* Modal Pilih Tempat Duduk */}
        <Dialog
          open={showSeatModal}
          onClose={() => setShowSeatModal(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-30" />

            <Dialog.Panel className="relative bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Pilih Tempat Duduk</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Silakan pilih tempat duduk untuk Penumpang {currentPassengerIndex + 1}
                  </p>
                </div>
                          <button
                  onClick={() => setShowSeatModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                          </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Layout Denah Bus */}
                <div className="lg:col-span-2">
                  {(() => {
                    const busType = getBusType(busData);
                    const allSelectedSeats = selectedSeats
                      .filter(seat => seat.seatNumber)
                      .map(seat => parseInt(seat.seatNumber));

                    const handleSeatClick = (seatNumber: number) => {
                      // Cek apakah kursi sudah dipilih
                      const existingIndex = selectedSeats.findIndex(
                        seat => seat.seatNumber === seatNumber.toString()
                      );

                      if (existingIndex !== -1) {
                        // Jika kursi sudah dipilih, hapus pilihan
                                const newSeats = [...selectedSeats];
                        newSeats[existingIndex] = {
                          ...newSeats[existingIndex],
                          seatNumber: ''
                        };
                        setSelectedSeats(newSeats);
                      } else {
                        // Jika kursi belum dipilih, cari slot kosong berikutnya
                        const emptyIndex = selectedSeats.findIndex(
                          seat => !seat.seatNumber
                        );
                        if (emptyIndex !== -1) {
                          const newSeats = [...selectedSeats];
                          newSeats[emptyIndex] = {
                            ...newSeats[emptyIndex],
                            seatNumber: seatNumber.toString()
                          };
                                setSelectedSeats(newSeats);
                              }
                      }
                    };

                    switch (busType) {
                      case 'mini':
                        return (
                          <BookingBusMiniLayout
                            seats={busSeats.seats}
                            unselectedSeats={busSeats.unselectedSeats}
                            bookedSeats={busSeats.bookedSeats}
                            selectedSeats={allSelectedSeats}
                            onSeatClick={handleSeatClick}
                          />
                        );
                      case 'vip':
                        return (
                          <BookingBusVipLayout
                            seats={busSeats.seats}
                            unselectedSeats={busSeats.unselectedSeats}
                            bookedSeats={busSeats.bookedSeats}
                            selectedSeats={allSelectedSeats}
                            onSeatClick={handleSeatClick}
                          />
                        );
                      default:
                        return (
                          <BookingBusLayout
                            seats={busSeats.seats}
                            unselectedSeats={busSeats.unselectedSeats}
                            bookedSeats={busSeats.bookedSeats}
                            selectedSeats={allSelectedSeats}
                            onSeatClick={handleSeatClick}
                          />
                        );
                    }
                  })()}
                </div>

                {/* Daftar Penumpang dan Kursi */}
                <div className="lg:border-l lg:pl-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Daftar Penumpang</h4>
                    {selectedSeats.map((seat, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          seat.seatNumber 
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-gray-500">Penumpang {index + 1}</span>
                            <p className="font-medium">{passengers[index].name || '-'}</p>
                  </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500">Kursi</span>
                            <p className={`font-medium ${
                              seat.seatNumber 
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }`}>
                              {seat.seatNumber || 'Belum dipilih'}
                            </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <button
                  className="w-full px-6 py-3 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowSeatModal(false)}
              disabled={selectedSeats.some(seat => !seat.seatNumber)}
            >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Selesai Memilih
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {selectedSeats.filter(seat => seat.seatNumber).length} dari {selectedSeats.length} kursi telah dipilih
            </p>
          </div>
        </div>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

<div className="flex justify-end mt-8">
  <ButtonPrimary onClick={handleNextStepClick} className="min-w-[200px] !py-3">
    Lanjut ke Pembayaran
  </ButtonPrimary>
</div>
</div>
);
};

const renderPaymentConfirmModal = () => {
  const { subtotal, serviceFee, serviceFeeLabel, total } = calculatePriceDetails(selectedPayment);
  const selectedMethod = paymentMethods.find(method => method.id === selectedPayment);

  return (
    <Dialog
      open={showPaymentConfirmModal}
      onClose={() => setShowPaymentConfirmModal(false)}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />

        <Dialog.Panel className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Konfirmasi Pembayaran
          </Dialog.Title>

          <div className="space-y-4 mb-6">
            <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <Image
                    src={selectedMethod?.icon || ''}
                    alt={selectedMethod?.name || ''}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedMethod?.name}</p>
                  <p className="text-sm text-neutral-500">{selectedMethod?.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Harga Tiket</span>
                <span>Rp {parseInt(busData?.rute.price_rute || '0').toLocaleString()} × {selectedSeats.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>{serviceFeeLabel}</span>
                <span>Rp {serviceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Pembayaran</span>
                <span className="text-primary-500">Rp {total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-sm">
              <p className="text-yellow-700">
                Pastikan detail pembayaran sudah sesuai. Pembayaran yang telah dikonfirmasi tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg"
              onClick={() => setShowPaymentConfirmModal(false)}
            >
              Kembali
            </button>
            <button
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg"
              onClick={handlePaymentConfirm}
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const renderStep2 = () => {
  const { subtotal, serviceFee, serviceFeeLabel, total } = calculatePriceDetails(selectedPayment);

  return (
    <div className="space-y-8">
      {/* Payment methods section */}
      <div className="grid gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedPayment === method.id
                ? "border-primary-500 bg-primary-50"
                : "hover:border-primary-500"
            }`}
            onClick={() => setSelectedPayment(method.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 relative">
                <Image
                  src={method.icon}
                  alt={method.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="font-medium">{method.name}</h4>
                <p className="text-sm text-gray-500">{method.description}</p>
                <p className="text-xs text-primary-500 mt-1">
                  {method.id === 'qris' && 'Biaya layanan 0,7%'}
                  {(method.id === 'va' || method.id === 'bank') && 'Biaya layanan Rp 2.000'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Perjalanan Mobile - hanya tampil di mobile */}
      <div className="lg:hidden border rounded-lg p-4 space-y-4 bg-neutral-50">
        <h4 className="font-medium">Rincian Pemesanan</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Rute</span>
            <span>{busData?.rute.start_location} - {busData?.rute.end_location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Waktu</span>
            <span>
              {formatDateTime(busData?.rute.departure_time).date} {formatDateTime(busData?.rute.departure_time).time} - {formatDateTime(busData?.rute.arrival_time).date} {formatDateTime(busData?.rute.arrival_time).time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Tipe Bus</span>
            <span>{busData?.bus.type_bus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Jumlah Kursi</span>
            <span>{selectedSeats.length} kursi</span>
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Harga Tiket</span>
            <span>Rp {parseInt(busData?.rute.price_rute || '0').toLocaleString()} × {selectedSeats.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          {selectedPayment && (
            <div className="flex justify-between text-sm">
              <span>{serviceFeeLabel}</span>
              <span>Rp {serviceFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total Pembayaran</span>
            <span className="text-primary-500">Rp {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          onClick={handlePrevStep}
        >
          Kembali
        </button>
        <ButtonPrimary
          onClick={() => setShowPaymentConfirmModal(true)}
          disabled={!selectedPayment}
        >
          Bayar Sekarang
        </ButtonPrimary>
      </div>

      {/* Render Payment Confirmation Modal */}
      {renderPaymentConfirmModal()}
    </div>
  );
};

const renderStep3 = () => {
  const bookingDetails = bookingData?.booking;
  const paymentDetails = bookingData?.payment;

  if (paymentStatus === "success") {
    return (
      <div className="text-center space-y-8 py-8">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <div className="text-green-500 text-4xl">✓</div>
            </div>
          </div>
          <div className="absolute inset-0">
            <div className="animate-ping w-20 h-20 bg-green-100 rounded-full opacity-75"></div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-gray-800">Pembayaran Berhasil!</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Tiket Anda telah diterbitkan dan dikirim ke email {bookingDetails?.email}
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl max-w-sm mx-auto">
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nomor Booking</span>
                <span className="font-semibold">{bookingDetails?.payment_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-500 font-medium">Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-medium">{bookingDetails?.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal Booking</span>
                <span className="font-medium">
                  {new Date(bookingDetails?.booking_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Pembayaran</span>
                <span className="text-primary-500 font-semibold">
                  Rp {parseFloat(bookingDetails?.final_price || '0').toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <ButtonPrimary className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh E-Tiket
          </ButtonPrimary>
          <button
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => window.location.href = '/'}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === "cancelled") {
    return (
      <div className="text-center space-y-8 py-8">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold text-gray-800">Pembayaran Dibatalkan</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Mohon maaf, pembayaran Anda telah dibatalkan atau waktu pembayaran telah habis
          </p>
        </div>

        <button
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => window.location.href = '/'}
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6 py-8">
      <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Menunggu Pembayaran</h3>
        <div className="bg-yellow-50 p-4 rounded-xl max-w-md mx-auto">
          <div className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Nomor Booking</span>
                <span className="font-semibold">{bookingDetails?.payment_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Metode Pembayaran</span>
                <span className="font-medium">{bookingDetails?.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Tanggal Booking</span>
                <span className="font-medium">
                  {new Date(bookingDetails?.booking_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-yellow-700 pt-2">
                Mohon selesaikan pembayaran sebelum<br/>
                <span className="font-semibold">
                  {timeLeft > 0 ? (
                    <span className="text-primary-500">{formatTime(timeLeft)}</span>
                  ) : (
                    "Waktu pembayaran habis"
                  )}
                </span>
              </p>
            </div>

            <div className="border-t border-yellow-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Total Pembayaran</span>
                <span className="text-primary-500 font-semibold">
                  Rp {parseFloat(bookingDetails?.final_price || '0').toLocaleString('id-ID', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto">
        <ButtonPrimary onClick={handlePaymentCheck} className="w-full">
          Cek Status Pembayaran
        </ButtonPrimary>
        {paymentDetails?.redirect_url && (
          <a 
            href={paymentDetails.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-white border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors text-center"
          >
            Lanjutkan ke Pembayaran
          </a>
        )}
      </div>
    </div>
  );
};

const renderConfirmationModal = () => {
  return (
    <Dialog
      open={showConfirmModal}
      onClose={() => setShowConfirmModal(false)}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-30" />

        <Dialog.Panel className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Konfirmasi Data Pemesanan
          </Dialog.Title>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <h4 className="font-medium">Data Pemesan:</h4>
              <p className="text-sm">Nama: {bookingInfo.name}</p>
              <p className="text-sm">Telepon: {bookingInfo.phone}</p>
              <p className="text-sm">Email: {bookingInfo.email}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Data Penumpang:</h4>
              {selectedSeats.map((seat, index) => (
                <div key={index} className="text-sm">
                  <p>Penumpang {index + 1}: {seat.passengerName}</p>
                  <p>Nomor Kursi: {seat.seatNumber}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg"
              onClick={() => setShowConfirmModal(false)}
            >
              Periksa Lagi
            </button>
            <button
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg"
              onClick={() => {
                setShowConfirmModal(false);
                handleNextStep();
              }}
            >
              Sudah Sesuai
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

const renderCurrentStep = () => {
  switch (currentStep) {
    case 1:
      return renderStep1();
    case 2:
      return renderStep2();
    case 3:
      return renderStep3();
    default:
      return null;
  }
};

const renderSidebar = () => {
  if (!busData) return null;

  const { subtotal, serviceFee, serviceFeeLabel, total } = calculatePriceDetails(selectedPayment);
  const { date: departureDateStr, time: departureTime } = formatDateTime(busData.rute.departure_time);
  const { date: arrivalDateStr, time: arrivalTime } = formatDateTime(busData.rute.arrival_time);

  // Format durasi perjalanan
  const departureDate = new Date(busData.rute.departure_time);
  const arrivalDate = new Date(busData.rute.arrival_time);
  const durationInHours = Math.abs(arrivalDate.getTime() - departureDate.getTime()) / 36e5;
  const duration = `${Math.floor(durationInHours)} jam ${Math.round((durationInHours % 1) * 60)} menit`;

  return (
    <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
      {/* Detail Perjalanan */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-2xl font-semibold">Detail Perjalanan</h3>
        
        {/* Rute dan Bus Info */}
        <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-neutral-500">Rute</span>
              <p className="font-medium">{busData.rute.start_location} → {busData.rute.end_location}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-neutral-500">Jarak</span>
              <p className="font-medium">{busData.rute.distance} km</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-neutral-500">Bus</span>
              <p className="font-medium">{busData.bus.bus_name}</p>
            </div>
            <div className="text-right">
              <span className="text-sm text-neutral-500">Nomor Bus</span>
              <p className="font-medium">{busData.bus.bus_number}</p>
            </div>
          </div>
        </div>

        {/* Waktu Perjalanan */}
        <div className="bg-neutral-50 p-4 rounded-lg space-y-4">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <div className="w-3 h-3 rounded-full bg-primary-500"></div>
            </div>
            <div className="flex-grow">
              <p className="font-medium">{departureDateStr}</p>
              <p className="text-lg font-semibold text-primary-500">{departureTime}</p>
              <p className="text-sm text-neutral-500">{busData.rute.start_location}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 px-1.5">
            <div className="w-[1px] h-10 bg-neutral-300"></div>
            <div className="flex-grow">
              <p className="text-sm text-neutral-500">Durasi Perjalanan: {duration}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <div className="w-3 h-3 rounded-full border-2 border-primary-500"></div>
            </div>
            <div className="flex-grow">
              <p className="font-medium">{arrivalDateStr}</p>
              <p className="text-lg font-semibold text-primary-500">{arrivalTime}</p>
              <p className="text-sm text-neutral-500">{busData.rute.end_location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rincian Harga */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
        <h3 className="text-2xl font-semibold mb-4">Rincian Harga</h3>
        <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span>Harga Tiket</span>
            <span>Rp {parseInt(busData?.rute.price_rute || '0').toLocaleString()} × {selectedSeats.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          {selectedPayment && (
            <div className="flex justify-between">
              <span>{serviceFeeLabel}</span>
              <span>Rp {serviceFee.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
            <div className="flex justify-between font-semibold">
              <span>Total Pembayaran</span>
              <span className="text-primary-500">Rp {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update data penumpang saat ada perubahan
const handlePassengerChange = (index: number, field: keyof PassengerData, value: string) => {
  const newPassengers = [...passengers];
  newPassengers[index] = {
    ...newPassengers[index],
    [field]: value
  };
  setPassengers(newPassengers);

  // Update juga selectedSeats
  const newSeats = [...selectedSeats];
  if (field === 'name') {
    newSeats[index] = {
      ...newSeats[index],
      passengerName: value
    };
  } else if (field === 'phone') {
    newSeats[index] = {
      ...newSeats[index],
      phoneNumber: value
    };
  } else if (field === 'birthDate') {
    newSeats[index] = {
      ...newSeats[index],
      birthDate: value
    };
  } else if (field === 'seatNumber') {
    newSeats[index] = {
      ...newSeats[index],
      seatNumber: value
    };
  }
  setSelectedSeats(newSeats);
};

// Tambahkan fungsi copyBookingInfoToPassenger
const copyBookingInfoToPassenger = () => {
  if (passengers.length > 0) {
    const newPassengers = [...passengers];
    newPassengers[0] = {
      ...newPassengers[0],
      name: bookingInfo.name,
      phone: bookingInfo.phone
    };
    setPassengers(newPassengers);

    // Update juga selectedSeats
    const newSeats = [...selectedSeats];
    newSeats[0] = {
      ...newSeats[0],
      passengerName: bookingInfo.name,
      phoneNumber: bookingInfo.phone
    };
    setSelectedSeats(newSeats);
  }
};

// Modifikasi fungsi validasi untuk mencakup data penumpang
const validateBookingInfo = () => {
  const errors = {
    name: '',
    phone: '',
    email: '',
  };
  let isValid = true;

  if (!bookingInfo.name.trim()) {
    errors.name = 'Nama pemesan wajib diisi';
    isValid = false;
  }

  if (!bookingInfo.phone.trim()) {
    errors.phone = 'Nomor telepon wajib diisi';
    isValid = false;
  } else if (!/^[0-9]+$/.test(bookingInfo.phone)) {
    errors.phone = 'Nomor telepon hanya boleh berisi angka';
    isValid = false;
  }

  if (!bookingInfo.email.trim()) {
    errors.email = 'Email wajib diisi';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(bookingInfo.email)) {
    errors.email = 'Format email tidak valid';
    isValid = false;
  }

  setFormErrors(errors);

  // Validasi data penumpang
  const newPassengerErrors = passengers.map((passenger, index) => {
    const errors = {
      name: '',
      phone: '',
      seatNumber: ''
    };

    if (!passenger.name.trim()) {
      errors.name = 'Nama penumpang wajib diisi';
      isValid = false;
    }

    if (!passenger.phone.trim()) {
      errors.phone = 'Nomor telepon wajib diisi';
      isValid = false;
    } else if (!/^[0-9]+$/.test(passenger.phone)) {
      errors.phone = 'Nomor telepon hanya boleh berisi angka';
      isValid = false;
    }

    // Cek tempat duduk dari selectedSeats
    const selectedSeat = selectedSeats[index];
    if (!selectedSeat?.seatNumber) {
      errors.seatNumber = 'Tempat duduk wajib dipilih';
      isValid = false;
    }

    return errors;
  });

  setPassengerErrors(newPassengerErrors);
  return isValid;
};

return (
  <div className={`nc-CheckOutPagePageMain ${className}`}>
    <main className="container relative mt-0 mb-24 lg:mb-32 lg:mt-11 flex flex-col-reverse lg:flex-row">
      <div className="w-full lg:w-3/5 xl:w-2/3 lg:pr-10">
        {renderHeading()}
        {renderStepIndicator()}
        {renderCurrentStep()}
        {renderConfirmationModal()}
      </div>
      <div className="hidden lg:block flex-grow">
        {renderSidebar()}
      </div>
    </main>
  </div>
);
};

export default CheckOutPagePageMain;