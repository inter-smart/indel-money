//export const dynamic = "force-dynamic";

import React from "react";
import CsrDetailsSection from "../../../components/features/investors/CsrDetailsSection";

async function fetchCsrData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/csr-details`, {
      // cache: 'no-store', // or 'force-cache' depending on your needs
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const data = result.data;

    if (result.status === "success") {
      return {
        contents: data?.content,
        actionPlans: data?.actionPlans,
        commitee: data?.committees,
        reports: data?.reports,
        error: null,
      };
    }
    return {
      contents: null,
      actionPlans: null,
      commitee: null,
      reports: null,
      error: result.message,
    };
  } catch (error) {
    return { reports: null, error: "Failed to fetch ncr data" };
  }
}

export default async function contact() {
  const { contents, reports, commitee, actionPlans, error } = await fetchCsrData();

  if (!contents && !reports && !commitee && !actionPlans) {
    return <div>Failed to fetch report data</div>;
  }

  return (
    <>
      <CsrDetailsSection reports={reports} commitee={commitee} actionPlans={actionPlans} content={contents} />
    </>
  );
}
