//export const dynamic = "force-dynamic";
import IndelHistory from "../../components/features/history/IndelHistory";
import YearsInception from "../../components/features/history/YearsInception";
import MobYearsInception from "../../components/features/history/MobYearsInception";
import { defaultMeta } from "@/constants/constants";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

async function fetchHistoryData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/history`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();

    if (result.status === "success") {
      return { contents: result.data?.content, images: result.data?.images, inceptions: result.data?.inceptions, error: null };
    }
    return { contents: null, images: null, inceptions: null, error: result.message };
  } catch (error) {
    return { contents: null, images: null, inceptions: null, error: "Failed to fetch history data" };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=history`, locale), {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/history-of-indel`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/history-of-indel`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/history-of-indel`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/history-of-indel`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/history-of-indel`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/history-of-indel`,
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

export default async function History() {
  const locale = await getServerLocale();
  const { contents, images, inceptions, error } = await fetchHistoryData(locale);

  if (!contents || !images || !inceptions) {
    return <div>Failed to fetch history data</div>;
  }

  return (
    <>
      <IndelHistory
        historyImages={images}
        pageTitle={contents?.page_title}
        historyDesc={contents?.history_description}
        historyTitle={contents?.history_title}
      />

      {/* Yearsinception section */}
      <div className="hidden sm:block">
        <YearsInception inceptionslides={inceptions} title={contents?.inception_title} />
      </div>
      <div className="block sm:hidden">
        <MobYearsInception inceptionslides={inceptions} title={contents?.inception_title} years={contents?.inception_count} />
      </div>
    </>
  );
}
