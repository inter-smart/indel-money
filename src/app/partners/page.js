//export const dynamic = "force-dynamic";
import PartnersSection from "@/components/partners/Partners";

async function fetchPartnersData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/partners`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response?.json();

    if (result.status === "success") {
      return { data: result?.data?.content, partners: result?.data?.partners, error: null };
    }
    return { data: null, partners: null, error: result?.message };
  } catch (error) {
    return { data: null, partners: null, error: "Failed to about data" };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=partners`, {
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const meta = result.data;

    if (result.status === "success") {
      return {
        title: meta?.meta_title || "Our Partners | My Website",
        description: meta?.meta_description || "Explore our partners offering consumer durable loans and financial services.",
        keywords: meta?.meta_keywords || "partners, consumer durable loans, financial services",
        error: null,
      };
    }
    return {
      title: "Our Partners | My Website",
      description: "Explore our partners offering consumer durable loans and financial services.",
      keywords: "partners, consumer durable loans, financial services",
      error: result.message,
    };
  } catch (error) {
    return {
      title: "Our Partners | My Website",
      description: "Explore our partners offering consumer durable loans and financial services.",
      keywords: "partners, consumer durable loans, financial services",
      error: "Failed to fetch service data",
    };
  }
}

export async function generateMetadata() {
  const { title, description, keywords } = await getMetaData();

  return {
    title,
    description,
    keywords,
  };
}

export default async function Partners() {
  const { data, partners, error } = await fetchPartnersData();

  if (!data && !partners) {
    return <div>Failed to fetch partners data</div>;
  }

  return <PartnersSection content={data} partners={partners} initialError={error} />;
}
