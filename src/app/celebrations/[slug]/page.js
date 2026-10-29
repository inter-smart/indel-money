import { notFound } from "next/navigation";
import CelebrationSubcategories from "@/components/features/celebrations/CelebrationSubcategories";
import NoContents from "@/components/NoContents";
import { SUBCATEGORY_PAGE_SIZE } from "@/components/features/celebrations/celebrationConstants";
import { fetchCelebrationsServer } from "@/lib/fetchCalls/fetchCelebrationsServer";

const load = (slug) => fetchCelebrationsServer(`categories/${encodeURIComponent(slug)}`, { page: 1, limit: SUBCATEGORY_PAGE_SIZE });

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data } = await load(slug);
  if (!data) return { title: "Celebrations | Indel Money", robots: { index: false } };

  const title = `${data.category.title} | Celebrations | Indel Money`;
  const description = data.category.description || `Photos and videos from ${data.category.title} at Indel Money.`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/celebrations/${slug}`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website", url },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

export default async function CelebrationCategoryPage({ params }) {
  const { slug } = await params;
  const { data, notFound: missing } = await load(slug);

  if (missing) notFound();
  if (!data) return <NoContents />;

  // key: the client component keeps its paging state, so give each category a fresh instance
  return <CelebrationSubcategories key={slug} slug={slug} initialData={data} />;
}
