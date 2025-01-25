'use client';

import { useState, useEffect } from 'react';
import axios from "@/lib/axios";

// Definisi tipe untuk hasil pembayaran dari Midtrans
interface PaymentResult {
  status_code: string;
  transaction_status: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  fraud_status?: string;
}

// Definisi tipe untuk Snap.js (karena Snap.js tidak memiliki definisi tipe resmi)
interface Snap {
  pay: (
    token: string,
    options: {
      onSuccess?: (result: PaymentResult) => void;
      onPending?: (result: PaymentResult) => void;
      onError?: (result: PaymentResult) => void;
      onClose?: () => void;
    }
  ) => void;
}

// Tambahkan Snap ke window global
declare global {
  interface Window {
    snap: Snap;
  }
}

const PaymentPage: React.FC = () => {
  const [snapToken, setSnapToken] = useState<string | null>(null);

  // Fungsi untuk memproses pembayaran
  const handlePayment = async () => {
    try {
      // Panggil API Laravel untuk mendapatkan Snap Token menggunakan Axios
      const response = await axios.post('/api/admin/payment', {
        gross_amount: 100000, // Total pembayaran
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '08123456789',
      });

      const data = response.data;

      if (data.snap_token) {
        setSnapToken(data.snap_token);
      } else {
        console.error('Error mendapatkan Snap Token:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Memuat Snap.js secara dinamis
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'your-client-key'); // Ganti dengan Client Key Anda
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Menampilkan halaman pembayaran Midtrans
  useEffect(() => {
    if (snapToken) {
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log('Payment success:', result);
        },
        onPending: function (result) {
          console.log('Payment pending:', result);
        },
        onError: function (result) {
          console.log('Payment error:', result);
        },
        onClose: function () {
          console.log('Payment popup closed');
        },
      });
    }
  }, [snapToken]);

  return (
    <div>
      <h1>Proses Pembayaran</h1>
      <button onClick={handlePayment}>Proses Pembayaran</button>
    </div>
  );
};

export default PaymentPage;
