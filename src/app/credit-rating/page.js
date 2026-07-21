//export const dynamic = "force-dynamic";
import React from "react";
import CreditRatings from "../../components/features/investors/CreditRatings";
import { notFound } from "next/navigation";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

async function fetchCreditRatingsData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/credit-ratings`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();

    if (result.status === "success") {
      return { content: result.data?.content[0], reports: result.data?.files, error: null };
    }
    return { content: null, reports: null, error: result.message };
  } catch (error) {
    return { reports: null, error: "Failed to fetch credit ratings data" };
  }
}

export default async function QuarterlyReports() {
  const locale = await getServerLocale();
  const { content, reports, error } = await fetchCreditRatingsData(locale);

  if (!reports) {
    notFound();
  }

  return (
    <>
      <CreditRatings content={content} reports={reports} />
    </>
  );
}
