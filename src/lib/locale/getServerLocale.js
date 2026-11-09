import { cache } from "react";
import { cookies } from "next/headers";

// Mirrors TranslatorDropdown.js's own locale-code shape - loose on purpose (it
// covers real codes like "mni-Mtei"), just enough to stop a malformed/tampered
// cookie value from being echoed into a query string unescaped by
// buildLocalizedUrl.
const COOKIE_LOCALE_PATTERN = /^[a-zA-Z-]{1,10}$/;

// Memoized per request via React's cache() so every Server Component that
// needs the visitor's locale during the same render (layout, header, page)
// collapses to a single cookie read instead of one each.
export const getServerLocale = cache(async function getServerLocale() {
  // An explicit pick (made via TranslatorDropdown.js, which mirrors it into
  // this same cookie name alongside sessionStorage) is the only thing that
  // moves the site off English - there is no IP-based auto-detection.
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("siteLanguage")?.value;
  if (cookieLocale && COOKIE_LOCALE_PATTERN.test(cookieLocale)) return cookieLocale;

  return "en";
});
