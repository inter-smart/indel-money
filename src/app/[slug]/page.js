//export const dynamic = "force-dynamic";
import PrivacyPolicy from "@/components/features/privacy/PrivacyPolicy";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

async function fetchData(type, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/policies?type=${type}`, locale), {
      cache: "no-store", // Ensure fresh data
      // cache: "force-cache",
      // next: { revalidate: 60 },
    });

    const result = await response.json();
    const PolicyData = result.policy;

    if (result.status === "success") {
      return {
        content: PolicyData?.content,
        title: PolicyData?.title,
        meta_title: PolicyData?.meta_title,
        meta_description: PolicyData?.meta_description,
        meta_keywords: PolicyData?.meta_keywords,
        error: null,
      };
    } else {
      notFound();
    }

    return {
      content: null,
      error: result.message,
    };
  } catch (error) {
    notFound();
    return {
      content: null,
      error: "Failed to policy data",
    };
  }
}

const defaultMetadata = (slug = "") => ({
  title: "Policy | Indel Money",
  description: "Read our policy.",
  keywords: "policy, terms, indel money",
  openGraph: {
    title: "Policy | Indel Money",
    description: "Read our policy.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
    type: "article",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Policy | Indel Money",
    description: "Read our policy.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
  },
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { meta_title, meta_description, meta_keywords, title, error } = await fetchData(slug, locale);

  if (error) {
    return defaultMetadata(slug);
  }

  return {
    title: meta_title || defaultMetadata(slug).title,
    description: meta_description || defaultMetadata(slug).description,
    keywords: meta_keywords || defaultMetadata(slug).keywords,
    openGraph: {
      title: meta_title || title || defaultMetadata(slug).openGraph.title,
      description: meta_description || defaultMetadata(slug).openGraph.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
      type: "article",
      images: defaultMetadata(slug).openGraph.images,
    },
    twitter: {
      card: "summary_large_image",
      title: meta_title || title || defaultMetadata(slug).twitter.title,
      description: meta_description || defaultMetadata(slug).twitter.description,
      images: defaultMetadata(slug).twitter.images,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
    },
  };
}

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { content, title, error } = await fetchData(slug, locale);

  if (error || !content) {
    notFound();
  }

  return (
    <>
      <PrivacyPolicy content={content} type={slug} title={title} />
    </>
  );
}
