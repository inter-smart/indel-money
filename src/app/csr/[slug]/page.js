import dynamic from "next/dynamic";
import CsrDetail from "@/components/features/csr/BlogDetail";
import RecentCsr from "@/components/features/csr/RecentCSR";
import { notFound } from "next/navigation";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

const LatestUpdates = dynamic(() => import("@/components/features/home/LatestUpdates"), {
  loading: () => <div>Loading slider...</div>,
});
const MobLatestUpdates = dynamic(() => import("@/components/features/csr/MobLatestUpdates"), {
  loading: () => <div>Loading mobile slider...</div>,
});

// Fetch single CSR data
async function fetchCsrData(slug, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/csr/${slug}`, locale), {
      // next: { revalidate: 60 },
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();

    if (result.status === "success") {
      return {
        content: result?.data,
        error: null,
      };
    }
    return {
      content: null,
      error: result.message,
    };
  } catch (error) {
    return { content: null, error: "Failed to fetch CSR data" };
  }
}

// Fetch recent CSR posts
async function fetchRecentCsrs(slug, locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/csr?limit=3`, locale), {});
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    if (result.status === "success") {
      const csr = result.data?.csr?.filter((csr) => csr.slug !== slug);
      return { data: csr || [], error: null };
    }
    return { data: [], error: result.message };
  } catch (error) {
    return { data: [], error: "Failed to fetch recent CSR posts" };
  }
}

// Generate metadata for CSR
export async function generateMetadata({ params }) {
  const { slug } = params;
  const locale = await getServerLocale();
  const { content: data, error } = await fetchCsrData(slug, locale);

  if (error || !data) {
    return {
      title: "CSR | My Website",
      description: "Explore our CSR initiatives.",
      openGraph: {
        title: "CSR | My Website",
        description: "Explore our CSR initiatives.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/csr/${slug}`,
        type: "article",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
            width: 1200,
            height: 630,
            alt: "CSR",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "CSR | My Website",
        description: "Explore our CSR initiatives.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/csr/${slug}`,
      },
    };
  }

  return {
    title: data?.meta_title || data?.title || "CSR | My Website",
    description: data?.meta_description || data?.description || "Explore our CSR initiatives.",
    keywords: data?.meta_keywords || "csr, sustainability, social responsibility",
    openGraph: {
      title: data?.meta_title || data?.title || "CSR | My Website",
      description: data?.meta_description || data?.description || "Explore our CSR initiatives.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/csr/${slug}`,
      type: "article",
      images: [
        {
          url: data?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.image}` : `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: data?.image_alt || data?.title || "CSR",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data?.title || "CSR | My Website",
      description: data?.meta_description || data?.description || "Explore our CSR initiatives.",
      images: [
        data?.meta_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.meta_image}` : `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/csr/${slug}`,
    },
  };
}

// Main component for CSR detail page
export default async function CSRDetailPage({ params }) {
  const { slug } = params;
  const locale = await getServerLocale();
  const { content: csrData, error: csrError } = await fetchCsrData(slug, locale);
  const { data: recentCsrs, error: recentError } = await fetchRecentCsrs(slug, locale);

  if (csrError || !csrData) {
    notFound();
  }

  return (
    <>
      <CsrDetail data={csrData} />
      <RecentCsr recentCsr={recentCsrs?.slice(0, 10)} error={recentError} />
    </>
  );
}
