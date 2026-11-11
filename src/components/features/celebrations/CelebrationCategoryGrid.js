"use client";
import { useMemo, useRef } from "react";
import PaginationComponent from "@/components/Pagination";
import LoadingCircleSpinner from "@/components/common/LoadingCircleSpinner";
import CelebrationCard from "./CelebrationCard";

const GROUP_SIZE = 3;

const count = (value, singular) => `${value} ${singular}${value === 1 ? "" : "s"}`;

// Gallery-style masonry grid for the /celebrations categories list: groups of 3 (one big + two small),
// alternating sides per group, same layout as Gallery.js's GalleryGrid but for category cards.
export default function CelebrationCategoryGrid({ items = [], pagination, loading, onPageChange, emptyText }) {
  const listRef = useRef(null);

  const groups = useMemo(
    () => Array.from({ length: Math.ceil(items.length / GROUP_SIZE) }, (_, i) => items.slice(i * GROUP_SIZE, i * GROUP_SIZE + GROUP_SIZE)),
    [items]
  );

  const changePage = (page) => {
    if (page === pagination?.currentPage) return;
    onPageChange(page);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderCard = (category, priority) => (
    <CelebrationCard
      href={`/celebrations/${category.slug}`}
      title={category.title}
      image={category.cover}
      alt={category.alt}
      priority={priority}
      className="h-full w-full"
      badges={[count(category.subcategoryCount, "Album")]}
    />
  );

  return (
    <div ref={listRef} className="scroll-mt-[100px]">
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="text-xl text-gray-500">{emptyText}</h3>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`mx-auto flex flex-wrap transition-opacity duration-200 ${loading ? "pointer-events-none opacity-50" : ""}`}
            aria-busy={loading}
          >
            {groups.map((group, index) => {
              const reversed = index % 2 === 1;
              return (
                <div
                  key={`celebration-group-${index}`}
                  className={`${reversed ? "flex-col-reverse" : "flex-col"} w-full lg:w-1/2 mb-2 h-[400px] md:h-[468px] xl:h-[545px] 2xl:h-[640px] 3xl:h-[815px] flex flex-wrap`}
                >
                  <div className="flex flex-wrap w-full p-2 h-[40%] md:h-[50%] xl:h-[42%]">
                    {group.slice(0, 1).map((category) => (
                      <div key={category.slug} className="w-full mb-4 h-full">
                        {renderCard(category, index < 2)}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap w-full h-[60%] md:h-[50%] xl:h-[58%]">
                    {group.slice(1, 3).map((category) => (
                      <div key={category.slug} className="w-1/2 p-2 h-full">
                        {renderCard(category, false)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {loading && (
            <div className="absolute inset-0 flex items-start justify-center pt-[80px]">
              <LoadingCircleSpinner full={false} />
            </div>
          )}
        </div>
      )}

      <PaginationComponent totalPages={pagination?.totalPages || 1} currentPage={pagination?.currentPage || 1} onPageChange={changePage} />
    </div>
  );
}
