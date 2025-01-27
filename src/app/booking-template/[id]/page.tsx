"use client"
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Stepper, Step, StepLabel } from "@/components/ui/steps";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import BookingBusMiniLayout from "../../../../components/bussestype/BookingBusMiniLayout";
import BookingBusLayout from "../../../../components/bussestype/BookingBusLayout";
import BookingBusVipLayout from "../../../../components/bussestype/BookingBusVipLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import apiClient from "@/lib/axios";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PhoneInput from "@/app/[lang]/components/form/phone-input";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

type Snap = {
  pay: (
    token: string,
    options: {
      onSuccess?: (result: any) => void;
      onPending?: (result: any) => void;
      onError?: (result: any) => void;
      onClose?: () => void;
    }
  ) => void;
};

type PaymentMethodType = "TUNAI" | "WHATSAPP" | "QRIS" | "";

const PAYMENT_METHODS = {
  TUNAI: "TUNAI" as PaymentMethodType,
  WHATSAPP: "WHATSAPP" as PaymentMethodType,
  QRIS: "QRIS" as PaymentMethodType,
  NONE: "" as PaymentMethodType
};

declare global {
  interface Window {
    Snap: Snap;
  }
}

const BookingPage = () => {
  const params = useParams();
  const scheduleId = params.id;
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);
  const [showValidation, setShowValidation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [passengerDetails, setPassengerDetails] = useState<Array<{
    gender: string;
    name: string;
    phone: string;
  }>>([]);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [seatData, setSeatData] = useState<{
    rute: {
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
    };
    bus: {
      bus_id: number;
      bus_number: string;
      type_bus: string;
      bus_name: string;
      capacity: number;
      class_name: string;
      cargo: number;
    };
    seats: Array<{
      seat_number: string;
      gender: string | null;
    }>;
  }>({
    rute: {
      schedule_rute_id: 0,
      route_id: 0,
      departure_time: "",
      arrival_time: "",
      price_rute: "",
      start_location_id: 0,
      end_location_id: 0,
      start_location: "",
      end_location: "",
      distance: 0
    },
    bus: {
      bus_id: 0,
      bus_number: "",
      type_bus: "",
      bus_name: "",
      capacity: 0,
      class_name: "",
      cargo: 0
    },
    seats: []
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PAYMENT_METHODS.NONE);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [tempPaymentMethod, setTempPaymentMethod] = useState<PaymentMethodType>(PAYMENT_METHODS.NONE);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [showPaymentLinkDialog, setShowPaymentLinkDialog] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentTimer, setPaymentTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Memuat Snap.js secara dinamis
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Menampilkan halaman pembayaran Midtrans
  useEffect(() => {
    if (snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log('Payment success:', result);
          handleCheckPayment();
        },
        onPending: function (result: any) {
          console.log('Payment pending:', result);
        },
        onError: function (result: any) {
          console.log('Payment error:', result);
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat memproses pembayaran"
          });
        },
        onClose: function () {
          console.log('Payment popup closed');
          handleCheckPayment();
        },
      });
    }
  }, [snapToken, bookingResponse]);

  // Fetch data kursi
  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/admin/schedule-rutes/${scheduleId}/seat`);
        setSeatData(response.data.data);
      } catch (error) {
        console.error("Error fetching seat data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data kursi. Silakan coba lagi."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatData();
  }, [scheduleId]);

  console.log(seatData);
  // Ambil tipe bus dari data bus
  const typeBus = seatData?.bus?.type_bus || "";
  
  // Konversi dan urutkan data kursi
  const sortedSeats = seatData?.seats ? [...seatData.seats].sort((a, b) => 
    parseInt(a.seat_number) - parseInt(b.seat_number)
  ) : [];
  
  const seats = sortedSeats.map(seat => parseInt(seat.seat_number));
  const bookedSeats = sortedSeats
    .filter(seat => seat.gender !== null)
    .map(seat => ({
      seatNumber: parseInt(seat.seat_number),
      gender: seat.gender as string
    }));

  const unselectedSeats = bookedSeats.map(seat => seat.seatNumber);

  const steps = [
    {
      label: "Pilih Jumlah Kursi",
      desc: "Pilih jumlah kursi yang tersedia",
      completed: activeStep > 0 || (activeStep === 2 && (paymentStatus === "PAID" || paymentMethod === PAYMENT_METHODS.TUNAI))
    },
    {
      label: "Metode Pembayaran",
      desc: "Pilih Metode Pembayaran",
      completed: activeStep > 1 || (activeStep === 2 && (paymentStatus === "PAID" || paymentMethod === PAYMENT_METHODS.TUNAI))
    },
    {
      label: "Status Pemesanan",
      desc: "Status Pemesanan",
      completed: activeStep === 2 && (paymentStatus === "PAID" || paymentMethod === PAYMENT_METHODS.TUNAI)
    }
  ];

  // Hitung kursi yang tersedia (gender null)
  const availableSeats = seatData?.seats ? seatData.seats.filter(seat => seat.gender === null).length : 0;

  // Handler untuk memilih kursi
  const handleSeatClick = (seatNumber: number) => {
    // Cek apakah kursi sudah dipesan
    if (bookedSeats.some(seat => seat.seatNumber === seatNumber)) {
      return;
    }

    setSelectedSeatNumbers(prev => {
      // Jika kursi sudah dipilih, hapus dari pilihan
      if (prev.includes(seatNumber)) {
        return prev.filter(num => num !== seatNumber);
      }
      
      // Jika belum mencapai batas jumlah kursi, tambahkan ke pilihan
      if (prev.length < selectedSeats) {
        return [...prev, seatNumber];
      }
      
      return prev;
    });
  };

  // Reset pilihan kursi saat jumlah kursi berubah
  useEffect(() => {
    setSelectedSeatNumbers([]);
    setPassengerDetails(Array(selectedSeats).fill({
      gender: "",
      name: "",
      phone: ""
    }));
  }, [selectedSeats]);

  const handlePassengerChange = (index: number, field: string, value: string) => {
    const newDetails = [...passengerDetails];
    newDetails[index] = {
      ...newDetails[index],
      [field]: value
    };
    setPassengerDetails(newDetails);
  };

  const isPassengerDataValid = () => {
    return passengerDetails.every(passenger => 
      passenger.gender.trim() !== "" && 
      passenger.name.trim() !== ""
    );
  };

  // Fungsi untuk validasi format email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleNext = async () => {
    // Tampilkan validasi untuk step 0 dan 1
    if (activeStep === 0 || activeStep === 1) {
      setShowValidation(true);
      
      // Validasi data di step 0
      if (activeStep === 0) {
        if (selectedSeatNumbers.length !== selectedSeats) {
          toast({
            title: "Peringatan",
            description: "Silakan pilih kursi sesuai jumlah yang ditentukan"
          });
          return;
        }
        
        if (!isPassengerDetailsValid()) {
          toast({
            title: "Peringatan",
            description: "Silakan lengkapi data penumpang (nama dan jenis kelamin)"
          });
          return;
        }
        
        if (!bookingData.name.trim() || !bookingData.phone.trim() || !bookingData.email.trim()) {
          toast({
            title: "Peringatan",
            description: "Silakan lengkapi data pemesan (nama, nomor HP, dan email)"
          });
          return;
        }

        if (!isValidEmail(bookingData.email)) {
          toast({
            title: "Peringatan",
            description: "Format email tidak valid"
          });
          return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else if (activeStep === 1) {
        if (!paymentMethod) {
          toast({
            title: "Peringatan",
            description: "Silakan pilih metode pembayaran"
          });
          return;
        }

        try {
          setIsSubmitting(true);
          
          // Format data untuk dikirim ke backend
          const dataToSubmit = {
            schedule_rute_id: seatData.rute.schedule_rute_id,
            seats: selectedSeatNumbers,
            passengers: passengerDetails.map((passenger, index) => ({
              seat_number: selectedSeatNumbers[index],
              gender: passenger.gender,
              name: passenger.name,
              phone: passenger.phone || ""
            })),
            booker: {
              name: bookingData.name,
              phone: bookingData.phone,
              email: bookingData.email
            },
            payment_method: paymentMethod,
            customer_type: 'ADMIN'
          };

          // Kirim data ke backend
          const response = await apiClient.post("/api/admin/booking-proses", dataToSubmit);

          if (response.data.status) {
            setBookingResponse(response.data);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          } else {
            toast({
              title: "Gagal",
              description: "Gagal menyimpan data pemesanan. Silakan coba lagi."
            });
          }
        } catch (error) {
          console.error("Error saving booking data:", error);
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setShowValidation(false);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedSeats(1);
  };

  const onSubmit = () => {
    // Format data untuk dikirim ke server
    const formattedData = passengerDetails.map(p => 
      `${p.gender},${p.name},${p.phone}`
    ).join(';');

    toast({
      title: "Pemesanan berhasil!",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-primary-foreground">Pemesanan {selectedSeats} kursi berhasil dilakukan</p>
        </div>
      ),
    });

    // Redirect ke halaman order
    router.push("/admin/bus/order");
  };

  // Fungsi untuk mengecek apakah semua field mandatory terisi
  const isPassengerDetailsValid = () => {
    return passengerDetails.every(passenger => 
      passenger.gender.trim() !== "" && 
      passenger.name.trim() !== ""
    );
  };

  const handleBookingDataChange = (field: string, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isBookingDataValid = () => {
    return bookingData.name.trim() !== "" && 
           bookingData.phone.trim() !== "" && 
           bookingData.email.trim() !== "" &&
           isValidEmail(bookingData.email);
  };

  const isFormValid = () => {
    if (activeStep === 0) {
      const isSeatsValid = selectedSeatNumbers.length === selectedSeats;
      const isPassengersValid = passengerDetails.every(passenger => 
        passenger.gender.trim() !== "" && 
        passenger.name.trim() !== ""
      );
      return isSeatsValid && isPassengersValid && isBookingDataValid();
    }
    return true;
  };

  // Fungsi untuk format tanggal cetak yang lebih sederhana
  const formatDatePrint = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('id-ID', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
  };

  // Fungsi untuk format harga
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(parseFloat(price));
  };

  // Fungsi untuk mencetak tiket
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

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
            <p style="margin: 5px 0;">${seatData.bus.bus_name}</p>
            <p style="margin: 5px 0;">${seatData.bus.class_name}</p>
          </div>
          
          <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; margin: 10px 0;">
            <p style="margin: 3px 0;">Kode Bus: ${seatData.bus.bus_number}</p>
            <p style="margin: 3px 0;">Rute: ${seatData.rute.start_location} → ${seatData.rute.end_location}</p>
            <p style="margin: 3px 0;">Berangkat: ${formatDatePrint(seatData.rute.departure_time)}</p>
            <p style="margin: 3px 0;">Sampai: ${formatDatePrint(seatData.rute.arrival_time)}</p>
          </div>

          <div style="margin: 10px 0;">
            <p style="margin: 3px 0;">Penumpang:</p>
            ${passengerDetails.map((p, i) => `
              <p style="margin: 3px 0;">${i + 1}. ${p.name} (${p.gender === 'L' ? 'Laki-laki' : 'Perempuan'})</p>
              <p style="margin: 3px 0 10px 0;"> Nomor Kursi: ${selectedSeatNumbers[i]}</p>
            `).join('')}
          </div>

          <div style="border-top: 1px dashed #000; padding-top: 5px; margin-top: 10px;">
            <p style="margin: 3px 0;">Total Pembayaran:</p>
            <p style="font-size: 14px; font-weight: bold; margin: 5px 0;">
              ${formatPrice(String(parseFloat(seatData.rute.price_rute) * passengerDetails.length))}
            </p>
            <p style="margin: 3px 0;">Metode Pembayaran: ${paymentMethod}</p>
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

    // Tunggu sampai konten dimuat
    printWindow.onload = function() {
      printWindow.print();
    };
  };

  // Tambahkan fungsi reset state
  const resetBookingState = () => {
    setActiveStep(0);
    setSelectedSeats(1);
    setSelectedSeatNumbers([]);
    setShowValidation(false);
    // Inisialisasi ulang passengerDetails dengan satu penumpang kosong
    setPassengerDetails([{
      gender: "",
      name: "",
      phone: ""
    }]);
    setBookingData({
      name: "",
      phone: "",
      email: ""
    });
    setPaymentMethod(PAYMENT_METHODS.NONE);
    setBookingResponse(null);
    setShowPaymentDialog(false);
    setTempPaymentMethod(PAYMENT_METHODS.NONE);
    setPaymentAmount("");
    setSnapToken(null);
    setShowPaymentLinkDialog(false);
    setCheckingPayment(false);
    setPaymentStatus("");
    setPaymentTimer(0);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Fetch ulang data kursi
    const fetchSeatData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/api/admin/schedule-rutes/${scheduleId}/seat`);
        setSeatData(response.data.data);
      } catch (error) {
        console.error("Error fetching seat data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data kursi. Silakan coba lagi."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeatData();
  };

  // Modifikasi handleCheckPayment untuk menangani reset
  const handleCheckPayment = async () => {
    if (!bookingResponse?.data?.booking?.id) {
      toast({
        title: "Error",
        description: "ID booking tidak ditemukan"
      });
      return;
    }

    try {
      setCheckingPayment(true);
      console.log("Checking payment for booking ID:", bookingResponse.data.booking.id);
      
      const response = await apiClient.get(`/api/admin/check-payment/${bookingResponse.data.booking.id}`);
      console.log("Payment check response:", response.data);
      
      // Update payment status dari response
      setPaymentStatus(response.data.payment_status);
      setPaymentAmount(response.data.final_price);

      // Mulai timer jika status UNPAID
      if (response.data.payment_status === "UNPAID") {
        const bookingDate = new Date(response.data.created_at);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - bookingDate.getTime()) / 1000);
        const remainingTime = 480 - diffInSeconds; // 8 menit dalam detik
        
        console.log("Timer calculation:", {
          bookingDate,
          now,
          diffInSeconds,
          remainingTime
        });
        
        if (remainingTime > 0) {
          setPaymentTimer(remainingTime);
          if (timerInterval) clearInterval(timerInterval);
          const interval = setInterval(() => {
            setPaymentTimer((prev) => {
              if (prev <= 0) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          setTimerInterval(interval);
        } else {
          // Jika waktu sudah habis, set status ke CANCELLED
          setPaymentStatus("CANCELLED");
        }
      } else {
        // Hentikan timer jika status bukan UNPAID
        if (timerInterval) {
          clearInterval(timerInterval);
          setTimerInterval(null);
        }
      }

      // Tampilkan toast sesuai status
      if (response.data.payment_status === "PAID") {
        toast({
          title: "Pembayaran Berhasil",
          description: "Pembayaran telah diterima"
        });
      } else if (response.data.payment_status === "UNPAID") {
        toast({
          title: "Pembayaran Belum Selesai",
          description: "Pelanggan belum melakukan pembayaran"
        });
      } else if (response.data.payment_status === "CANCELLED") {
        toast({
          title: "Pembayaran Dibatalkan",
          description: "Pembayaran telah dibatalkan atau kedaluwarsa"
        });
      }

    } catch (error) {
      console.error("Error checking payment:", error);
      toast({
        title: "Error",
        description: "Gagal memeriksa status pembayaran"
      });
    } finally {
      setCheckingPayment(false);
    }
  };

  // Format timer function
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePaymentMethodChange = (value: PaymentMethodType) => {
    if (value === paymentMethod) {
      // Jika metode yang sama diklik lagi, tampilkan dialog
      const totalPrice = parseFloat(seatData.rute.price_rute) * passengerDetails.length;
      setTempPaymentMethod(value);
      setPaymentAmount(totalPrice.toString());
      setShowPaymentDialog(true);
    } else if (!paymentMethod) {
      // Jika belum ada metode yang dipilih
      const totalPrice = parseFloat(seatData.rute.price_rute) * passengerDetails.length;
      setTempPaymentMethod(value);
      setPaymentAmount(totalPrice.toString());
      setShowPaymentDialog(true);
    }
    // Jika sudah ada metode yang dipilih dan berbeda, tidak melakukan apa-apa
  };

  const handlePaymentConfirm = async () => {
    const totalPrice = parseFloat(seatData.rute.price_rute) * passengerDetails.length;
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(totalPrice);

    if (tempPaymentMethod === PAYMENT_METHODS.TUNAI) {
      const inputAmount = parseFloat(paymentAmount);
      const difference = inputAmount - totalPrice;

      if (difference < 0) {
        // Jika pembayaran kurang
        const shortageAmount = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(Math.abs(difference));

        toast({
          title: "Pembayaran Kurang",
          description: `Pembayaran kurang sebesar ${shortageAmount}`,
        });
        return;
      }

      try {
        setIsSubmitting(true);
        
        // Format data untuk dikirim ke backend
        const dataToSubmit = {
          schedule_rute_id: seatData.rute.schedule_rute_id,
          seats: selectedSeatNumbers,
          passengers: passengerDetails.map((passenger, index) => ({
            seat_number: selectedSeatNumbers[index],
            gender: passenger.gender,
            name: passenger.name,
            phone: passenger.phone || ""
          })),
          booker: {
            name: bookingData.name,
            phone: bookingData.phone,
            email: bookingData.email
          },
          payment_method: tempPaymentMethod,
          customer_type: 'ADMIN',
          payment_amount: inputAmount
        };

        // Kirim data ke endpoint booking-proses untuk pembayaran tunai
        const response = await apiClient.post("/api/admin/booking-proses", dataToSubmit);

        if (response.data.status) {
          setBookingResponse(response.data);
          setPaymentMethod(tempPaymentMethod);
          setShowPaymentDialog(false);
          setActiveStep(2);

          if (difference > 0) {
            // Jika ada kembalian
            const changeAmount = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(difference);

            toast({
              title: "Pembayaran Berhasil",
              description: `Pembayaran diterima. Kembalian: ${changeAmount}`,
            });
          } else {
            // Jika pembayaran pas
            toast({
              title: "Pembayaran Berhasil",
              description: `Pembayaran sebesar ${formattedPrice} telah diterima`,
            });
          }
        } else {
          toast({
            title: "Gagal",
            description: "Gagal membuat booking. Silakan coba lagi."
          });
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi."
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (tempPaymentMethod === PAYMENT_METHODS.QRIS || tempPaymentMethod === PAYMENT_METHODS.WHATSAPP) {
      try {
        setIsSubmitting(true);
        
        const dataToSubmit = {
          schedule_rute_id: seatData.rute.schedule_rute_id,
          seats: selectedSeatNumbers,
          passengers: passengerDetails.map((passenger, index) => ({
            seat_number: selectedSeatNumbers[index],
            gender: passenger.gender,
            name: passenger.name,
            phone: passenger.phone || ""
          })),
          booker: {
            name: bookingData.name,
            phone: bookingData.phone,
            email: bookingData.email
          },
          payment_method: tempPaymentMethod,
          customer_type: 'ADMIN'
        };

        const response = await apiClient.post("/api/admin/booking-transfer", dataToSubmit);

        if (response.data.status) {
          setBookingResponse(response.data);
          if (tempPaymentMethod === PAYMENT_METHODS.QRIS) {
            setSnapToken(response.data.data.payment.token);
          }
          setPaymentMethod(tempPaymentMethod);
          setShowPaymentDialog(false);
          if (tempPaymentMethod === PAYMENT_METHODS.WHATSAPP) {
            setShowPaymentLinkDialog(true);
          }
        } else {
          toast({
            title: "Gagal",
            description: "Gagal membuat booking. Silakan coba lagi."
          });
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi."
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentDialog(false);
    setTempPaymentMethod(PAYMENT_METHODS.NONE);
    setPaymentAmount("");
    setPaymentMethod(PAYMENT_METHODS.NONE);
  };

  // Render form detail penumpang
  const renderPassengerForm = () => {
    return Array.from({ length: selectedSeats }).map((_, index) => (
      <div key={index} className="space-y-4 mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Data Penumpang {index + 1}</h3>
        
        <div className="space-y-4">
          <div>
            <Label>Jenis Kelamin</Label>
            <RadioGroup
              value={passengerDetails[index]?.gender || ""}
              onValueChange={(value) => handlePassengerChange(index, "gender", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id={`male-${index}`} />
                <Label htmlFor={`male-${index}`}>Laki-laki</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P" id={`female-${index}`} />
                <Label htmlFor={`female-${index}`}>Perempuan</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Nama Lengkap</Label>
            <Input
              value={passengerDetails[index]?.name || ""}
              onChange={(e) => handlePassengerChange(index, "name", e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div>
            <Label>Nomor HP</Label>
            <PhoneInput
              value={passengerDetails[index]?.phone || ""}
              onChange={(value) => handlePassengerChange(index, "phone", value)}
              required
            />
          </div>
        </div>
      </div>
    ));
  };

  // Render form data pemesan
  const renderBookerForm = () => (
    <div className="space-y-4 mb-6 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Data Pemesan</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Nama Lengkap</Label>
          <Input
            value={bookingData.name}
            onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>

        <div>
          <Label>Nomor HP</Label>
          <PhoneInput
            value={bookingData.phone}
            onChange={(value) => setBookingData(prev => ({ ...prev, phone: value }))}
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={bookingData.email}
            onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Masukkan email"
            required
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs>
          <BreadcrumbItem>Bus System</BreadcrumbItem>
          <BreadcrumbItem className="text-primary">Booking</BreadcrumbItem>
        </Breadcrumbs>

        {/* Informasi Rute Ringkas */}
        {!isLoading && seatData?.rute && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-gray-900">{seatData.rute.start_location}</p>
                  <p className="text-sm text-gray-500">{new Date(seatData.rute.departure_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{seatData.rute.end_location}</p>
                  <p className="text-sm text-gray-500">{new Date(seatData.rute.arrival_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{new Date(seatData.rute.departure_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm font-medium text-primary">{seatData.bus.bus_name} - {seatData.bus.class_name}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl text-default-800 font-semibold text-center mb-8">
            {steps[activeStep] && steps[activeStep].desc}
          </h2>

          <div className="max-w-5xl mx-auto">
            <Stepper current={activeStep} direction="horizontal">
              {steps.map((step) => (
                <Step 
                  key={step.label} 
                  status={step.completed ? "success" : undefined}
                  icon={step.completed ? <Check className="w-5 h-5" /> : undefined}
                >
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg">Memuat data kursi...</div>
              </div>
            ) : (
              <div className="mt-12">
                {activeStep === 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 order-1 lg:order-1">
                      <div className="bg-white rounded-lg p-6 border border-gray-200 h-full">
                        {/* Form Data Pemesanan */}
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                          <h4 className="text-lg font-medium text-default-800 mb-4">
                            Data Pemesanan
                          </h4>
                          
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>
                                  Jumlah Kursi <span className="text-red-500">*</span>
                                </Label>
                                <Select 
                                  value={selectedSeats.toString()} 
                                  onValueChange={(value) => setSelectedSeats(parseInt(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih jumlah" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4].map((num) => (
                                      <SelectItem 
                                        key={num} 
                                        value={num.toString()}
                                        disabled={num > availableSeats}
                                      >
                                        {num} Kursi
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Kursi Tersedia</Label>
                                <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                                  <span className="text-sm">{availableSeats} Kursi</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>
                                Nama Pemesan <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                value={bookingData.name}
                                onChange={(e) => handleBookingDataChange('name', e.target.value)}
                                placeholder="Masukkan nama pemesan"
                              />
                              {showValidation && bookingData.name.trim() === "" && (
                                <p className="text-sm text-red-500 mt-1">Nama pemesan harus diisi</p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>
                                  Nomor HP <span className="text-red-500">*</span>
                                </Label>
                                <PhoneInput
                                  value={bookingData.phone}
                                  onChange={(value) => handleBookingDataChange('phone', value)}
                                  placeholder="Masukkan nomor HP"
                                  required
                                />
                                {showValidation && bookingData.phone.trim() === "" && (
                                  <p className="text-sm text-red-500 mt-1">Nomor HP harus diisi</p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label>
                                  Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  value={bookingData.email}
                                  onChange={(e) => handleBookingDataChange('email', e.target.value)}
                                  placeholder="Masukkan email"
                                  type="email"
                                />
                                {showValidation && (
                                  <>
                                    {bookingData.email.trim() === "" ? (
                                      <p className="text-sm text-red-500 mt-1">Email harus diisi</p>
                                    ) : !isValidEmail(bookingData.email) && (
                                      <p className="text-sm text-red-500 mt-1">Format email tidak valid</p>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Form Detail Penumpang */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-medium text-default-800">
                              Detail Penumpang
                            </h4>
                            {selectedSeats === 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedPassengers = [...passengerDetails];
                                  updatedPassengers[0] = {
                                    ...updatedPassengers[0],
                                    name: bookingData.name,
                                    phone: bookingData.phone
                                  };
                                  setPassengerDetails(updatedPassengers);
                                }}
                                className="text-xs"
                              >
                                Salin dari Pemesan
                              </Button>
                            )}
                          </div>
                          {passengerDetails.map((passenger, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="grid gap-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium">Penumpang {index + 1}</h5>
                                  <div className="flex gap-4">
                                    <RadioGroup
                                      value={passenger.gender}
                                      onValueChange={(value) => handlePassengerChange(index, 'gender', value)}
                                      className="flex gap-2"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="L" id={`L-${index}`} />
                                        <Label htmlFor={`L-${index}`} className="text-sm">Tuan</Label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="P" id={`P-${index}`} />
                                        <Label htmlFor={`P-${index}`} className="text-sm">Nyonya</Label>
                                      </div>
                                    </RadioGroup>
                                  </div>
                                </div>
                                {showValidation && passenger.gender.trim() === "" && (
                                  <p className="text-xs text-red-500 -mt-3">Jenis kelamin harus dipilih</p>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <Label className="text-sm">
                                      Nama Lengkap <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      value={passenger.name}
                                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                      placeholder="Masukkan nama lengkap"
                                      className="h-9"
                                    />
                                    {showValidation && passenger.name.trim() === "" && (
                                      <p className="text-xs text-red-500">Nama lengkap harus diisi</p>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-sm">
                                      Nomor Telepon 
                                    </Label>
                                    <PhoneInput
                                      value={passenger.phone}
                                      onChange={(value) => handlePassengerChange(index, 'phone', value)}
                                      placeholder="Masukkan nomor telepon"
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 order-2 lg:order-2">
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-medium text-default-800 mb-4">
                          Denah Kursi - {typeBus}
                        </h4>
                        <div className="overflow-x-auto">
                          <div className="min-w-[500px]">
                            {typeBus === "Mini Bus" ? (
                              <BookingBusMiniLayout 
                                seats={seats}
                                unselectedSeats={unselectedSeats}
                                onSeatClick={handleSeatClick}
                                bookedSeats={bookedSeats}
                                selectedSeats={selectedSeatNumbers}
                              />
                            ) : typeBus === "SHD Bus" ? (
                              <BookingBusLayout 
                                seats={seats}
                                unselectedSeats={unselectedSeats}
                                onSeatClick={handleSeatClick}
                                bookedSeats={bookedSeats}
                                selectedSeats={selectedSeatNumbers}
                              />
                            ) : typeBus === "VIP Bus" ? (
                              <BookingBusVipLayout 
                                seats={seats}
                                unselectedSeats={unselectedSeats}
                                onSeatClick={handleSeatClick}
                                bookedSeats={bookedSeats}
                                selectedSeats={selectedSeatNumbers}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900 mb-6">Detail Pemesanan</h4>
                      
                      <div className="space-y-6">
                        {/* Informasi Harga */}
                        <div className="flex justify-between items-center py-3 border-b">
                          <span className="text-gray-600">Total Harga ({passengerDetails.length} Penumpang)</span>
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(String(parseFloat(seatData.rute.price_rute) * passengerDetails.length))}
                          </span>
                        </div>

                        {/* Informasi Jadwal */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <span className="text-sm text-gray-500">Tanggal Keberangkatan</span>
                            <p className="font-medium text-gray-900">{formatDate(seatData.rute.departure_time)}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Tanggal Sampai</span>
                            <p className="font-medium text-gray-900">{formatDate(seatData.rute.arrival_time)}</p>
                          </div>
                        </div>

                        {/* Informasi Bus */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <span className="text-sm text-gray-500">Kelas Bus</span>
                            <p className="font-medium text-gray-900">{seatData.bus.class_name}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Kode Bus</span>
                            <p className="font-medium text-gray-900">{seatData.bus.bus_number} - {seatData.bus.bus_name}</p>
                          </div>
                        </div>

                        {/* Informasi Rute */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-sm text-gray-500 block mb-2">Rute Perjalanan</span>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{seatData.rute.start_location}</p>
                            </div>
                            <div className="text-gray-400">→</div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{seatData.rute.end_location}</p>
                            </div>
                          </div>
                        </div>

                        {/* Detail Penumpang */}
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 mb-4">Detail Penumpang</h5>
                          <div className="space-y-4">
                            {passengerDetails.map((passenger, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-sm text-gray-500">Nama</span>
                                    <p className="font-medium text-gray-900">{passenger.name}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Jenis Kelamin</span>
                                    <p className="font-medium text-gray-900">{passenger.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metode Pembayaran */}
                        <div className="mt-6">
                          <h5 className="font-medium text-gray-900 mb-4">Metode Pembayaran</h5>
                          <div className="space-y-4">
                            <RadioGroup
                              value={paymentMethod}
                              onValueChange={handlePaymentMethodChange}
                              className="flex flex-col gap-3"
                            >
                              <div 
                                className={cn(
                                  "flex items-center justify-between p-6 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer",
                                  paymentMethod === PAYMENT_METHODS.TUNAI ? "border-primary bg-primary/5" : "border-gray-200",
                                  !!paymentMethod && paymentMethod !== PAYMENT_METHODS.TUNAI ? "opacity-50 cursor-not-allowed" : ""
                                )}
                                onClick={() => {
                                  if (!paymentMethod || paymentMethod === PAYMENT_METHODS.TUNAI) {
                                    handlePaymentMethodChange(PAYMENT_METHODS.TUNAI);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <RadioGroupItem 
                                    value={PAYMENT_METHODS.TUNAI} 
                                    id={PAYMENT_METHODS.TUNAI} 
                                    disabled={!!paymentMethod && paymentMethod !== PAYMENT_METHODS.TUNAI}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={PAYMENT_METHODS.TUNAI} className="text-xl font-medium">Tunai</Label>
                                    <p className="text-base text-gray-500">Pembayaran langsung di loket</p>
                                  </div>
                                </div>
                              </div>
                              <div 
                                className={cn(
                                  "flex items-center justify-between p-6 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer",
                                  paymentMethod === PAYMENT_METHODS.WHATSAPP ? "border-primary bg-primary/5" : "border-gray-200",
                                  !!paymentMethod && paymentMethod !== PAYMENT_METHODS.WHATSAPP ? "opacity-50 cursor-not-allowed" : ""
                                )}
                                onClick={() => {
                                  if (!paymentMethod || paymentMethod === PAYMENT_METHODS.WHATSAPP) {
                                    handlePaymentMethodChange(PAYMENT_METHODS.WHATSAPP);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <RadioGroupItem 
                                    value={PAYMENT_METHODS.WHATSAPP} 
                                    id={PAYMENT_METHODS.WHATSAPP} 
                                    disabled={!!paymentMethod && paymentMethod !== PAYMENT_METHODS.WHATSAPP}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={PAYMENT_METHODS.WHATSAPP} className="text-xl font-medium">WhatsApp</Label>
                                    <p className="text-base text-gray-500">Pembayaran via WhatsApp dengan snaptoken</p>
                                  </div>
                                </div>
                              </div>
                              <div 
                                className={cn(
                                  "flex items-center justify-between p-6 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer",
                                  paymentMethod === PAYMENT_METHODS.QRIS ? "border-primary bg-primary/5" : "border-gray-200",
                                  !!paymentMethod && paymentMethod !== PAYMENT_METHODS.QRIS ? "opacity-50 cursor-not-allowed" : ""
                                )}
                                onClick={() => {
                                  if (!paymentMethod || paymentMethod === PAYMENT_METHODS.QRIS) {
                                    handlePaymentMethodChange(PAYMENT_METHODS.QRIS);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-4 flex-1">
                                  <RadioGroupItem 
                                    value={PAYMENT_METHODS.QRIS} 
                                    id={PAYMENT_METHODS.QRIS} 
                                    disabled={!!paymentMethod && paymentMethod !== PAYMENT_METHODS.QRIS}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={PAYMENT_METHODS.QRIS} className="text-xl font-medium">Pembayaran Online</Label>
                                    <p className="text-base text-gray-500">Pembayaran menggunakan metode online</p>
                                  </div>
                                </div>
                              </div>
                            </RadioGroup>
                            {showValidation && !paymentMethod && (
                              <p className="text-sm text-red-500">Silakan pilih metode pembayaran</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="max-w-3xl mx-auto">
                    {paymentMethod === PAYMENT_METHODS.WHATSAPP ? (
                      <>
                        {paymentStatus === "PAID" ? (
                          <>
                            <div className="text-center mb-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Pembayaran Berhasil!</h3>
                              <p className="text-gray-600 mb-6">Terima kasih telah melakukan pembayaran.</p>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                              <h4 className="text-lg font-medium text-gray-900 mb-6">Detail Pemesanan</h4>
                              
                              <div className="space-y-6">
                                {/* Status Pembayaran */}
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-2">Status Pembayaran: LUNAS</h5>
                                  {paymentMethod === PAYMENT_METHODS.TUNAI ? (
                                    <>
                                      <p className="text-sm text-gray-600">Pembayaran tunai telah diterima.</p>
                                      <p className="text-sm text-green-600 font-medium mt-2">
                                        Pembayaran tunai sebesar {formatPrice(paymentAmount)} telah diterima
                                        {parseFloat(paymentAmount) > parseFloat(seatData.rute.price_rute) * passengerDetails.length && (
                                          <>. Kembalian: {formatPrice(String(parseFloat(paymentAmount) - parseFloat(seatData.rute.price_rute) * passengerDetails.length))}</>
                                        )}
                                      </p>
                                    </>
                                  ) : paymentMethod === PAYMENT_METHODS.WHATSAPP && (
                                    <>
                                      <p className="text-sm text-gray-600">Pembayaran melalui WhatsApp telah diterima.</p>
                                      <p className="text-sm text-gray-600 mt-2">ID Pembayaran: {bookingResponse?.data?.booking?.payment_id}</p>
                                    </>
                                  )}
                                </div>

                                {/* Informasi Harga */}
                                <div className="flex justify-between items-center py-3 border-b">
                                  <span className="text-gray-600">Total Harga ({passengerDetails.length} Penumpang)</span>
                                  <span className="text-lg font-semibold text-gray-900">
                                    {formatPrice(String(parseFloat(seatData.rute.price_rute) * passengerDetails.length))}
                                  </span>
                                </div>

                                {/* Informasi Jadwal */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <span className="text-sm text-gray-500">Tanggal Keberangkatan</span>
                                    <p className="font-medium text-gray-900">{formatDate(seatData.rute.departure_time)}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Tanggal Sampai</span>
                                    <p className="font-medium text-gray-900">{formatDate(seatData.rute.arrival_time)}</p>
                                  </div>
                                </div>

                                {/* Informasi Bus */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <span className="text-sm text-gray-500">Kelas Bus</span>
                                    <p className="font-medium text-gray-900">{seatData.bus.class_name}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Kode Bus</span>
                                    <p className="font-medium text-gray-900">{seatData.bus.bus_number} - {seatData.bus.bus_name}</p>
                                  </div>
                                </div>

                                {/* Informasi Rute */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <span className="text-sm text-gray-500 block mb-2">Rute Perjalanan</span>
                                  <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{seatData.rute.start_location}</p>
                                    </div>
                                    <div className="text-gray-400">→</div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{seatData.rute.end_location}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Detail Penumpang */}
                                <div className="mt-6">
                                  <h5 className="font-medium text-gray-900 mb-4">Detail Penumpang</h5>
                                  <div className="space-y-4">
                                    {passengerDetails.map((passenger, index) => (
                                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <span className="text-sm text-gray-500">Nama</span>
                                            <p className="font-medium text-gray-900">{passenger.name}</p>
                                          </div>
                                          <div>
                                            <span className="text-sm text-gray-500">Jenis Kelamin</span>
                                            <p className="font-medium text-gray-900">{passenger.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Informasi Pembayaran */}
                                {/* <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-2">Informasi Pembayaran</h5>
                                  <p className="text-sm text-gray-600">Silakan lakukan pembayaran di loket kami.</p>
                                  <p className="text-sm text-gray-600">Tunjukkan detail pemesanan ini kepada petugas.</p>
                                </div> */}

                                {/* Tombol Cetak */}
                                <div className="mt-6 flex justify-center">
                                  <Button
                                    onClick={handlePrint}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg flex items-center gap-2"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                                    </svg>
                                    Cetak Tiket
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : paymentStatus === "CANCELLED" ? (
                          <>
                            <div className="text-center mb-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </div>
                              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Pembayaran Dibatalkan</h3>
                              <p className="text-gray-600 mb-2">Pembayaran telah dibatalkan atau kedaluwarsa.</p>
                              <p className="text-gray-600">Silakan lakukan pemesanan ulang untuk melanjutkan.</p>
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                              <div className="space-y-6">
                                <div className="bg-red-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-2">Status Pembayaran: DIBATALKAN</h5>
                                  <p className="text-sm text-gray-600">Pembayaran tidak dapat diproses.</p>
                                  <p className="text-sm text-gray-600">Mohon lakukan pemesanan baru.</p>
                                </div>

                                <div className="flex justify-center">
                                  <Button
                                    onClick={resetBookingState}
                                    className="bg-primary hover:bg-primary/90 text-white"
                                  >
                                    Pesan Ulang
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-center mb-8">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              </div>
                              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Menunggu Pembayaran</h3>
                              <p className="text-gray-600 mb-2">Silakan selesaikan pembayaran melalui link yang telah dikirimkan.</p>
                              {paymentTimer > 0 && (
                                <p className="text-yellow-600 font-semibold">Waktu tersisa: {formatTimer(paymentTimer)}</p>
                              )}
                            </div>

                            <div className="bg-white rounded-lg p-6 border border-gray-200">
                              <div className="space-y-6">
                                {/* Status Pembayaran */}
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-2">Status Pembayaran: PENDING</h5>
                                  <p className="text-sm text-gray-600">Link pembayaran telah dikirim ke WhatsApp pelanggan.</p>
                                  <p className="text-sm text-gray-600">Mohon informasikan kepada pelanggan untuk segera melakukan pembayaran.</p>
                                </div>

                                {/* Link Pembayaran */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-2">Link Pembayaran</h5>
                                  <div className="mt-2 p-4 bg-white rounded border border-gray-200 font-mono text-sm break-all">
                                    {bookingResponse?.data?.booking?.redirect_url}
                                  </div>
                                  <div className="mt-4 flex justify-end space-x-4">
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        navigator.clipboard.writeText(bookingResponse?.data?.booking?.redirect_url);
                                        toast({
                                          title: "Berhasil",
                                          description: "Link pembayaran berhasil disalin"
                                        });
                                      }}
                                    >
                                      Salin Link
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        const message = `Halo, berikut adalah link pembayaran untuk pemesanan tiket bus Anda:\n\n${bookingResponse?.data?.booking?.redirect_url}\n\nSilakan klik link tersebut untuk melakukan pembayaran. Terima kasih!`;
                                        const whatsappUrl = `https://wa.me/${bookingData.phone}?text=${encodeURIComponent(message)}`;
                                        window.open(whatsappUrl, '_blank');
                                      }}
                                      className="bg-green-500 hover:bg-green-600 text-white"
                                    >
                                      Kirim Ulang ke WhatsApp
                                    </Button>
                                    <Button
                                      onClick={handleCheckPayment}
                                      disabled={checkingPayment}
                                      className="bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      {checkingPayment ? (
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                          <span>Mengecek...</span>
                                        </div>
                                      ) : (
                                        "Cek Pembayaran"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Transaksi Berhasil!</h3>
                            <p className="text-gray-600 mb-6">Terima kasih sudah melakukan pemesanan.</p>
                        </div>

                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h4 className="text-lg font-medium text-gray-900 mb-6">Detail Pemesanan</h4>
                          
                          <div className="space-y-6">
                            {/* Status Pembayaran */}
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-2">Status Pembayaran: LUNAS</h5>
                              {paymentMethod === PAYMENT_METHODS.TUNAI ? (
                                <>
                                  <p className="text-sm text-gray-600">Pembayaran tunai telah diterima.</p>
                                  <p className="text-sm text-green-600 font-medium mt-2">
                                    Pembayaran tunai sebesar {formatPrice(paymentAmount)} telah diterima
                                    {parseFloat(paymentAmount) > parseFloat(seatData.rute.price_rute) * passengerDetails.length && (
                                      <>. Kembalian: {formatPrice(String(parseFloat(paymentAmount) - parseFloat(seatData.rute.price_rute) * passengerDetails.length))}</>
                                    )}
                                  </p>
                                </>
                              ) : paymentMethod === PAYMENT_METHODS.WHATSAPP && (
                                <>
                                  <p className="text-sm text-gray-600">Pembayaran melalui WhatsApp telah diterima.</p>
                                  <p className="text-sm text-gray-600 mt-2">ID Pembayaran: {bookingResponse?.data?.booking?.payment_id}</p>
                                </>
                              )}
                            </div>

                            {/* Informasi Harga */}
                            <div className="flex justify-between items-center py-3 border-b">
                              <span className="text-gray-600">Total Harga ({passengerDetails.length} Penumpang)</span>
                              <span className="text-lg font-semibold text-gray-900">
                                {formatPrice(String(parseFloat(seatData.rute.price_rute) * passengerDetails.length))}
                              </span>
                            </div>

                            {/* Informasi Jadwal */}
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <span className="text-sm text-gray-500">Tanggal Keberangkatan</span>
                                <p className="font-medium text-gray-900">{formatDate(seatData.rute.departure_time)}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Tanggal Sampai</span>
                                <p className="font-medium text-gray-900">{formatDate(seatData.rute.arrival_time)}</p>
                              </div>
                            </div>

                            {/* Informasi Bus */}
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <span className="text-sm text-gray-500">Kelas Bus</span>
                                <p className="font-medium text-gray-900">{seatData.bus.class_name}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-500">Kode Bus</span>
                                <p className="font-medium text-gray-900">{seatData.bus.bus_number} - {seatData.bus.bus_name}</p>
                              </div>
                            </div>

                            {/* Informasi Rute */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <span className="text-sm text-gray-500 block mb-2">Rute Perjalanan</span>
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{seatData.rute.start_location}</p>
                                </div>
                                <div className="text-gray-400">→</div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{seatData.rute.end_location}</p>
                                </div>
                              </div>
                            </div>

                            {/* Detail Penumpang */}
                            <div className="mt-6">
                              <h5 className="font-medium text-gray-900 mb-4">Detail Penumpang</h5>
                              <div className="space-y-4">
                                {passengerDetails.map((passenger, index) => (
                                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-sm text-gray-500">Nama</span>
                                        <p className="font-medium text-gray-900">{passenger.name}</p>
                                      </div>
                                      <div>
                                        <span className="text-sm text-gray-500">Jenis Kelamin</span>
                                        <p className="font-medium text-gray-900">{passenger.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Informasi Pembayaran */}
                            {/* <div className="bg-yellow-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900 mb-2">Informasi Pembayaran</h5>
                              <p className="text-sm text-gray-600">Silakan lakukan pembayaran di loket kami.</p>
                              <p className="text-sm text-gray-600">Tunjukkan detail pemesanan ini kepada petugas.</p>
                            </div> */}

                            {/* Tombol Cetak */}
                            <div className="mt-6 flex justify-center">
                              <Button
                                onClick={handlePrint}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg flex items-center gap-2"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                                </svg>
                                Cetak Tiket
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  {activeStep === steps.length - 1 ? (
                    <Button
                      size="lg"
                      variant="outline"
                      color="secondary"
                      onClick={resetBookingState}
                      className="px-8"
                    >
                      Pesan Ulang
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      color="secondary"
                      onClick={handleBack}
                      className={cn("px-8", {
                        "invisible": activeStep === 0,
                      })}
                    >
                      Kembali
                    </Button>
                  )}
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className={cn("px-8", {
                      "bg-green-600 hover:bg-green-700 text-white": activeStep === steps.length - 1
                    })}
                    onClick={() => {
                      if (activeStep === steps.length - 1) {
                        onSubmit();
                      } else {
                        handleNext();
                      }
                    }}
                    disabled={
                      isSubmitting || 
                      (activeStep === 1 && !paymentMethod) ||
                      // Disable tombol saat pembayaran WhatsApp/QRIS belum selesai
                      (activeStep === 1 && 
                        (paymentMethod === PAYMENT_METHODS.WHATSAPP || paymentMethod === PAYMENT_METHODS.QRIS) && 
                        !bookingResponse?.data?.booking?.id)
                    }
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      activeStep === steps.length - 1 ? "Selesai" : "Lanjut"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className={cn(
          "sm:max-w-[600px]",
          (tempPaymentMethod === PAYMENT_METHODS.WHATSAPP || tempPaymentMethod === PAYMENT_METHODS.QRIS) && "sm:max-w-[800px]"
        )}>
          <DialogHeader>
            <DialogTitle>
              {tempPaymentMethod === PAYMENT_METHODS.TUNAI ? "Pembayaran Tunai" : 
               tempPaymentMethod === PAYMENT_METHODS.QRIS ? "Pembayaran Online" :
               "Pembayaran via WhatsApp"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Total Pembayaran</Label>
              <div className="px-3 py-2 border rounded-md bg-gray-50">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(parseFloat(seatData.rute.price_rute) * passengerDetails.length)}
              </div>
            </div>
            {tempPaymentMethod === PAYMENT_METHODS.TUNAI && (
              <div className="space-y-2">
                <Label>Jumlah Uang</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Masukkan jumlah uang"
                />
              </div>
            )}
            {(tempPaymentMethod === PAYMENT_METHODS.QRIS || tempPaymentMethod === PAYMENT_METHODS.WHATSAPP) && bookingResponse?.data?.payment && (
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-lg font-medium">Link Pembayaran</Label>
                      <div className="mt-2 p-4 bg-white rounded border border-gray-200 font-mono text-sm break-all">
                        {bookingResponse?.data?.booking?.redirect_url}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(bookingResponse?.data?.booking?.redirect_url);
                        toast({
                          title: "Berhasil",
                          description: "Link pembayaran berhasil disalin"
                        });
                      }}
                    >
                      Salin Link
                    </Button>
                    <Button
                      onClick={() => {
                        const message = `Halo, berikut adalah link pembayaran untuk pemesanan tiket bus Anda:\n\n${bookingResponse?.data?.booking?.redirect_url}\n\nSilakan klik link tersebut untuk melakukan pembayaran. Terima kasih!`;
                        const whatsappUrl = `https://wa.me/${bookingData.phone}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Kirim Ulang ke WhatsApp
                    </Button>
                    <Button
                      onClick={handleCheckPayment}
                      disabled={checkingPayment}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {checkingPayment ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Mengecek...</span>
                        </div>
                      ) : (
                        "Cek Pembayaran"
                      )}
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {tempPaymentMethod === PAYMENT_METHODS.WHATSAPP ? (
                    "Silakan klik tombol 'Kirim ke WhatsApp' untuk mengirim link pembayaran ke nomor WhatsApp pelanggan"
                  ) : (
                    "Silakan salin link pembayaran untuk melanjutkan proses pembayaran"
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {tempPaymentMethod === PAYMENT_METHODS.QRIS ? (
              bookingResponse?.data?.booking?.redirect_url ? (
                <Button 
                  onClick={() => {
                    if (!snapToken) {
                      toast({
                        title: "Error",
                        description: "Token pembayaran tidak valid"
                      });
                      return;
                    }
                    setShowPaymentDialog(false); // Tutup dialog
                    // Langsung tampilkan popup Midtrans tanpa memanggil API lagi
                    window.snap.pay(snapToken, {
                      onSuccess: function (result: any) {
                        console.log('Payment success:', result);
                        handleCheckPayment();
                      },
                      onPending: function (result: any) {
                        console.log('Payment pending:', result);
                      },
                      onError: function (result: any) {
                        console.log('Payment error:', result);
                        toast({
                          title: "Error",
                          description: "Terjadi kesalahan saat memproses pembayaran"
                        });
                      },
                      onClose: function () {
                        console.log('Payment popup closed');
                        handleCheckPayment();
                      },
                    });
                  }}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Lanjutkan Pembayaran
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handlePaymentCancel}>
                    Batal
                  </Button>
                  <Button onClick={handlePaymentConfirm}>
                    Bayar
                  </Button>
                </>
              )
            ) : (
              <>
                <Button variant="outline" onClick={handlePaymentCancel}>
                  Batal
                </Button>
                <Button onClick={handlePaymentConfirm}>
                  {tempPaymentMethod === PAYMENT_METHODS.TUNAI ? "Bayar" : "Selesai"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Link Dialog */}
      <Dialog 
        open={showPaymentLinkDialog} 
        onOpenChange={() => {}} // Hapus handler untuk mencegah penutupan dialog
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Link Pembayaran WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-lg font-medium">Link Pembayaran</Label>
              <div className="mt-2 p-4 bg-white rounded border border-gray-200 font-mono text-sm break-all">
                {bookingResponse?.data?.booking?.redirect_url}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(bookingResponse?.data?.booking?.redirect_url);
                  toast({
                    title: "Berhasil",
                    description: "Link pembayaran berhasil disalin"
                  });
                }}
              >
                Salin Link
              </Button>
              <Button
                onClick={() => {
                  const message = `Halo, berikut adalah link pembayaran untuk pemesanan tiket bus Anda:\n\n${bookingResponse?.data?.booking?.redirect_url}\n\nSilakan klik link tersebut untuk melakukan pembayaran. Terima kasih!`;
                  const whatsappUrl = `https://wa.me/${bookingData.phone}?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Kirim ke WhatsApp
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Silakan klik tombol 'Kirim ke WhatsApp' untuk mengirim link pembayaran ke nomor WhatsApp pelanggan
            </p>
          </div>
          <DialogFooter className="sm:block">
            <Button 
              onClick={() => {
                setShowPaymentLinkDialog(false);
                setActiveStep(2);
              }}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPage;