//export const dynamic = "force-dynamic";
import Gallery from "@/components/features/gallery/Gallery";
import MobGallery from "@/components/features/gallery/MobGallery";
import NoContents from "@/components/NoContents";
import { defaultMeta } from "@/constants/constants";

async function fetchData(page = 1, type = "all", limit = 6) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/event-gallery?page=${page}&limit=${limit}&type=${type}`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const galleryData = result.data;

    if (result.status === "success") {
      return {
        contents: galleryData?.galleryPageContent,
        medias: galleryData?.galleryItems,
        sliderItems: galleryData?.mainSliderItems,
        pagination: galleryData?.pagination,
        error: null,
      };
    }

    return {
      contents: null,
      medias: null,
      sliderItems: null,
      pagination: null,
      error: result.message,
    };
  } catch (error) {
    return {
      contents: null,
      medias: null,
      sliderItems: null,
      pagination: null,
      error: "Failed to fetch gallery data",
    };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=gallery`, {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery`,
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

export default async function GalleryPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams?.page || 1;
  const type = resolvedSearchParams?.type || "all";

  const { contents, medias, sliderItems, pagination, error } = await fetchData(page, type);

  if (!contents || !medias || !sliderItems) {
    return <NoContents />;
  }

  return (
    <>
      {/* Gallery contents */}
      <div className="sm:block hidden">
        <Gallery title={contents?.title} description={contents?.description} medias={medias} sliderItems={sliderItems} pagination={pagination} />
      </div>

      {/* Gallery contents */}
      <div className="block sm:hidden">
        <MobGallery title={contents?.title} medias={medias} sliderItems={sliderItems} pagination={pagination} />
      </div>
    </>
  );
}
