"use client";
import CelebrationHeader from "./CelebrationHeader";
import CelebrationSlider from "./CelebrationSlider";
import CelebrationCategoryGrid from "./CelebrationCategoryGrid";
import useCelebrationPager from "./useCelebrationPager";
import { CATEGORY_PAGE_SIZE } from "./celebrationConstants";

// Page 1: paginated category cards.
export default function CelebrationCategories({ initialData, pageContent }) {
  const { data, loading, load } = useCelebrationPager({
    path: "categories",
    initialData,
    limit: CATEGORY_PAGE_SIZE,
  });

  return (
    <section className="w-full pt-[40px] pb-[40px] xl:pb-[60px] 3xl:pb-[100px]">
      <div className="container">
        <CelebrationHeader title={pageContent?.title || "Celebrations"} description={pageContent?.description} />

        {data.sliderItems?.length > 0 && (
          <div className="w-full 2xl:pb-[100px] md:pb-[60px] pb-[40px]">
            <CelebrationSlider sliderItems={data.sliderItems} />
          </div>
        )}

        <CelebrationCategoryGrid
          items={data.categories}
          pagination={data.pagination}
          loading={loading}
          onPageChange={(page) => load(page)}
          emptyText="No celebrations to show yet."
        />
      </div>
    </section>
  );
}
