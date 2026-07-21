//export const dynamic = "force-dynamic";

import { Suspense, memo } from "react";
import CSRItem from "@/components/csr/CsrItem";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import {
  Pagination,
} from "@/components/ui/pagination";
import MobLatestUpdates from "../../components/features/home/MobLatestUpdates";
import LatestUpdates from "../../components/features/home/LatestUpdates";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

async function fetchCsrData(page = 1, limit = 10, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/csr?page=${page}&limit=${limit}`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const result = await response.json();
    if (result.status === "success") {
      const { content, sliderItems, csr, pagination } = result.data || {};
      return {
        content,
        sliderData: sliderItems,
        csr,
        pagination: pagination || { currentPage: 1, totalPages: 1, totalItems: 0 },
        error: null,
      };
    }
    return {
      content: null,
      sliderData: null,
      csr: null,
      pagination: null,
      error: result.message,
    };
  } catch (error) {
    return {
      content: null,
      sliderData: null,
      csr: null,
      pagination: null,
      error: "Failed to fetch CSR data. Please try again.",
    };
  }
}

export async function generateMetadata({ params }) {
  const page = parseInt(params?.page) || 1;
  const locale = await getServerLocale();
  const { content, error } = await fetchCsrData(page, 10, locale);
  // ... metadata logic (same as original)
}

const PaginationItems = memo(({ currentPage, totalPages }) => {
  // ... pagination logic (same as renderPaginationItems)
});

export default async function CSR({ searchParams }) {
  const page = (await parseInt(searchParams?.page)) || 1;
  const limit = 10;
  const locale = await getServerLocale();
  const { content, csr, sliderData, pagination, error } = await fetchCsrData(page, limit, locale);
  // if (error) {
  //   return (
  //     <div className="container py-10">
  //       <h1>Error Loading CSR</h1>
  //       <p>{error}</p>
  //       <button onClick={() => window.location.reload()} className="mt-4
  // }

  if (!content && !csr && !sliderData) {
    return (
      <div className="container py-10">
        <h1>No CSR Data Available</h1>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="w-full block pt-[30px] sm:py-[20px] lg:py-[30px] 2xl:py-[50px]">
        <div className="container">
          <div className="text-title1 font-bold text-base2">{content?.title || "CSR"}</div>
          <div className="sm:block hidden">
            <PageBreadcrumb />
          </div>
        </div>
      </section>
      <div className="sm:hidden block">
        <MobLatestUpdates />
      </div>
      <div className="sm:block hidden">
        <LatestUpdates
          sliderItems={sliderData || []}
          sliderTitle={content?.slider_title || "Latest Updates"}
          sliderButtonText={content?.slider_button_text || "View All"}
          sliderButtonLink={content?.slider_button_link || "/csr"}
          type="csr"
        />
      </div>
      <section className="p-[30px_0_20px_0] 2xl:p-[40px_0_60px_0] relative z-0">
        <div className="container">
          <div className="text-sm sm:text-lg md:text-xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl text-black font-medium mb-[15px]">
            {content?.all_csr_title || "All csr"}
          </div>
          <div className="flex flex-wrap -mx-[4px] lg:-mx-[15px] sm:border-b sm:border-b-[rgb(0,0,0,18%)] 2xl:-mx-[35px] sm:pb-[20px] 2xl:pb-[50px] 2xl:mb-[40px] sm:mb-[20px]">
            {Array.isArray(csr) && csr?.length > 0 ? (
              csr?.map((item, index) => <CSRItem index={index} key={item.id || index} item={item} />)
            ) : (
              <p>No csr available.</p>
            )}
          </div>
          <Pagination aria-label="CSR pagination">
            <PaginationItems currentPage={pagination?.currentPage || 1} totalPages={pagination?.totalPages || 1} />
          </Pagination>
        </div>
      </section>
    </Suspense>
  );
}
