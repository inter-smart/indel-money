//export const dynamic = "force-dynamic";
import React from "react";
import Report from "../../components/features/investors/Report";

import api from "../../lib/api/axios";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

async function fetchReportData(locale) {
  try {
    const response = await api.get(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/report`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = response.data;
    const reportData = result.data;
    if (result.status === "success") {
      return {
        content: reportData?.content,
        reports: reportData?.annualReports,
        returns: reportData?.annualReturn,
        error: null,
      };
    }
    return {
      content: null,
      reports: null,
      returns: null,
      error: result.message,
    };
  } catch (error) {
    return {
      content: null,
      reports: null,
      returns: null,
      error: "Failed to fetch report data",
    };
  }
}

export default async function report() {
  const locale = await getServerLocale();
  const { content, reports, returns, error } = await fetchReportData(locale);

  if (!reports && !returns) {
    return <div>Failed to fetch report data</div>;
  }
  return (
    <>
      <Report reports={reports} returns={returns} content={content} />
    </>
  );
}
