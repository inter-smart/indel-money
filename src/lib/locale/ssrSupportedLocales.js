// Locales the backend's translateMiddleware.js (server/middlewares/translateMiddleware.js)
// actually translates and caches for GET /api/web/* responses. Keep in sync with that
// file's SUPPORTED_LOCALES - adding a locale here without a matching backend entry just
// fragments the Next.js ISR cache with a `?lang=` variant identical to the English response.
export const SSR_TRANSLATABLE_LOCALES = ["hi", "ta", "te", "mr", "gu", "bn", "kn", "ml"];

export function isSsrTranslatableLocale(locale) {
  return SSR_TRANSLATABLE_LOCALES.includes(locale);
}
