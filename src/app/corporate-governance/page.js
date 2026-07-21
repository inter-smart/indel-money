//export const dynamic = "force-dynamic";
import GoverenanceInfo from "../../components/features/investors/GoverenanceInfo";

async function fetchCorporateGoverneceData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/corporate-governance`, {
      // cache: 'no-store', // or 'force-cache' depending on your needs
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const data = result.data;

    if (result.status === "success") {
      return {
        contents: data?.content,
        pdfItems: data?.files,
        error: null,
      };
    }
    return {
      contents: null,
      pdfItems: null,
      error: result.message,
    };
  } catch (error) {
    return { reports: null, error: "Failed to fetch management data" };
  }
}

export default async function Goverenance() {
  const { contents, pdfItems } = await fetchCorporateGoverneceData();

  if (!contents && !pdfItems) {
    return <div>Failed to fetch report data</div>;
  }

  return (
    <>
      <GoverenanceInfo contents={contents} pdfItems={pdfItems} />
    </>
  );
}
