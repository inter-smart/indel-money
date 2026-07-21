//export const dynamic = "force-dynamic";
import BlogDetail from "@/components/features/blog/BlogDetail";
import RecentBlog from "@/components/features/blog/RecentBlog";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

// Fetch blog data for a specific post
async function fetchBlogData(slug, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/blogs/${slug}`, locale), {
      // next: { revalidate: 60 },
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    if (result.status === "success") {
      const { blog, recentBlogs, title } = result.data || {};
      return {
        data: blog,
        recentBlogs,
        title,
        error: null,
      };
    }
    return {
      data: null,
      recentBlogs: null,
      title: null,
      error: result.message,
    };
  } catch (error) {
    return { data: null, title: null, recentBlogs: null, error: "Failed to fetch blog data" };
  }
}

const defaultMetadata = (slug = "") => ({
  title: "Blog Post | My Website",
  description: "Read our latest blog post.",
  keywords: "blog, post, news",
  openGraph: {
    title: "Blog Post | My Website",
    description: "Read our latest blog post.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    type: "article",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Blog Post",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Post | My Website",
    description: "Read our latest blog post.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
  },
});

async function getMetaData(slug, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta-slug?page=blogItem&slug=${slug}`, locale));
    const result = await response.json();
    const meta = result.data;

    if (result.status === "success") {
      return {
        meta,
        error: null,
      };
    }
    return {
      meta: null,
      error: result.message,
    };
  } catch (error) {
    return {
      meta: null,
      error: "Failed to fetch service data",
    };
  }
}

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { meta, error } = await getMetaData(slug, locale);

  if (!meta || error) {
    return defaultMetadata(slug);
  }
  return {
    title: meta?.meta_title || defaultMetadata(slug).title,
    description: meta?.meta_description || meta?.description || defaultMetadata(slug).description,
    keywords: meta?.meta_keywords || defaultMetadata(slug).keywords,
    openGraph: {
      title: meta?.meta_title || meta?.title || defaultMetadata(slug).openGraph.title,
      description: meta?.meta_description || meta?.description || defaultMetadata(slug).openGraph.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
      type: "article",
      images: [
        {
          url: meta?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${meta.image}` : defaultMetadata(slug).openGraph.images[0].url,
          width: 1200,
          height: 630,
          alt: meta?.image_alt || meta?.title || defaultMetadata(slug).openGraph.images[0].alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.title || defaultMetadata(slug).twitter.title,
      description: meta?.meta_description || meta?.description || defaultMetadata(slug).twitter.description,
      images: [meta?.meta_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${meta.meta_image}` : defaultMetadata(slug).twitter.images[0]],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
  };
}

export default async function Blog({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { data: blogData, recentBlogs, title, error: blogError } = await fetchBlogData(slug, locale);

  // Handle error state for blog data
  if (blogError || !blogData) {
    notFound();
  }

  return (
    <>
      <BlogDetail data={blogData} />
      <RecentBlog recentBlogs={recentBlogs} error={blogError} title={title} />
    </>
  );
}
