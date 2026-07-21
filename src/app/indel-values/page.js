//export const dynamic = "force-dynamic";
import IndelValueBanner from "@/components/features/about/IndelValueBanner";
import MobIndelValueBanner from "@/components/features/about/MobIndelValueBanner";
import OurValues from "@/components/features/about/OurValues";
import OurApproach from "@/components/features/about/OurApproach";
import { defaultMeta } from "@/constants/constants";

async function fetchData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/indel-values`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const indelValues = result.data;

    if (result.status === "success") {
      return {
        contents: indelValues?.indelValueContent,
        values: indelValues?.indelValues,
        propositions: indelValues?.approachPropositions,
        mobileBanners: indelValues?.mobileBanners,
        error: null,
      };
    }
    return { contents: null, values: null, propositions: null, mobileBanners: null, error: result.message };
  } catch (error) {
    return { contents: null, values: null, propositions: null, mobileBanners: null, error: "Failed to fetch history data" };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=indelValues`, {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-values`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/indel-values`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-values`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-values`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-values`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/indel-values`,
      },

      error: result.message || "No metadata found",
    };
  }
}

export async function generateMetadata() {
  const { title, description, keywords, twitter, openGraph, alternates } = await getMetaData();
  return {
    title,
    description,
    keywords,
    twitter,
    openGraph,
    alternates,
  };
}

export default async function IndelValues() {
  const { contents, values, propositions, mobileBanners, error } = await fetchData();

  if (!contents || !values || !propositions) {
    return <div>Failed to fetch Indel Values data</div>;
  }

  return (
    <>
      <div className="hidden sm:block">
        <IndelValueBanner image={contents?.banner_image} alt={contents?.image_alt} title={contents?.page_title} />
      </div>
      <div className="block sm:hidden">
        <MobIndelValueBanner mobileBanners={mobileBanners} />
      </div>

      {/* ManagementTeam contents */}
      <OurValues values={values} />

      {/* OurApproach contents */}
      <OurApproach propositions={propositions} title={contents?.approach_title} />
    </>
  );
}
