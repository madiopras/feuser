"use client"

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/lib/axios";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";
import { toast, Toaster } from "sonner";

interface BookingData {
  booking_id: number;
  payment_id: string;
  name: string;
  email: string;
  phone_number: string;
  booking_date: string;
  payment_status: string;
  final_price: string;
  customer_type: string;
  redirect_url: string;
  schedule_id: number;
}

interface PassengerData {
  name: string;
  gender: string;
  phone_number: string | null;
  schedule_seat_id: number;
}

interface ScheduleInfo {
  route: string;
  bus_info: {
    kode: string;
    nama: string;
    tipe: string;
  };
  departure_time: string;
  arrival_time: string;
}

interface PaymentResponse {
  status: boolean;
  data: {
    booking: BookingData;
    schedule_info: ScheduleInfo;
    passengers: PassengerData[];
  };
}

export default function CheckPaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await apiClient.get(`/api/notifikasi/check-payment/${params.payment_id}`);
        setPaymentData(response.data);
      } catch (error) {
        console.error("Error fetching payment status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [params.payment_id]);

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const handlePrint = () => {
    // ...existing print function code...
  };

  const handleSendETicket = async () => {
    if (!paymentData?.data.booking.booking_id) return;
    
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/api/guest/e-ticket/${paymentData.data.booking.booking_id}`);
      
      if (response.data.status) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
            max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5
            transform transition-all duration-500 ease-in-out hover:shadow-2xl`}
          >
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="relative">
                    <svg className="h-12 w-12 text-green-500 animate-[ping_1s_ease-in-out]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                    </svg>
                    <svg className="h-12 w-12 text-green-500 absolute inset-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4 w-0 flex-1">
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    E-ticket Berhasil Dikirim!
                  </p>
                  <div className="space-y-2">
                    {response.data.details.whatsapp_sent && (
                      <div className="flex items-center gap-2 p-2 bg-[#25D366]/10 rounded-lg transform transition-transform duration-300 hover:scale-105">
                        <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                          <p className="text-xs text-gray-600">Terkirim ke nomor terdaftar</p>
                        </div>
                        <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    {response.data.details.email_sent && (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg transform transition-transform duration-300 hover:scale-105">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-xs text-gray-600">Terkirim ke email terdaftar</p>
                        </div>
                        <svg className="w-5 h-5 text-green-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Booking ID: {response.data.details.payment_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toast.dismiss(t)}
                  className="ml-4 flex-shrink-0 bg-white rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ), {
          duration: 6000,
          position: 'top-center',
        });
      } else {
        throw new Error('Gagal mengirim e-ticket');
      }
    } catch (error) {
      console.error('Error sending e-ticket:', error);
      toast.error('Gagal mengirim E-Ticket', {
        description: 'Mohon coba lagi dalam beberapa saat',
        action: {
          label: 'Coba Lagi',
          onClick: () => handleSendETicket()
        },
        style: { background: 'white', border: '1px solid #fee2e2' },
        className: 'hover:shadow-lg transition-shadow duration-300'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string, paymentStatus: string) => {
    if (status === "error" || paymentStatus === "CANCELLED") {
      return {
        bgColor: "bg-red-50",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        textColor: "text-red-700",
        title: "Pembayaran Gagal",
        icon: (
          <svg className="w-8 h-8 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    } else if (paymentStatus === "PAID") {
      return {
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        textColor: "text-green-700",
        title: "Pembayaran Berhasil",
        icon: (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    } else {
      return {
        bgColor: "bg-yellow-50",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        textColor: "text-yellow-700",
        title: "Menunggu Pembayaran",
        icon: (
          <svg className="w-8 h-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      };
    }
  };

  const renderLoadingState = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute top-0 left-0 w-full h-full border-[6px] border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-[6px] border-primary rounded-full animate-spin border-t-transparent"></div>
        </div>
        <div className="space-y-2">
          <p className="text-2xl text-gray-800 font-semibold animate-pulse">Mengecek Status Pembayaran</p>
          <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return renderLoadingState();
    }

    if (!paymentData) return null;

    const statusConfig = getStatusConfig(status || '', paymentData.data.booking.payment_status);

    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Error Specific Animation */}
        {(status === "error" || paymentData.data.booking.payment_status === "CANCELLED") && (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mb-8">
          {/* Status Header with Improved Mobile Layout */}
          <div className={`p-6 sm:p-8 ${statusConfig.bgColor}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center ${statusConfig.iconBg} mx-auto sm:mx-0`}>
                {statusConfig.icon}
              </div>
              <div className="text-center sm:text-left space-y-2">
                <h2 className={`text-2xl sm:text-3xl font-bold ${statusConfig.textColor}`}>
                  {statusConfig.title}
                </h2>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-600">
                  <span>Kode Booking:</span>
                  <span className="font-mono font-medium bg-white/50 px-3 py-1 rounded-full text-sm">
                    {paymentData.data.booking.payment_id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Info with Responsive Image */}
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                {/* Bus Details with Improved Mobile Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Berangkat</p>
                      <p className="text-base text-gray-900">{paymentData.data.schedule_info.departure_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tiba</p>
                      <p className="text-base text-gray-900">{paymentData.data.schedule_info.arrival_time}</p>
                    </div>
                  </div>
                </div>

                {/* Route Info */}
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-600 break-words">{paymentData.data.schedule_info.route}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid with Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Payment Details */}
            <div className="p-6 sm:p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Detail Pemesanan
              </h4>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <dl className="space-y-3">
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-600">Total Pembayaran</dt>
                      <dd className="font-medium text-gray-900">{formatPrice(paymentData.data.booking.final_price)}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-600">Status</dt>
                      <dd className={`font-medium ${statusConfig.textColor}`}>
                        {paymentData.data.booking.payment_status === "PAID" 
                          ? "Lunas" 
                          : paymentData.data.booking.payment_status === "CANCELLED"
                          ? "Dibatalkan"
                          : "Menunggu Pembayaran"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="p-6 sm:p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Detail Penumpang
              </h4>
              <div className="space-y-4">
                {paymentData.data.passengers.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-primary">Penumpang {index + 1}</span>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Kursi {passenger.schedule_seat_id}
                      </span>
                    </div>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Nama</dt>
                        <dd className="font-medium text-gray-900">{passenger.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Gender</dt>
                        <dd className="font-medium text-gray-900">
                          {passenger.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 sm:p-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4">
              {status === "error" || paymentData.data.booking.payment_status === "CANCELLED" ? (
                <>
                  <ButtonPrimary 
                    href={`/checkout?schedule_id=${paymentData.data.booking.schedule_id}&selected_seats=${paymentData.data.passengers.length}` as any}
                    className="flex-1 !bg-primary hover:!bg-primary/90 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    Coba Lagi
                  </ButtonPrimary>
                  <ButtonPrimary href="/" 
                    className="flex-1 !bg-gray-100 hover:!bg-gray-200 !text-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    Kembali
                  </ButtonPrimary>
                </>
              ) : paymentData.data.booking.payment_status === "PAID" ? (
                <>
                  <ButtonPrimary 
                    onClick={handleSendETicket}
                    className="flex-1 group relative !bg-primary hover:!bg-primary/90 transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    disabled={isLoading}
                  >
                    <div className={`absolute inset-0 bg-primary transition-transform duration-300 ${isLoading ? 'translate-x-0' : '-translate-x-full'}`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="relative flex items-center justify-center">
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                          <span>Mengirim E-Ticket...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                          </svg>
                          <span className="relative">
                            <span className="transition-transform duration-300 group-hover:inline-block group-hover:-translate-y-0.5">Kirim E-Ticket</span>
                            <span className="absolute bottom-0 left-0 w-full h-px bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                          </span>
                        </>
                      )}
                    </div>
                  </ButtonPrimary>
                  <ButtonPrimary href="/" 
                    className="flex-1 !bg-gray-100 hover:!bg-gray-200 !text-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    Kembali ke Beranda
                  </ButtonPrimary>
                </>
              ) : (
                <>
                  {paymentData.data.booking.redirect_url && (
                    <ButtonPrimary href={paymentData.data.booking.redirect_url as any}
                      className="flex-1 !bg-primary hover:!bg-primary/90 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                      Lanjutkan Pembayaran
                    </ButtonPrimary>
                  )}
                  <ButtonPrimary href="/" 
                    className="flex-1 !bg-gray-100 hover:!bg-gray-200 !text-gray-700 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    Kembali
                  </ButtonPrimary>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Toaster richColors closeButton />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      <main className="container py-8 px-4 lg:py-12 relative">
        {renderContent()}
      </main>
    </div>
  );
}