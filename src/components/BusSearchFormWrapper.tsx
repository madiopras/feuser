"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const BusSearchForm = dynamic(() => import("./BusSearchForm"), {
  ssr: false,
});

const LoadingState = () => (
  <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-6">
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="pt-2">
        <div className="h-12 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

const BusSearchFormWrapper = () => {
  return (
    <Suspense fallback={<LoadingState />}>
      <BusSearchForm />
    </Suspense>
  );
};

export default BusSearchFormWrapper; 