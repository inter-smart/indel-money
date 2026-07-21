import NcdInfo from "@/components/features/ncd-issues/NcdInfo";
import NoContents from "@/components/NoContents";
import { defaultMeta } from "@/constants/constants";

async function fetchNcdData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/ncd-forms`, {
      cache: "force-cache",
      next: { revalidate: 600 }, // revalidate cache every 10 minutes
    });

    const result = await res.json();

    if (result.status === "success") {
      return {
        data: result.data,
        error: null,
      };
    }
    return { data: null, error: result.message || "Failed to fetch NCD data" };
  } catch (error) {
    return { data: null, error: "Failed to fetch NCD data" };
  }
}

async function getMetaData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=ncd`);
    const result = await res.json();

    if (result.status === "success") {
      const meta = result.data;
      return {
        title: meta?.meta_title || defaultMeta.ncdPage.title,
        description: meta?.meta_description || defaultMeta.ncdPage.description,
        keywords: meta?.meta_keywords || defaultMeta.ncdPage.keywords,
        openGraph: {
          title: meta?.og_title || meta?.meta_title || defaultMeta.ncdPage.title,
          description: meta?.og_description || meta?.meta_description || defaultMeta.ncdPage.description,
          images: meta?.og_image ? [{ url: meta.og_image, width: 1200, height: 630 }] : [],
          type: "website",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/ncd`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.ncdPage.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.ncdPage.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/ncd`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/ncd`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/ncd`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/ncd`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/ncd`,
      },
      error: "Failed to fetch metadata",
    };
  }
}

// Generate metadata for SEO
export async function generateMetadata() {
  const meta = await getMetaData();
  return meta;
}

export default async function NcdPage() {
  const { data, error } = await fetchNcdData();

  if (!data) {
    return <NoContents />;
  }

  return <NcdInfo content={data} error={error} />;
}
