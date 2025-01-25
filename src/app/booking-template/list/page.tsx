"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import apiClient from "@/lib/axios";
import { handleError } from "@/lib/utils";
import { format } from "date-fns";
import SelectSearchForm from "./components/SelectSearchForm";
import { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { GlassWater, Wifi, AirVent, Popcorn, PlugZap, Tv, MoreHorizontal, Power, Utensils, Coffee, Cookie, Bath, Armchair, Warehouse, MapPin } from "lucide-react";
import { Fragment } from "react";
import coverImage from "@/public/images/all-img/user-cover.png";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Facility {
  id: number;
  name: string;
}

interface BookingData {
  schedule_id: number;
  schedule_rute_id: number;
  departure_time: string;
  arrival_time: string;
  is_active: number;
  dari: string;
  dari_shelter: string;
  dari_id: number;
  ke: string;
  ke_shelter: string;
  ke_id: number;
  price_rute: string;
  kode_bus: string;
  nama_bus: string;
  tipe_bus: string;
  kelas_id: number;
  kelas_bus: string;
  supir: string;
  total_seats: number;
  name_facilities: string;
}

interface Filters {
  dari?: number;
  ke?: number;
  dateRange?: DateRange;
}

const BookingListPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [facilityOpen, setFacilityOpen] = useState<{ [key: string]: boolean }>({});
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const facilityIcons: { [key: string]: any } = {
    "AC": AirVent,
    "Wi-Fi": Wifi,
    "Charging Port / USB Port": Power,
    "Makanan": Utensils,
    "Minuman": Coffee,
    "Snack": Cookie,
    "Toilet": Bath,
    "Kursi Reclining:": Armchair,
    "Bagasi": Warehouse,
    "Rest Area": MapPin
  };

  const handleFacilityToggle = (id: number, isOpen: boolean) => {
    setFacilityOpen(prev => ({ ...prev, [id]: isOpen }));
  };

  // Format tanggal untuk tampilan
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleTimeString("id-ID", options);
  };

  // Format durasi perjalanan
  const calculateDuration = (departure: string, arrival: string) => {
    const start = new Date(departure);
    const end = new Date(arrival);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h`;
  };

  // Format harga
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  // Format tanggal lengkap
  const formatFullDate = (dateString: string) => {
    try {
      if (!dateString) return "-";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return format(date, "dd MMMM yyyy HH:mm");
    } catch (error) {
      return "-";
    }
  };

  // Handle pencarian data
  const fetchData = async () => {
    // Jangan fetch jika dari atau ke belum dipilih
    if (!filters.dari || !filters.ke) {
      setBookingData([]);
      return;
    }

    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 10,
        dari: filters.dari,
        ke: filters.ke,
        departure_start: filters.dateRange?.from ? format(filters.dateRange.from, "yyyy-MM-dd") : undefined,
        departure_end: filters.dateRange?.to ? format(filters.dateRange.to, "yyyy-MM-dd") : undefined,
      };

      const response = await apiClient.get("/api/admin/schedule-rutes", {
        params,
      });
      
      if (response.data.status) {
        setBookingData(response.data.data);
        setTotalPages(response.data.total_pages);
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          title: "Error",
          description: "Sesi berakhir. Silakan login kembali.",
        });
      } else {
        handleError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle perubahan filter
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // Reset page when filters change
  };

  const renderFacility = (facilityName: string) => {
    const Icon = facilityIcons[facilityName.trim()];
    return (
      <div key={facilityName} className="flex items-center gap-2 text-gray-600">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-sm">{facilityName.trim()}</span>
      </div>
    );
  };

  // Effect untuk memuat data saat parameter berubah
  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const handleBooking = (scheduleId: number) => {
    router.push(`/id/admin/bus/booking/${scheduleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Jadwal Keberangkatan</h2>
            <p className="text-gray-600 mb-8 text-lg">Temukan jadwal perjalanan yang sesuai dengan kebutuhan Anda</p>

            {/* Form Pencarian */}
            <div className="mb-10">
              <SelectSearchForm onFilterChange={handleFilterChange} />
            </div>

            {/* Card Data */}
            <div className="space-y-8">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-r-transparent"></div>
                  <p className="mt-6 text-gray-600 text-lg">Sedang memuat jadwal...</p>
                </div>
              ) : !filters.dari || !filters.ke ? (
                <div className="text-center py-20 px-4">
                  <div className="mb-6">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Pilih Rute Perjalanan</h3>
                  <p className="text-gray-600 text-lg">
                    Silakan pilih kota keberangkatan dan tujuan untuk melihat jadwal yang tersedia
                  </p>
                </div>
              ) : bookingData.length > 0 ? (
                bookingData.map((booking) => (
                  <Fragment key={booking.schedule_rute_id}>
                    <Card className="rounded-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                      <CardContent className="p-0">
                        <div 
                          className="relative h-[160px] rounded-t-2xl w-full object-cover bg-no-repeat"
                          style={{ 
                            backgroundImage: `url(${coverImage.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/60 rounded-t-2xl">
                            <div className="grid grid-cols-3 gap-4 p-6">
                              <div className="col-span-2">
                                <div className="text-sm font-medium text-white">
                                  {booking.nama_bus} - {booking.kelas_bus}
                                </div>
                                <div className="text-xs text-white mt-1">
                                  {format(new Date(booking.departure_time), "dd MMMM yyyy")}
                                </div>
                                <div className="mt-4">
                                  <div className="text-2xl font-semibold text-white mb-1">
                                    {formatDate(booking.departure_time)} - {formatDate(booking.arrival_time)} ({calculateDuration(booking.departure_time, booking.arrival_time)})
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {booking.dari} ({booking.dari_shelter}) - {booking.ke} ({booking.ke_shelter})
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <div className="backdrop-blur-sm bg-white/10 rounded-xl px-4 py-3 text-center w-32 -ml-8">
                                  {booking.total_seats === 0 ? (
                                    <>
                                      <div className="text-2xl font-bold text-gray-100">
                                        HABIS
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="text-[11px] font-medium text-white/80 tracking-wider">
                                        KURSI
                                      </div>
                                      <div className={cn(
                                        "text-3xl font-bold mt-1",
                                        booking.total_seats < 8 ? "text-red-400" :
                                        booking.total_seats <= 20 ? "text-yellow-400" :
                                        "text-blue-400"
                                      )}>
                                        {booking.total_seats}
                                      </div>
                                      <div className="text-[11px] font-medium text-white/80 tracking-wider">
                                        TERSEDIA
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="px-8 py-6">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-6 flex-1">
                              <div className="bg-white shadow-lg rounded-xl px-6 py-3 border border-gray-100">
                                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Harga Tiket</div>
                                <div className="text-xl font-bold text-gray-800 mt-1">
                                  {formatPrice(booking.price_rute)}
                                </div>
                              </div>
                              <div>
                                <div className="mb-2 flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    Fasilitas {booking.kelas_bus}
                                  </span>
                                </div>
                                {/* Desktop view */}
                                <div className="hidden md:block">
                                  <div className={cn(
                                    "flex flex-wrap items-center gap-6",
                                    facilityOpen[booking.schedule_rute_id] && "opacity-50"
                                  )}>
                                    {booking.name_facilities
                                      .split(',')
                                      .slice(0, 4)
                                      .map(renderFacility)}
                                    <Popover>
                                      <PopoverTrigger>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent align="end" className="w-[240px] p-2">
                                        <div className="grid gap-4">
                                          <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Fasilitas {booking.kelas_bus}</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                              {booking.name_facilities
                                                .split(',')
                                                .map(renderFacility)}
                                            </div>
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                                {/* Mobile view */}
                                <div className="md:hidden">
                                  <div className="flex items-center gap-4">
                                    <div className={cn(
                                      "flex items-center gap-4",
                                      facilityOpen[booking.schedule_rute_id] && "opacity-50"
                                    )}>
                                      {booking.name_facilities
                                        .split(',')
                                        .slice(0, 3)
                                        .map(renderFacility)}
                                    </div>
                                    <Popover>
                                      <PopoverTrigger>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent align="end" className="w-[240px] p-2">
                                        <div className="grid gap-4">
                                          <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Fasilitas {booking.kelas_bus}</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                              {booking.name_facilities
                                                .split(',')
                                                .map(renderFacility)}
                                            </div>
                                          </div>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <Button 
                              className="bg-primary text-white hover:bg-primary/90 w-32 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                              disabled={booking.total_seats === 0}
                              onClick={() => handleBooking(booking.schedule_rute_id)}
                            >
                              {booking.total_seats === 0 ? "Habis" : "Pesan"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Fragment>
                ))
              ) : (
                <div className="text-center py-20 px-4">
                  <div className="mb-6">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Belum Ada Jadwal</h3>
                  <p className="text-gray-600 text-lg">
                    Silakan pilih rute dan tanggal keberangkatan untuk melihat jadwal yang tersedia
                  </p>
                </div>
              )}

              {/* Pagination */}
              {bookingData.length > 0 && (
                <div className="flex justify-center mt-10">
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="hover:bg-gray-100 px-6"
                    >
                      Sebelumnya
                    </Button>
                    <div className="flex items-center px-6 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-sm font-medium">Halaman {page} dari {totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={page === totalPages}
                      className="hover:bg-gray-100 px-6"
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingListPage; 