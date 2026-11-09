"use client";
import { useRef } from "react";
import PaginationComponent from "@/components/Pagination";
import LoadingCircleSpinner from "@/components/common/LoadingCircleSpinner";

// Card grid with the paging chrome shared by pages 1 and 2: dims the list while a page loads,
// scrolls back to the top of the list on a page change.
export default function CelebrationGrid({ items = [], pagination, loading, onPageChange, renderCard, emptyText }) {
  const listRef = useRef(null);

  const changePage = (page) => {
    if (page === pagination?.currentPage) return;
    onPageChange(page);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={listRef} className="scroll-mt-[100px]">
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="text-xl text-gray-500">{emptyText}</h3>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`grid grid-cols-1 gap-[20px] sm:grid-cols-2 lg:grid-cols-3 2xl:gap-[30px] transition-opacity duration-200 ${
              loading ? "pointer-events-none opacity-50" : ""
            }`}
            aria-busy={loading}
          >
            {items.map(renderCard)}
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-start justify-center pt-[80px]">
              <LoadingCircleSpinner />
            </div>
          )}
        </div>
      )}

      <PaginationComponent totalPages={pagination?.totalPages || 1} currentPage={pagination?.currentPage || 1} onPageChange={changePage} />
    </div>
  );
}
