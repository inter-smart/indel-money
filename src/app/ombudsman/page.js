//export const dynamic = "force-dynamic";
import Ombudsman from "@/components/features/ombudsman/Ombudsman";
import NoContents from "@/components/NoContents";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

async function fetchData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/ombudsman`, locale), {
      // cache: "no-store",
      cache: "force-cache",
      next: { revalidate: 600 },
      //next: { revalidate: 600 },
    });
    const result = await response.json();
    if (result.status === "success") {
      return {
        data: result.data,
        error: null, // ← Fixed: should be null on success
      };
    }

    return {
      data: null,
      error: result.message || "Failed to fetch ombudsman data",
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      data: null,
      error: "Failed to fetch ombudsman data",
    };
  }
}

export default async function Ombudsmans() {
  const locale = await getServerLocale();
  const { data: files, error } = await fetchData(locale); // ← Fixed destructuring
  // Handle not found case
  if (!files || files.length === 0) {
    <NoContents />;
  }

  return (
    <>
      <Ombudsman files={files} />
    </>
  );
}
