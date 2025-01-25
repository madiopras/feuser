import React from "react";
import { cn } from "@/lib/utils";

interface BookingBusVipLayoutProps {
  seats: number[];
  unselectedSeats: number[];
  bookedSeats: {
    seatNumber: number;
    gender: string;
  }[];
  selectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

const BookingBusVipLayout: React.FC<BookingBusVipLayoutProps> = ({
  seats,
  unselectedSeats,
  bookedSeats,
  selectedSeats,
  onSeatClick,
}) => {
  const getGender = (seatNumber: number) => {
    const bookedSeat = bookedSeats.find(seat => seat.seatNumber === seatNumber);
    return bookedSeat?.gender || null;
  };

  const isSeatBooked = (seatNumber: number) => {
    return unselectedSeats.includes(seatNumber);
  };

  const isSeatSelected = (seatNumber: number) => {
    return selectedSeats.includes(seatNumber);
  };

  const handleSeatClick = (seatNumber: number) => {
    if (!isSeatBooked(seatNumber)) {
      onSeatClick(seatNumber);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="max-w-md mx-auto">
        {/* Header - Supir dan Pintu */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-red-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Pintu</span>
          </div>
          <div className="col-span-2"></div>
          <div className="bg-yellow-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Supir</span>
          </div>
        </div>

        {/* Kursi Penumpang */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {seats.map((seat, index) => {
            const rowIndex = Math.floor(index / 3);
            const positionInRow = index % 3;
            const gender = getGender(seat);
            const isBooked = isSeatBooked(seat);
            const isSelected = isSeatSelected(seat);

            const seatButton = (
              <div 
                className={cn(
                  "relative text-center py-3 rounded-lg shadow-md transform transition-transform cursor-pointer",
                  {
                    "bg-blue-100 text-blue-700 border-blue-500": gender === "L",
                    "bg-pink-100 text-pink-700 border-pink-500": gender === "P",
                    "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed": gender === "R",
                    "bg-orange-500 text-white hover:scale-105": isSelected,
                    "bg-white text-gray-700 border border-gray-300 hover:scale-105": !isBooked && !isSelected && !gender,
                  }
                )}
                onClick={() => gender !== "R" && handleSeatClick(seat)}
              >
                {isSelected && (
                  <div className="absolute top-1 right-2 text-[10px]">
                    {selectedSeats.indexOf(seat) + 1}✓
                  </div>
                )}
                <span className="font-medium">{seat}</span>
              </div>
            );

            return (
              <React.Fragment key={index}>
                {/* Kursi kiri (1 kursi) */}
                {positionInRow === 0 && seatButton}

                {/* Lorong (setelah kursi kiri) */}
                {positionInRow === 0 && (
                  <div className="bg-gray-200 rounded-lg text-center py-2">
                    <span className="text-sm">Lorong</span>
                  </div>
                )}

                {/* Kursi kanan (2 kursi) */}
                {positionInRow > 0 && seatButton}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer - Toilet dan Pintu Belakang */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-red-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Pintu</span>
          </div>
          <div className="col-span-2"></div>
          <div className="bg-green-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Toilet</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
            <span className="text-sm">Laki-laki</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-100 border border-pink-500 rounded"></div>
            <span className="text-sm">Perempuan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded"></div>
            <span className="text-sm">Tidak Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-sm">Kursi Kosong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">Kursi Terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm">Lorong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingBusVipLayout; 