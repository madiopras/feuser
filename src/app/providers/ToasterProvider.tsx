"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 5000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          maxWidth: '500px'
        },
        success: {
          duration: 5000,
          iconTheme: {
            primary: '#4CAF50',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#F44336',
            secondary: '#fff',
          },
        }
      }}
    />
  );
}