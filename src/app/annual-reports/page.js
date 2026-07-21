//export const dynamic = "force-dynamic";
import React from "react";
import Report from "../../components/features/investors/Report";

import api from "../../lib/api/axios";

async function fetchReportData() {
  try {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/report`, {
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
  const { content, reports, returns, error } = await fetchReportData();

  if (!reports && !returns) {
    return <div>Failed to fetch report data</div>;
  }
  return (
    <>
      <Report reports={reports} returns={returns} content={content} />
    </>
  );
}
