//export const dynamic = "force-dynamic";
import IndelCares from "@/pages/IndelCares";
import { defaultMeta } from "@/constants/constants";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

async function fetchData(page = 1, limit = 3, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/indel-cares?page=${page}&limit=${limit}`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response?.json();
    const data = result?.data;
    const pagination = result?.data?.pagination;

    if (result.status === "success") {
      return {
        content: data?.content,
        slideItems: data?.slideItems,
        nonSlideItems: data?.nonSlideItems,
        totalPages: pagination?.totalPages,
        currentPage: pagination?.currentPage,
        limit: pagination?.limit,
        error: null,
      };
    }
    return {
      content: null,
      slideItems: null,
      nonSlideItems: null,
      totalPages: null,
      currentPage: null,
      limit: null,
      error: result.message,
    };
  } catch (error) {
    return {
      content: null,
      slideItems: null,
      nonSlideItems: null,
      totalPages: null,
      currentPage: null,
      limit: null,
      error: "Failed to fetch indel data",
    };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=indelcares`, locale), {
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const meta = result.data;

    if (result.status === "success") {
      return {
        title: meta?.meta_title || defaultMeta.title,
        description: meta?.meta_description || defaultMeta.description,
        keywords: meta?.meta_keywords || defaultMeta.keywords,
        // Enhanced SEO fields
        openGraph: {
          title: meta?.og_title || meta?.meta_title || defaultMeta.title,
          description: meta?.og_description || meta?.meta_description || defaultMeta.description,
          images: meta?.og_image ? [{ url: meta.og_image, width: 1200, height: 630 }] : [],
          type: "website",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-money-cares`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/indel-money-cares`,
        },
        error: null,
      };
    }
    return {
      title: defaultMeta.title,
      description: defaultMeta.description,
      keywords: defaultMeta.keywords,
      openGraph: {
        title: defaultMeta.title,
        description: defaultMeta.description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-money-cares`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-money-cares`,
      },
      error: result.message || "No metadata found",
    };
  } catch (error) {
    return {
      title: defaultMeta.title,
      description: defaultMeta.description,
      keywords: defaultMeta.keywords,
      openGraph: {
        title: defaultMeta.title,
        description: defaultMeta.description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-money-cares`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-money-cares`,
      },

      error: result.message || "No metadata found",
    };
  }
}

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { title, description, keywords, twitter, openGraph, alternates } = await getMetaData(locale);
  return {
    title,
    description,
    keywords,
    twitter,
    openGraph,
    alternates,
  };
}

export default async function Partners({ searchParams }) {
  const { page } = (await searchParams) || 1;
  const locale = await getServerLocale();
  const { content, slideItems, nonSlideItems, totalPages, currentPage, limit, error } = await fetchData(page, undefined, locale);

  if (!content && !slideItems && !nonSlideItems) {
    return <div>Failed to fetch indel data</div>;
  }

  return (
    <IndelCares
      content={content}
      slideItems={slideItems}
      nonSlideItems={nonSlideItems}
      totalPages={totalPages}
      currentPage={currentPage}
      limit={limit}
    />
  );
}
