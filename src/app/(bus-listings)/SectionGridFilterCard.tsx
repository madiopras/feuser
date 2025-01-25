import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SectionGridFilterCardProps {
  schedules: any[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  renderCard: (item: any) => React.ReactNode;
}

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
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
