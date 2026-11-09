"use client";
import { useCallback, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/custom-tabs";
import PaginationComponent from "@/components/Pagination";
import LoadingCircleSpinner from "@/components/common/LoadingCircleSpinner";
import CelebrationHeader from "./CelebrationHeader";
import CelebrationMediaGrid from "./CelebrationMediaGrid";
import useCelebrationPager from "./useCelebrationPager";
import { MEDIA_FILTERS, MEDIA_PAGE_SIZE } from "./celebrationConstants";

const btnStyle = `
  text-[12px] sm:text-[14px] lg:text-[18px] 2xl:text-[20px]
  leading-tight uppercase text-base1 rounded-[20px] sm:rounded-[30px] overflow-hidden
  flex-1 min-w-0 w-auto px-[6px] sm:px-[12px] 2xl:px-[25px] 3xl:px-[40px]
  py-[10px] sm:py-[12px] 2xl:py-[15px] 3xl:py-[20px] h-fit
  aria-selected:text-white cursor-pointer transition-colors
  duration-200 hover:opacity-80
`
  .replace(/\s+/g, " ")
  .trim();

// Page 3: All / Photo / Video tabs over the mixed media of one subcategory, 12 per page.
// Page and tab live in component state; the address bar stays /celebrations/<category>/<subcategory>.
export default function CelebrationAlbumView({ slug, subSlug, initialData, initialType = "all" }) {
  const listRef = useRef(null);
  const { data, params, loading, load } = useCelebrationPager({
    path: `categories/${slug}/${subSlug}`,
    initialData,
    limit: MEDIA_PAGE_SIZE,
    initialParams: { type: initialType },
  });

  const type = params.type || "all";
  const { items, counts, pagination } = data;
  const activeFilter = MEDIA_FILTERS.find((filter) => filter.value === type) || MEDIA_FILTERS[0];

  const scrollToList = () => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Mirror the filters in the address bar (?type=video&page=2). Defaults (All, page 1) are left out, and
  // pushState keeps this on the client: no server round trip, and Back / Forward step through the filters.
  const pushFilters = (nextType, nextPage) => {
    const query = new URLSearchParams();
    if (nextType !== "all") query.set("type", nextType);
    if (nextPage > 1) query.set("page", String(nextPage));
    const search = query.toString();
    window.history.pushState(null, "", `${window.location.pathname}${search ? `?${search}` : ""}`);
  };

  const changeTab = (next) => {
    if (next === type) return;
    pushFilters(next, 1);
    load(1, { type: next }); // a new tab always starts on its first page
  };

  const changePage = (page) => {
    if (page === pagination.currentPage) return;
    pushFilters(type, page);
    load(page, { type }); // the active tab is kept while paging
    scrollToList();
  };

  // Back / Forward: load whatever the address bar now says.
  const restoreFromUrl = useCallback(() => {
    const query = new URLSearchParams(window.location.search);
    const nextType = MEDIA_FILTERS.some((filter) => filter.value === query.get("type")) ? query.get("type") : "all";
    const nextPage = Number.parseInt(query.get("page"), 10);
    load(nextPage >= 1 ? nextPage : 1, { type: nextType });
  }, [load]);

  useEffect(() => {
    window.addEventListener("popstate", restoreFromUrl);
    return () => window.removeEventListener("popstate", restoreFromUrl);
  }, [restoreFromUrl]);

  return (
    <section className="w-full pt-[40px] pb-[40px] xl:pb-[60px] 3xl:pb-[100px]">
      <div className="container">
        <CelebrationHeader title={data.subcategory.title} description={data.subcategory.description} />

        <Tabs value={type} onValueChange={changeTab} className="w-full gallTab">
          <div className="m-auto mb-[20px] flex gap-2 h-fit w-full justify-center rounded-[30px] sm:rounded-[50px] bg-white p-[8px] sm:p-[15px] shadow-[0_0_25px_0_rgba(0,0,0,0.10)] lg:max-w-[85%] xl:mb-[40px] xl:max-w-[75%] 2xl:p-[25px] 3xl:mb-[80px]">
            <TabsList className="m-auto flex h-fit w-full flex-col sm:flex-row flex-nowrap sm:flex-nowrap gap-1 sm:gap-0">
              {MEDIA_FILTERS.map((filter) => (
                <TabsTrigger key={filter.value} value={filter.value} className={btnStyle} aria-label={`Show ${filter.label}`}>
                  {/* label and count stack on narrow screens so three tabs fit on one row */}
                  <span className="text-center">
                    <span className="inline sm:block lg:inline">{filter.label}</span>{" "}
                    <span className="inline sm:block lg:inline">({counts[filter.countKey]})</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div ref={listRef} className="scroll-mt-[100px]">
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-xl text-gray-500">{activeFilter.empty}</h3>
            </div>
          ) : (
            <div className="relative">
              <div className={`transition-opacity duration-200 ${loading ? "pointer-events-none opacity-50" : ""}`} aria-busy={loading}>
                <CelebrationMediaGrid items={items} galleryKey={`${type}-${pagination.currentPage}`} />
              </div>
              {loading && (
                <div className="absolute inset-0 flex items-start justify-center pt-[80px]">
                  <LoadingCircleSpinner />
                </div>
              )}
            </div>
          )}

          <PaginationComponent totalPages={pagination.totalPages} currentPage={pagination.currentPage} onPageChange={changePage} />
        </div>
      </div>
    </section>
  );
}