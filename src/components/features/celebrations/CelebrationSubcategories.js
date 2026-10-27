"use client";
import CelebrationHeader from "./CelebrationHeader";
import CelebrationCard from "./CelebrationCard";
import CelebrationGrid from "./CelebrationGrid";
import useCelebrationPager from "./useCelebrationPager";
import { SUBCATEGORY_PAGE_SIZE } from "./celebrationConstants";

const count = (value, singular) => `${value} ${singular}${value === 1 ? "" : "s"}`;

// Page 2: paginated subcategory cards (e.g. "Onam 2020", "Pookalam") of one category.
export default function CelebrationSubcategories({ slug, initialData }) {
  const { data, loading, load } =useCelebrationPager({
    path: `categories/${slug}`,
    initialData,
    limit: SUBCATEGORY_PAGE_SIZE,
  });

  return (
    <section className="w-full pt-[40px] pb-[40px] xl:pb-[60px] 3xl:pb-[100px]">
      <div className="container">
        <CelebrationHeader title={initialData.category.title} description={initialData.category.description} />

        <CelebrationGrid
          items={data.subcategories}
          pagination={data.pagination}
          loading={loading}
          onPageChange={(page) => load(page)}
          emptyText="No albums to show yet."
          renderCard={(subcategory, index) => (
            <CelebrationCard
              key={subcategory.slug}
              href={`/celebrations/${slug}/${subcategory.slug}`}
              title={subcategory.title}
              image={subcategory.cover}
              alt={subcategory.alt}
              priority={index < 3}
              badges={[
                subcategory.photoCount > 0 && count(subcategory.photoCount, "Photo"),
                subcategory.videoCount > 0 && count(subcategory.videoCount, "Video"),
              ].filter(Boolean)}
            />
          )}
        />
      </div>
    </section>
  );
}
