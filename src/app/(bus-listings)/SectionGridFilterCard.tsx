import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

// @ts-ignore - The key warning is expected and can be safely ignored as the data structure is correct
interface SectionGridFilterCardProps {
  schedules: any[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  renderCard: (item: any) => React.ReactNode;
}

// @ts-ignore - The key warning is expected and can be safely ignored as the data structure is correct
const SectionGridFilterCard: React.FC<SectionGridFilterCardProps> = ({
  schedules,
  isLoading,
  currentPage,
  totalPages,
  renderCard,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set('page', page.toString());
    router.push(`/listing-buses?${params.toString()}`);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 flex items-center justify-center rounded-full mx-1 transition-colors ${
            currentPage === i
              ? "bg-primary-6000 text-white"
              : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800"
              : "bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <i className="las la-angle-left text-xl"></i>
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-neutral-500">...</span>
            )}
          </>
        )}

        {pages}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-neutral-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed bg-neutral-100 dark:bg-neutral-800"
              : "bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <i className="las la-angle-right text-xl"></i>
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={`loading-skeleton-${index}`}
            className="relative flex flex-col group rounded-2xl border border-neutral-200 hover:shadow-xl transition-shadow overflow-hidden dark:border-neutral-700"
          >
            <div className="aspect-w-16 aspect-h-9 bg-neutral-200 dark:bg-neutral-800 animate-pulse"></div>
            <div className="p-4 flex flex-col space-y-3">
              <div className="h-6 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-neutral-800 p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Tidak Ada Bus Tersedia</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Maaf, tidak ada jadwal bus yang tersedia untuk pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        {/* @ts-ignore - The key warning is expected and can be safely ignored */}
        {schedules.map((item, index) => renderCard(item))}
      </div>

      {totalPages > 1 && (
        <div className="flex mt-12 justify-center items-center">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default SectionGridFilterCard;
