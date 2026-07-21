//export const dynamic = "force-dynamic";
import React from "react";
import NcdReports from "@/components/features/investors/NcdReports";

async function fetchNcdData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/ncd-reports`, {
      // cache: 'no-store', // or 'force-cache' depending on your needs
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const data = result.data;

    if (result.status === "success") {
      return {
        contents: data?.content,
        currentReports: data?.currentReports || [],
        pastReports: data?.pastReports || [],
        error: null,
      };
    }
    return {
      contents: null,
      currentReports: [],
      pastReports: [],
      error: result.message,
    };
  } catch (error) {
    return { contents: null, currentReports: [], pastReports: [], error: "Failed to fetch ncd data" };
  }
}

export default async function report() {
  const { contents, currentReports, pastReports, error } = await fetchNcdData();

  if (!contents && currentReports.length === 0 && pastReports.length === 0) {
    return <div>Failed to fetch report data</div>;
  }

  return (
    <>
      <NcdReports currentReports={currentReports} pastReports={pastReports} content={contents} />
    </>
  );
}
