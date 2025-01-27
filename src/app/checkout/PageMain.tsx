"use client";

import { Tab } from "@headlessui/react";
import { Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React, { FC, Fragment, useState, useEffect } from "react";
import visaPng from "@/images/vis.png";
import mastercardPng from "@/images/mastercard.svg";
import Input from "@/shared/Input";
import Label from "@/components/Label";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import StartRating from "@/components/StartRating";
import NcModal from "@/shared/NcModal";
import ModalSelectDate from "@/components/ModalSelectDate";
import converSelectedDateToString from "@/utils/converSelectedDateToString";
import ModalSelectGuests from "@/components/ModalSelectGuests";
import Image from "next/image";
import { GuestsObject } from "../(client-components)/type";
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import qrisIcon from "@/images/logo-sumatra.png";
import vaIcon from "@/images/logo-sumatra.png";
import bankIcon from "@/images/logo-sumatra.png";

export interface CheckOutPagePageMainProps {
  className?: string;
}

interface SeatSelection {
  seatNumber: string;
  passengerName: string;
  phoneNumber: string;
  birthDate?: string;
}

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<SeatSelection[]>([]);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | null>(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("pemesan");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);

  // Contoh data bus yang dipilih
  const busDetails = {
    route: "Jakarta - Bandung",
    type: "Mercedes-Benz OH 1526",
    class: "Eksekutif",
    facilities: ["AC", "Reclining Seat", "USB Charger", "Toilet"],
    departureTime: "07:00",
    arrivalTime: "10:00",
    price: 150000,
  };

  // Layout kursi bus
  const busSeats = Array.from({ length: 32 }, (_, i) => {
    const row = Math.floor(i / 4) + 1;
    // Hitung kolom dengan mempertimbangkan lorong
    const actualCol = i % 4;
    const col = actualCol >= 2 ? actualCol + 1 : actualCol;
    const seatNumber = i + 1;
    
    return {
      number: seatNumber.toString(),
      row,
      col,
      isAvailable: Math.random() > 0.3,
    };
  });

  const paymentMethods = [
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

  // Inisialisasi data penumpang saat komponen dimuat
  useEffect(() => {
    // Contoh: inisialisasi 2 kursi penumpang
    setSelectedSeats([
      { seatNumber: "", passengerName: "", phoneNumber: "", birthDate: "" },
      { seatNumber: "", passengerName: "", phoneNumber: "", birthDate: "" }
    ]);
  }, []);

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

  const handlePaymentCheck = () => {
    // Simulasi pengecekan pembayaran
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
  };

  const handleAccordionChange = (section: string) => {
    // Jika section yang sama diklik, tutup
    // Jika section berbeda diklik, buka yang baru dan tutup yang lama
    setOpenSection(openSection === section ? null : section);
  };

  // Tambahkan fungsi helper untuk perhitungan biaya
  const calculatePriceDetails = (selectedPaymentMethod: string) => {
    const subtotal = busDetails.price * selectedSeats.length;
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

  const renderStepIndicator = () => {
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
              <p className="font-medium">{busDetails.route}</p>
              <p className="text-neutral-500 text-[11px]">24 Mar 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{busDetails.departureTime} - {busDetails.arrivalTime}</p>
              <p className="text-neutral-500 text-[11px]">{busDetails.type}</p>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-neutral-200 my-2"></div>

          {/* Baris 2: Detail Bus dan Total */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-neutral-100 rounded-full text-[11px]">
                {busDetails.class}
              </span>
              <span className="text-neutral-500">
                {selectedSeats.length} Kursi × Rp {busDetails.price.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-500">Subtotal</p>
              <p className="font-semibold">
                Rp {subtotal.toLocaleString()}
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
      setShowConfirmModal(true);
    } else {
      handleNextStep();
    }
  };

  const handlePaymentConfirm = () => {
    setShowPaymentConfirmModal(false);
    handleNextStep();
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-8">
        {/* Sembunyikan search form di mobile */}
        <div className="hidden">
          {/* Search form content */}
        </div>

        {/* Data Pemesan */}
        <Disclosure 
          open={openSection === "pemesan"}
          onChange={() => handleAccordionChange("pemesan")}
        >
          {({ open }) => (
            <div className="border rounded-lg">
              <Disclosure.Button className="flex w-full justify-between px-4 py-2">
                <span className="font-semibold">Data Pemesan</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-primary-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 py-4 space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                    <Label>Nama Lengkap</Label>
                    <Input 
                      value={bookingInfo.name}
                      onChange={(e) => setBookingInfo({...bookingInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>No. Telepon</Label>
                    <Input 
                      value={bookingInfo.phone}
                      onChange={(e) => setBookingInfo({...bookingInfo, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={bookingInfo.email}
                      onChange={(e) => setBookingInfo({...bookingInfo, email: e.target.value})}
                    />
                  </div>
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>

        {/* Data Penumpang */}
        {selectedSeats.map((seat, index) => (
          <Disclosure
            key={`passenger-${index}`}
            defaultOpen={openSection === `passenger-${index}`}
            onChange={() => handleAccordionChange(`passenger-${index}`)}
          >
            {({ open }) => (
              <div className="border rounded-lg">
                <Disclosure.Button className="flex w-full justify-between px-4 py-2">
                  <span className="font-semibold">
                    {seat.passengerName 
                      ? `Penumpang ${index + 1} - ${seat.passengerName}`
                      : `Penumpang ${index + 1}`}
                  </span>
                  <ChevronUpIcon
                    className={`${
                      open ? 'transform rotate-180' : ''
                    } w-5 h-5 text-primary-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-4 space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label>Nama Penumpang</Label>
                      <Input 
                        value={seat.passengerName}
                        onChange={(e) => {
                          const newSeats = [...selectedSeats];
                          newSeats[index].passengerName = e.target.value;
                          setSelectedSeats(newSeats);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>No. Telepon</Label>
                      <Input 
                        value={seat.phoneNumber}
                        onChange={(e) => {
                          const newSeats = [...selectedSeats];
                          newSeats[index].phoneNumber = e.target.value;
                          setSelectedSeats(newSeats);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Tanggal Lahir (Opsional)</Label>
                      <Input 
                        type="date"
                        value={seat.birthDate}
                        onChange={(e) => {
                          const newSeats = [...selectedSeats];
                          newSeats[index].birthDate = e.target.value;
                          setSelectedSeats(newSeats);
                        }}
                      />
                    </div>
                    <button
                      className="w-full px-4 py-2 text-sm border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50"
                      onClick={() => {
                        setCurrentPassengerIndex(index);
                        setShowSeatModal(true);
                      }}
                    >
                      {seat.seatNumber ? `Kursi ${seat.seatNumber}` : 'Pilih Kursi'}
                    </button>
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}

        {/* Modal Pilih Kursi */}
        <Dialog
          open={showSeatModal}
          onClose={() => setShowSeatModal(false)}
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-30" />

            <Dialog.Panel className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Pilih Kursi</h3>
              
              {/* Layout Denah Bus */}
              <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-sm">Depan</span>
                  <span className="text-sm">Supir</span>
                </div>
                
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: 8 }).map((_, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                      {/* Kursi kiri (kolom 1-2) */}
                      {[0, 1].map((colOffset) => {
                        const seatIndex = rowIndex * 4 + colOffset;
                        const seat = busSeats[seatIndex];
                        return (
                          <button
                            key={`left-${colOffset}`}
                            disabled={!seat?.isAvailable || selectedSeats.some(s => s.seatNumber === seat?.number)}
                            className={`
                              p-2 text-sm rounded-lg border transition-all
                              ${seat?.isAvailable 
                                ? selectedSeats.some(s => s.seatNumber === seat?.number)
                                  ? 'bg-primary-500 text-white border-primary-500'
                                  : 'hover:border-primary-500 hover:bg-primary-50'
                                : 'bg-neutral-100 cursor-not-allowed'
                              }
                            `}
                            onClick={() => {
                              if (seat) {
                                const newSeats = [...selectedSeats];
                                newSeats[currentPassengerIndex].seatNumber = seat.number;
                                setSelectedSeats(newSeats);
                              }
                            }}
                          >
                            {seat?.number || ''}
                          </button>
                        );
                      })}

                      {/* Lorong (kolom 3) */}
                      <div className="w-full h-full bg-gray-200 rounded opacity-50" />

                      {/* Kursi kanan (kolom 4-5) */}
                      {[2, 3].map((colOffset) => {
                        const seatIndex = rowIndex * 4 + colOffset;
                        const seat = busSeats[seatIndex];
                        return (
                          <button
                            key={`right-${colOffset}`}
                            disabled={!seat?.isAvailable || selectedSeats.some(s => s.seatNumber === seat?.number)}
                            className={`
                              p-2 text-sm rounded-lg border transition-all
                              ${seat?.isAvailable 
                                ? selectedSeats.some(s => s.seatNumber === seat?.number)
                                  ? 'bg-primary-500 text-white border-primary-500'
                                  : 'hover:border-primary-500 hover:bg-primary-50'
                                : 'bg-neutral-100 cursor-not-allowed'
                              }
                            `}
                            onClick={() => {
                              if (seat) {
                                const newSeats = [...selectedSeats];
                                newSeats[currentPassengerIndex].seatNumber = seat.number;
                                setSelectedSeats(newSeats);
                              }
                            }}
                          >
                            {seat?.number || ''}
                          </button>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4 flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border rounded bg-white"></div>
                    <span>Tersedia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-neutral-100 rounded"></div>
                    <span>Terisi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary-500 rounded"></div>
                    <span>Dipilih</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border rounded-lg"
                  onClick={() => setShowSeatModal(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg"
                  onClick={() => {
                    if (selectedSeats[currentPassengerIndex].seatNumber) {
                      setShowSeatModal(false);
                    }
                  }}
                >
                  Pilih Kursi
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="flex justify-end">
          <ButtonPrimary onClick={handleNextStepClick}>
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
                  <span>Rp {busDetails.price.toLocaleString()} × {selectedSeats.length}</span>
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
              <span>{busDetails.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Waktu</span>
              <span>{busDetails.departureTime} - {busDetails.arrivalTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tipe Bus</span>
              <span>{busDetails.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Jumlah Kursi</span>
              <span>{selectedSeats.length} kursi</span>
            </div>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Harga Tiket</span>
              <span>Rp {busDetails.price.toLocaleString()} × {selectedSeats.length}</span>
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

        <div className="flex justify-between">
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
    const { subtotal, serviceFee, serviceFeeLabel, total } = calculatePriceDetails(selectedPayment);

    if (paymentStatus === "success") {
      return (
        <div className="text-center space-y-8 py-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <div className="text-green-500 text-4xl">✓</div>
            </div>
            <div className="absolute -top-2 -right-2 w-full h-full">
              <div className="animate-ping w-20 h-20 bg-green-100 rounded-full opacity-75"></div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-gray-800">Pembayaran Berhasil!</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Tiket Anda telah diterbitkan dan dikirim ke email {bookingInfo.email}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl max-w-sm mx-auto">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nomor Booking</span>
                <span className="font-semibold">BK12345678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-500 font-medium">Confirmed</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{serviceFeeLabel}</span>
                  <span>Rp {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total Pembayaran</span>
                  <span className="text-primary-500">Rp {total.toLocaleString()}</span>
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

    return (
      <div className="text-center space-y-6 py-8">
        <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Menunggu Pembayaran</h3>
          <div className="bg-yellow-50 p-4 rounded-xl max-w-md mx-auto">
            <div className="space-y-3 text-sm">
              <p className="text-yellow-700">
                Mohon selesaikan pembayaran sebelum<br/>
                <span className="font-semibold">24 Mar 2024 08:00 WIB</span>
              </p>
              <div className="border-t border-yellow-200 pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{serviceFeeLabel}</span>
                  <span>Rp {serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t border-yellow-200">
                  <span>Total Pembayaran</span>
                  <span className="text-primary-500">Rp {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <ButtonPrimary onClick={handlePaymentCheck} className="min-w-[200px]">
            Cek Status Pembayaran
          </ButtonPrimary>
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
    const { subtotal, serviceFee, serviceFeeLabel, total } = calculatePriceDetails(selectedPayment);

    return (
      <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Detail Perjalanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-500">Rute</span>
              <span className="font-medium">{busDetails.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tipe Bus</span>
              <span className="font-medium">{busDetails.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Kelas</span>
              <span className="font-medium">{busDetails.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Jam Berangkat</span>
              <span className="font-medium">{busDetails.departureTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Jam Tiba</span>
              <span className="font-medium">{busDetails.arrivalTime}</span>
            </div>
            <div className="space-y-2">
              <span className="text-neutral-500">Fasilitas:</span>
              <div className="flex flex-wrap gap-2">
                {busDetails.facilities.map((facility, index) => (
                  <span key={index} className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Rincian Harga</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Harga Tiket</span>
              <span>Rp {busDetails.price.toLocaleString()} × {selectedSeats.length}</span>
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