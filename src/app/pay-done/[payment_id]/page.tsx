"use client"

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, Printer } from "lucide-react";

interface BookingData {
  payment_id: string;
  name: string;
  email: string;
  phone_number: string;
  booking_date: string;
  payment_status: string;
  final_price: string;
  customer_type: string;
  redirect_url: string;
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
    const printWindow = window.open('', '_blank');
    if (!printWindow || !paymentData) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tiket Bus</title>
          <style>
            body {
              width: 80mm;
              padding: 5mm;
              margin: 0 auto;
              font-family: 'Courier New', monospace;
              font-size: 12px;
            }
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                width: 72mm;
              }
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 10px;">
            <h2 style="font-size: 14px; margin: 0;">TIKET BUS</h2>
            ${paymentData.data.schedule_info.bus_info.nama !== 'N/A' ? `
              <p style="margin: 5px 0;">${paymentData.data.schedule_info.bus_info.nama}</p>
              <p style="margin: 5px 0;">${paymentData.data.schedule_info.bus_info.tipe}</p>
            ` : ''}
          </div>
          
          <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; margin: 10px 0;">
            ${paymentData.data.schedule_info.route !== 'N/A' ? `
              <p style="margin: 3px 0;">Kode Bus: ${paymentData.data.schedule_info.bus_info.kode}</p>
              <p style="margin: 3px 0;">Rute: ${paymentData.data.schedule_info.route}</p>
              <p style="margin: 3px 0;">Berangkat: ${paymentData.data.schedule_info.departure_time}</p>
              <p style="margin: 3px 0;">Sampai: ${paymentData.data.schedule_info.arrival_time}</p>
            ` : '<p style="margin: 3px 0; font-style: italic;">Informasi perjalanan belum tersedia</p>'}
          </div>

          <div style="margin: 10px 0;">
            <p style="margin: 3px 0;">Penumpang:</p>
            ${paymentData.data.passengers.map((p, i) => `
              <p style="margin: 3px 0;">${i + 1}. ${p.name} (${p.gender === 'L' ? 'Laki-laki' : 'Perempuan'})</p>
              <p style="margin: 3px 0 10px 0;"> Nomor Kursi: ${p.schedule_seat_id}</p>
            `).join('')}
          </div>

          <div style="border-top: 1px dashed #000; padding-top: 5px; margin-top: 10px;">
            <p style="margin: 3px 0;">Total Pembayaran:</p>
            <p style="font-size: 14px; font-weight: bold; margin: 5px 0;">
              ${formatPrice(paymentData.data.booking.final_price)}
            </p>
            <p style="margin: 3px 0;">Status: ${paymentData.data.booking.payment_status === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}</p>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            <p style="margin: 3px 0;">Terima kasih telah menggunakan jasa kami</p>
            <p style="margin: 3px 0;">Selamat menikmati perjalanan Anda</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = function() {
      printWindow.print();
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Mengecek status pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === "success" || paymentData?.data.booking.payment_status === "PAID" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Pembayaran Berhasil!</h2>
              <p className="text-gray-600 mb-6">Terima kasih telah melakukan pembayaran.</p>
              
              <div className="space-y-6 text-left">
                {/* Detail Pembayaran */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">ID Pembayaran</p>
                    <p className="font-medium">{paymentData?.data.booking.payment_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="font-medium">{formatPrice(paymentData?.data.booking.final_price || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Booking</p>
                    <p className="font-medium">
                      {new Date(paymentData?.data.booking.booking_date || '').toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Detail Pemesan */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900">Detail Pemesan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama</p>
                      <p className="font-medium">{paymentData?.data.booking.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{paymentData?.data.booking.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">No. Telepon</p>
                      <p className="font-medium">{paymentData?.data.booking.phone_number}</p>
                    </div>
                  </div>
                </div>

                {/* Detail Penumpang */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900">Detail Penumpang</h3>
                  <div className="space-y-4">
                    {paymentData?.data.passengers.map((passenger, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-white rounded-lg">
                        <div>
                          <p className="text-sm text-gray-500">Nama</p>
                          <p className="font-medium">{passenger.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Jenis Kelamin</p>
                          <p className="font-medium">{passenger.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Nomor Kursi</p>
                          <p className="font-medium">{passenger.schedule_seat_id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detail Jadwal */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900">Informasi Perjalanan</h3>
                  {paymentData?.data.schedule_info.route !== 'N/A' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Rute</p>
                        <p className="font-medium">{paymentData?.data.schedule_info.route}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Bus</p>
                        <p className="font-medium">{paymentData?.data.schedule_info.bus_info.nama}</p>
                        <p className="text-sm text-gray-500">{paymentData?.data.schedule_info.bus_info.kode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Waktu Berangkat</p>
                        <p className="font-medium">{paymentData?.data.schedule_info.departure_time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Waktu Tiba</p>
                        <p className="font-medium">{paymentData?.data.schedule_info.arrival_time}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Informasi perjalanan belum tersedia</p>
                  )}
                </div>

                {/* Tombol Cetak */}
                <div className="mt-6">
                  <Button
                    onClick={handlePrint}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Tiket
                  </Button>
                </div>
              </div>
            </div>
          ) : status === "error" || paymentData?.data.booking.payment_status === "CANCELLED" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Pembayaran Gagal</h2>
              <p className="text-gray-600">Mohon maaf, pembayaran Anda tidak dapat diproses.</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Menunggu Pembayaran</h2>
              <p className="text-gray-600 mb-6">Silakan selesaikan pembayaran Anda.</p>
              
              <div className="space-y-4 text-left bg-gray-50 p-4 rounded-lg mb-6">
                <div>
                  <p className="text-sm text-gray-500">ID Pembayaran</p>
                  <p className="font-medium">{paymentData?.data.booking.payment_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Pembayaran</p>
                  <p className="font-medium">{formatPrice(paymentData?.data.booking.final_price || 0)}</p>
                </div>
              </div>

              {paymentData?.data.booking.redirect_url && (
                <Button 
                  onClick={() => window.location.href = paymentData.data.booking.redirect_url}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Lanjutkan Pembayaran
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 