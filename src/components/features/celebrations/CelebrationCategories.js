"use client";
import CelebrationHeader from "./CelebrationHeader";
import CelebrationCard from "./CelebrationCard";
import CelebrationGrid from "./CelebrationGrid";
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

        <CelebrationGrid
          items={data.categories}
          pagination={data.pagination}
          loading={loading}
          onPageChange={(page) => load(page)}
          emptyText="No celebrations to show yet."
          renderCard={(category, index) => (
            <CelebrationCard
              key={category.slug}
              href={`/celebrations/${category.slug}`}
              title={category.title}
              image={category.cover}
              alt={category.alt}
              priority={index < 3}
              badges={[`${category.subcategoryCount} ${category.subcategoryCount === 1 ? "Album" : "Albums"}`]}
            />
          )}
        />
      </div>
    </section>
  );
}
