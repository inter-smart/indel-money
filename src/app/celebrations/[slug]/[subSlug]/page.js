import { notFound } from "next/navigation";
import CelebrationAlbumView from "@/components/features/celebrations/CelebrationAlbumView";
import NoContents from "@/components/NoContents";
import { MEDIA_FILTERS, MEDIA_PAGE_SIZE } from "@/components/features/celebrations/celebrationConstants";
import { fetchCelebrationsServer } from "@/lib/fetchCalls/fetchCelebrationsServer";

// ?type=image|video&page=2 -> the tab and page to render first; anything else falls back to All / page 1.
const filtersFrom = (query = {}) => {
  const type = MEDIA_FILTERS.some((filter) => filter.value === query.type) ? query.type : "all";
  const page = Number.parseInt(query.page, 10);
  return { type, page: page >= 1 ? page : 1 };
};

const load = (slug, subSlug, { type, page } = { type: "all", page: 1 }) =>
  fetchCelebrationsServer(`categories/${encodeURIComponent(slug)}/${encodeURIComponent(subSlug)}`, {
    page,
    limit: MEDIA_PAGE_SIZE,
    type,
  });

export async function generateMetadata({ params }) {
  const { slug, subSlug } = await params;
  const { data } = await load(slug, subSlug);
  if (!data) return { title: "Celebrations | Indel Money", robots: { index: false } };

  const title = `${data.subcategory.title} | ${data.category.title} | Indel Money`;
  const description = data.subcategory.description || `Photos and videos from ${data.subcategory.title}.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/celebrations/${slug}/${subSlug}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", url },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

export default async function CelebrationAlbumPage({ params, searchParams }) {
  const { slug, subSlug } = await params;
  const filters = filtersFrom(await searchParams);
  const { data, notFound: missing } = await load(slug, subSlug, filters);

  if (missing) notFound();
  if (!data) return <NoContents />;

  return <CelebrationAlbumView key={`${slug}/${subSlug}`} slug={slug} subSlug={subSlug} initialData={data} initialType={filters.type} />;
}
