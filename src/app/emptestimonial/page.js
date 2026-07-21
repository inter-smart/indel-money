//export const dynamic = "force-dynamic";
import Testimonial from "@/pages/Testimonials";
import { defaultMeta } from "@/constants/constants";

async function fetchData(page = 1, limit = 10, type = "all") {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/testimonials?page=${page}&limit=${limit}&type=${type}`,
      {
        // cache: "no-store", // Ensure fresh data
        cache: "force-cache",
        next: { revalidate: 600 },
      }
    );

    const result = await response.json();

    if (result.status === "success") {
      return {
        contents: result.data?.content,
        testimonials: result.data?.testimonials,
        pagination: result.data?.pagination,
        error: null, // ← Fixed: should be null on success
      };
    }

    return {
      contents: null,
      testimonials: null,
      pagination: null,
      error: result.message || "Failed to fetch ombudsman data",
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      contents: null,
      testimonials: null,
      pagination: null,
      error: "Failed to fetch ombudsman data",
    };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=testimonials`, {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/emptestimonial`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/emptestimonial`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/emptestimonial`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/emptestimonial`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/emptestimonial`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/emptestimonial`,
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

export default async function EmployeeTestimonial({ searchParams }) {
  const page = (await searchParams?.page) || 1;
  const type = (await searchParams?.type) || "all";

  const { testimonials, pagination, contents, error } = await fetchData(page, 2, type);

  if (error) {
    return <div>{error}</div>;
  }

  return <Testimonial testimonials={testimonials} pagination={pagination} contents={contents} />;
}
