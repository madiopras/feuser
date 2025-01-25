import React from 'react';

interface BusVipLayoutSeatProps {
  seats: number[];
  unselectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

const BusVipLayoutSeat: React.FC<BusVipLayoutSeatProps> = ({ seats, unselectedSeats, onSeatClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-4">VIP Bus Layout</h3>
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
            // Setiap baris memiliki 3 kursi (1 + 2)
            const rowIndex = Math.floor(index / 3);
            const positionInRow = index % 3;
            const isUnselected = unselectedSeats.includes(seat);

            return (
              <React.Fragment key={index}>
                {/* Kursi kiri (1 kursi) */}
                {positionInRow === 0 && (
                  <div 
                    className={`${
                      isUnselected 
                        ? 'bg-gray-400' 
                        : 'bg-blue-500'
                    } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
                    data-seat={seat}
                    onClick={() => onSeatClick(seat)}
                  >
                    <span className="font-medium">{seat}</span>
                  </div>
                )}

                {/* Lorong (setelah kursi kiri) */}
                {positionInRow === 0 && (
                  <div className="bg-blue-100 rounded-lg text-center py-2">
                    <span className="text-sm">Lorong</span>
                  </div>
                )}

                {/* Kursi kanan (2 kursi) */}
                {positionInRow > 0 && (
                  <div 
                    className={`${
                      isUnselected 
                        ? 'bg-gray-400' 
                        : 'bg-blue-500'
                    } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
                    data-seat={seat}
                    onClick={() => onSeatClick(seat)}
                  >
                    <span className="font-medium">{seat}</span>
                  </div>
                )}
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
        <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>Kursi Tersedia</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span>Kursi Tidak Digunakan</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 rounded mr-2"></div>
            <span>Lorong</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusVipLayoutSeat;