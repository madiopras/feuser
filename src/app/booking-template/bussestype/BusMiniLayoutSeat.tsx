import React from 'react';

interface BusMiniLayoutSeatProps {
  seats: number[];
  unselectedSeats: number[];
  onSeatClick: (seatNumber: number) => void;
}

const BusMiniLayoutSeat: React.FC<BusMiniLayoutSeatProps> = ({ seats, unselectedSeats, onSeatClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-center mb-4">Mini Bus Layout</h3>
      <div className="max-w-md mx-auto">
        {/* Baris 1 - Supir dan Kursi Depan */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div 
            className={`${
              unselectedSeats.includes(seats[0]) 
                ? 'bg-gray-400' 
                : 'bg-blue-500'
            } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
            data-seat={seats[0]}
            onClick={() => onSeatClick(seats[0])}
          >
            <span className="font-medium">1</span>
          </div>
          <div className="col-span-2 bg-blue-100 rounded-lg text-center py-2">Lorong</div>
          <div className="bg-yellow-500 text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform">
            <span className="text-sm">Supir</span>
          </div>
        </div>

        {/* Baris 2 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-blue-100 rounded-lg text-center py-2">Lorong</div>
          {[2, 3, 4].map((seatNum, index) => (
            <div 
              key={index}
              className={`${
                unselectedSeats.includes(seats[seatNum - 1]) 
                  ? 'bg-gray-400' 
                  : 'bg-blue-500'
              } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
              data-seat={seats[seatNum - 1]}
              onClick={() => onSeatClick(seats[seatNum - 1])}
            >
              <span className="font-medium">{seatNum}</span>
            </div>
          ))}
        </div>

        {/* Baris 3 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div 
            className={`${
              unselectedSeats.includes(seats[4]) 
                ? 'bg-gray-400' 
                : 'bg-blue-500'
            } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
            data-seat={seats[4]}
            onClick={() => onSeatClick(seats[4])}
          >
            <span className="font-medium">5</span>
          </div>
          <div className="bg-blue-100 rounded-lg text-center py-2">Lorong</div>
          {[6, 7].map((seatNum, index) => (
            <div 
              key={index}
              className={`${
                unselectedSeats.includes(seats[seatNum - 1]) 
                  ? 'bg-gray-400' 
                  : 'bg-blue-500'
              } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
              data-seat={seats[seatNum - 1]}
              onClick={() => onSeatClick(seats[seatNum - 1])}
            >
              <span className="font-medium">{seatNum}</span>
            </div>
          ))}
        </div>

        {/* Baris 4 */}
        <div className="grid grid-cols-4 gap-3">
          <div 
            className={`${
              unselectedSeats.includes(seats[7]) 
                ? 'bg-gray-400' 
                : 'bg-blue-500'
            } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
            data-seat={seats[7]}
            onClick={() => onSeatClick(seats[7])}
          >
            <span className="font-medium">8</span>
          </div>
          <div className="bg-blue-100 rounded-lg text-center py-2">Lorong</div>
          {[9, 10].map((seatNum, index) => (
            <div 
              key={index}
              className={`${
                unselectedSeats.includes(seats[seatNum - 1]) 
                  ? 'bg-gray-400' 
                  : 'bg-blue-500'
              } text-white text-center py-3 rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer`}
              data-seat={seats[seatNum - 1]}
              onClick={() => onSeatClick(seats[seatNum - 1])}
            >
              <span className="font-medium">{seatNum}</span>
            </div>
          ))}
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

export default BusMiniLayoutSeat;
