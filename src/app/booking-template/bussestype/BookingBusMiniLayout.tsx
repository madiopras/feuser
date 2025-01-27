import React from "react";
import { cn } from "@/lib/utils";

interface BookingBusMiniLayoutProps {
  seats: number[];
  unselectedSeats: number[];
  bookedSeats: {
    seatNumber: number;
    gender: string;
  }[];
  selectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

const BookingBusMiniLayout: React.FC<BookingBusMiniLayoutProps> = ({
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

  const SeatButton = ({ seatNumber }: { seatNumber: number }) => {
    const gender = getGender(seatNumber);
    const isBooked = isSeatBooked(seatNumber);
    const isSelected = isSeatSelected(seatNumber);

    console.log(`Seat ${seatNumber}:`, { gender, isBooked, isSelected });

    return (
      <div 
        className={cn(
          "relative text-center py-3 rounded-lg shadow-md transform transition-transform cursor-pointer",
          {
            "bg-blue-100 text-blue-700": gender === "L",
            "bg-pink-100 text-pink-700": gender === "P",
            "bg-slate-100 text-slate-400 cursor-not-allowed": isBooked && !gender,
            "bg-orange-500 text-white hover:scale-105": isSelected,
            "bg-white text-gray-700 border border-gray-300 hover:scale-105": !isBooked && !isSelected && !gender,
          }
        )}
        onClick={() => handleSeatClick(seatNumber)}
      >
        {isSelected && (
          <div className="absolute top-1 right-2 text-[10px]">
            {selectedSeats.indexOf(seatNumber) + 1}✓
          </div>
        )}
        <span className="font-medium">{seatNumber}</span>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="max-w-md mx-auto">
        {/* Baris 1 - Supir dan Kursi Depan */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <SeatButton seatNumber={seats[0]} />
          <div className="col-span-2 bg-gray-200 rounded-lg text-center py-2">
            <span className="text-sm">Lorong</span>
          </div>
          <div className="bg-yellow-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Supir</span>
          </div>
        </div>

        {/* Baris 2 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-200 rounded-lg text-center py-2">
            <span className="text-sm">Lorong</span>
          </div>
          {[seats[1], seats[2], seats[3]].map((seatNum, index) => (
            <SeatButton key={index} seatNumber={seatNum} />
          ))}
        </div>

        {/* Baris 3 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <SeatButton seatNumber={seats[4]} />
          <div className="bg-gray-200 rounded-lg text-center py-2">
            <span className="text-sm">Lorong</span>
          </div>
          {[seats[5], seats[6]].map((seatNum, index) => (
            <SeatButton key={index} seatNumber={seatNum} />
          ))}
        </div>

        {/* Baris 4 */}
        <div className="grid grid-cols-4 gap-3">
          <SeatButton seatNumber={seats[7]} />
          <div className="bg-gray-200 rounded-lg text-center py-2">
            <span className="text-sm">Lorong</span>
          </div>
          {[seats[8], seats[9]].map((seatNum, index) => (
            <SeatButton key={index} seatNumber={seatNum} />
          ))}
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

export default BookingBusMiniLayout; 