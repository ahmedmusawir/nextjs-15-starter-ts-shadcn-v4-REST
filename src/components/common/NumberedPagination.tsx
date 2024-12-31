"use client";

import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";
import SpinnerSmall from "./SpinnerSmall";

const NumberedPagination = () => {
  const { currentPage, totalPages, loading } = useNumberedPaginationStore();

  // Handle page change
  // Handle page change
  const handlePageClick = ({ selected }: { selected: number }) => {
    const { setLoading } = useNumberedPaginationStore.getState();
    setLoading(true); // Show spinner
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* Mobile View */}
      <div className="flex flex-1 justify-between">
        <button
          onClick={() => useNumberedPaginationStore.getState().prevPage()}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => useNumberedPaginationStore.getState().nextPage()}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          {loading && <SpinnerSmall />} {/* Show spinner when loading */}
          {!loading && "Next"}
        </button>
      </div>
    </div>
  );
};

export default NumberedPagination;
