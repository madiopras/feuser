import StartRating from "@/components/StartRating";
import React, { FC } from "react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Image from "next/image";

interface CheckPaymentPageProps {
  params: { payment_id: string };
  searchParams: { status: string };
}

const CheckPaymentPage: FC<CheckPaymentPageProps> = ({ params, searchParams }) => {
  const isError = searchParams.status === 'error';

  const renderContent = () => {
    return (
      <div className="w-full flex flex-col sm:rounded-2xl space-y-10 px-0 sm:p-6 xl:p-8">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          {isError ? (
            <span className="text-red-600">Payment Failed ❌</span>
          ) : (
            "Payment Successful 🎉"
          )}
        </h2>

        <div className="border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Booking Details */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Booking Information</h3>
          <div className="flex flex-col space-y-4">
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Booking code</span>
              <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">
                {params.payment_id}
              </span>
            </div>
            <div className="flex text-neutral-6000 dark:text-neutral-300">
              <span className="flex-1">Status</span>
              <span className={`flex-1 font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {isError ? 'Failed' : 'Success'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isError ? (
            <>
              <ButtonPrimary href={`/checkout/${params.payment_id}` as any}>Try Again</ButtonPrimary>
              <ButtonPrimary href="/" className="!bg-neutral-200 hover:!bg-neutral-300 !text-neutral-700">Cancel</ButtonPrimary>
            </>
          ) : (
            <ButtonPrimary href="/">Back to Home</ButtonPrimary>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="nc-PayPage">
      <main className="container mt-11 mb-24 lg:mb-32 ">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default CheckPaymentPage;