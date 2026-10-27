import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";
import { celebrationsApiPath } from "@/components/features/celebrations/celebrationConstants";

// First-page fetch for the celebrations server components.
// Resolves to { data, notFound, error }; a 404 from the API is reported as notFound so the page can call notFound().
export async function fetchCelebrationsServer(path, query = {}) {
  const locale = await getServerLocale();
  const search = new URLSearchParams(query).toString();
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/${celebrationsApiPath(path)}${search ? `?${search}` : ""}`;

  try {
    const response = await fetch(buildLocalizedUrl(url, locale), {
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    if (response.status === 404) return { data: null, notFound: true, error: null };

    const result = await response.json();
    if (response.ok && result.status === "success") return { data: result.data, notFound: false, error: null };

    return { data: null, notFound: false, error: result.error?.message || result.message || "Failed to load" };
  } catch (error) {
    return { data: null, notFound: false, error: "Failed to load" };
  }
}
