import { cache } from "react";
import { cookies, headers } from "next/headers";

const LOCALE_DETECT_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/locale-detect`;

// Tighter than TranslatorDropdown.js's client-side 2500ms budget for the same
// lookup, since this one blocks the SSR response instead of running in the
// background after paint.
const SSR_LOCALE_DETECT_TIMEOUT_MS = 1200;

// Mirrors TranslatorDropdown.js's own locale-code shape - loose on purpose (it
// covers real codes like "mni-Mtei"), just enough to stop a malformed/tampered
// cookie value from being echoed into a query string unescaped by
// buildLocalizedUrl.
const COOKIE_LOCALE_PATTERN = /^[a-zA-Z-]{1,10}$/;

// Memoized per request via React's cache() so every Server Component that
// needs the visitor's locale during the same render (layout, header, page)
// collapses to a single /api/web/locale-detect call instead of one each.
export const getServerLocale = cache(async function getServerLocale() {
  // An explicit pick (made via TranslatorDropdown.js, which mirrors it into
  // this same cookie name alongside localStorage) always wins over
  // geolocation - including a stored "en", since that's still a real choice.
  // Geolocation is only ever a fallback default for a visitor who hasn't
  // picked anything yet.
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("siteLanguage")?.value;
  if (cookieLocale && COOKIE_LOCALE_PATTERN.test(cookieLocale)) return cookieLocale;

  try {
    const headersList = await headers();
    // headers() reflects the incoming request to this Next.js server - it is
    // not automatically forwarded to the outgoing fetch below.
    const forwardedFor = headersList.get("x-forwarded-for") || "";

    const response = await fetch(LOCALE_DETECT_ENDPOINT, {
      headers: forwardedFor ? { "x-forwarded-for": forwardedFor } : {},
      cache: "no-store",
      signal: AbortSignal.timeout(SSR_LOCALE_DETECT_TIMEOUT_MS),
    });

    if (!response.ok) return "en";

    const result = await response.json();
    const locale = result?.data?.locale;
    return typeof locale === "string" && locale ? locale : "en";
  } catch {
    // Timeout/abort, network failure, bad JSON - fail open to English rather
    // than hold up the page render.
    return "en";
  }
});
