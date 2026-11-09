import { notFound } from "next/navigation";
import CelebrationCategories from "@/components/features/celebrations/CelebrationCategories";
import NoContents from "@/components/NoContents";
import { CATEGORY_PAGE_SIZE } from "@/components/features/celebrations/celebrationConstants";
import { fetchCelebrationsServer } from "@/lib/fetchCalls/fetchCelebrationsServer";

const defaultTitle = "Celebrations | Indel Money";
const defaultDescription = "Photos and videos from Indel Money celebrations and events.";
const url = `${process.env.NEXT_PUBLIC_SITE_URL}/celebrations`;

const load = () => fetchCelebrationsServer("categories", { page: 1, limit: CATEGORY_PAGE_SIZE });

// Title, description and keywords come from the admin Celebrations > Content page; the defaults cover an unfilled page.
export async function generateMetadata() {
  const { data } = await load();
  const content = data?.pageContent;
  const title = content?.meta_title || defaultTitle;
  const description = content?.meta_description || defaultDescription;

  return {
    title,
    description,
    ...(content?.meta_keywords ? { keywords: content.meta_keywords } : {}),
    openGraph: { title, description, type: "website", url },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: url },
  };
}

// Page 1 of the list is rendered on the server; further pages are fetched in the browser
// without changing the URL (see useCelebrationPager).
export default async function CelebrationsPage() {
  const { data, notFound: missing } = await load();

  if (missing) notFound();
  if (!data) return <NoContents />;

  return <CelebrationCategories initialData={data} pageContent={data.pageContent} />;
}
