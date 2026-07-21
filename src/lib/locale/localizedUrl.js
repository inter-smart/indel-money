import { isSsrTranslatableLocale } from "./ssrSupportedLocales";

// Appends `lang=<locale>` to a backend CMS URL so server/middlewares/translateMiddleware.js
// returns (and Redis-caches) an already-translated response - letting Next.js SSR render
// the page directly in the visitor's locale instead of translating the DOM after the fact.
export function buildLocalizedUrl(url, locale) {
  if (!locale || locale === "en" || !isSsrTranslatableLocale(locale)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}lang=${locale}`;
}
