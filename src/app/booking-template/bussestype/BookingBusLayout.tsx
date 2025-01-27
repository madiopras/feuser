import React from "react";
import { cn } from "@/lib/utils";

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

const BookingBusLayout: React.FC<BookingBusLayoutProps> = ({
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="max-w-md mx-auto">
        {/* Header - Supir dan Pintu */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <div className="bg-red-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Pintu</span>
          </div>
          <div className="col-span-3"></div>
          <div className="bg-yellow-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Supir</span>
          </div>
        </div>

        {/* Kursi Penumpang */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {seats.map((seat, index) => {
            // Setiap baris memiliki 4 kursi (2 + 2)
            const rowIndex = Math.floor(index / 4);
            const positionInRow = index % 4;
            const gender = getGender(seat);
            const isSelected = selectedSeats.includes(seat);

            return (
              <React.Fragment key={index}>
                {/* Kursi kiri (2 kursi) */}
                {positionInRow < 2 && (
                  <div 
                    className={cn(
                      "text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer",
                      {
                        "bg-blue-100 text-blue-700": gender === "L",
                        "bg-pink-100 text-pink-700": gender === "P",
                        "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed": gender === "R",
                        "bg-orange-500 text-white hover:scale-105 cursor-pointer": isSelected,
                        "bg-white text-gray-700 border border-gray-300 hover:scale-105 cursor-pointer": !gender && !isSelected,
                      }
                    )}
                    onClick={() => gender !== "R" && onSeatClick(seat)}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-2 text-[10px]">
                        {selectedSeats.indexOf(seat) + 1}✓
                      </div>
                    )}
                    <span className="font-medium">{seat}</span>
                  </div>
                )}

                {/* Lorong (setelah kursi kiri) */}
                {positionInRow === 1 && (
                  <div className="bg-gray-200 rounded-lg text-center py-2">
                    <span className="text-sm">Lorong</span>
                  </div>
                )}

                {/* Kursi kanan (2 kursi) */}
                {positionInRow >= 2 && (
                  <div 
                    className={cn(
                      "text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer",
                      {
                        "bg-blue-100 text-blue-700": gender === "L",
                        "bg-pink-100 text-pink-700": gender === "P",
                        "bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed": gender === "R",
                        "bg-orange-500 text-white hover:scale-105 cursor-pointer": isSelected,
                        "bg-white text-gray-700 border border-gray-300 hover:scale-105 cursor-pointer": !gender && !isSelected,
                      }
                    )}
                    onClick={() => gender !== "R" && onSeatClick(seat)}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-2 text-[10px]">
                        {selectedSeats.indexOf(seat) + 1}✓
                      </div>
                    )}
                    <span className="font-medium">{seat}</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer - Toilet dan Pintu Belakang */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-red-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Pintu</span>
          </div>
          <div className="col-span-3"></div>
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
            <div className="w-4 h-4 bg-white border border-gray-300 text-gray-400 rounded"></div>
            <span className="text-sm">Kursi Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">Kursi Terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm">Lorong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-sm">Kursi Kosong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingBusLayout; 