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

export default async function PolicyPage({ params }) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const { content, error } = await fetchData(slug, locale);

  if (error || !content) {
    notFound();
  }

  return (
    <>
      <PrivacyPolicy content={content} type={slug} />
    </>
  );
}
