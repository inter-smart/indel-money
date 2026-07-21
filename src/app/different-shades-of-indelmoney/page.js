//export const dynamic = "force-dynamic";
import DifferentShadesIndelBanner from "@/components/features/about/DifferentShadesIndelBanner";
import DifferentShadesIndelSlide from "@/components/features/about/DifferentShadesIndelSlide";

import MobDifferentShadesIndelSlide from "@/components/features/about/MobDifferentShadesIndelSlide";
import { defaultMeta } from "@/constants/constants";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

async function fetchData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/shades-of-indel`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const shadesValues = result.data;

    if (result.status === "success") {
      return { contents: shadesValues?.shadesOfIndelContent, values: shadesValues?.differentShades, error: null };
    }
    return { contents: null, values: null, error: result.message };
  } catch (error) {
    return { contents: null, values: null, error: "Failed to fetch history data" };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=shades`, locale), {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/different-shades-of-indelmoney`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/different-shades-of-indelmoney`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/different-shades-of-indelmoney`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/different-shades-of-indelmoney`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/different-shades-of-indelmoney`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/different-shades-of-indelmoney`,
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

export default async function DifferentShadesIndel() {
  const locale = await getServerLocale();
  const { contents, values, error } = await fetchData(locale);

  if (!contents || !values) {
    return <div>Failed to fetch Different Shades of Indel data</div>;
  }

  return (
    <>
      <DifferentShadesIndelBanner title={contents?.page_title} />

      <div className="hidden sm:block">
        <DifferentShadesIndelSlide shades={values} />
      </div>
      <div className="block sm:hidden">
        <MobDifferentShadesIndelSlide shades={values} />
      </div>
    </>
  );
}
