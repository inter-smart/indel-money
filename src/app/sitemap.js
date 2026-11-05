import {
  getBlogEntries,
  getNewsEntries,
  getCsrEntries,
  getIndelCaresEntries,
  getGalleryEntries,
  getCelebrationsEntries,
} from "@/lib/sitemap/fetchSitemapEntries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

// One static route per src/app/* folder that isn't a dynamic ([param]) route,
// a list route (handled dynamically below), or dev/transactional scaffolding.
const STATIC_ROUTES = [
  "",
  "about-indel-money",
  "annual-reports",
  "award",
  "board-of-directors",
  "branch-locator",
  "career",
  "career-list",
  "consumer-durable-loans",
  "contact",
  "corporate-governance",
  "credit-rating",
  "different-shades-of-indelmoney",
  "gold-loan",
  "history-of-indel",
  "indel-values",
  "investors",
  "investors/csr",
  "investors-contact",
  "loan-against-property",
  "management-team",
  "msme-loan",
  "ncd",
  "ombudsman",
  "partners",
  "policies",
  "quarterly-results",
  "services",
  "stock-exchange-filings",
  "blog",
  "news",
  "gallery",
  "celebrations",
];
// Excluded: ncd-issue / ncd-issue-thank-you (transactional/thank-you flow),
// emptestimonial, simple-test, test-floating-labels (dev/test scaffolding).

// Policy content pages served by src/app/[slug]/page.js (GET /api/web/policies?type=:slug).
// No list API exists for these — the valid slugs are the fixed set linked from the footer
// (src/components/layout/footer/Footer.js), so they're enumerated explicitly here.
const POLICY_SLUGS = [
  "privacy-policy",
  "disclaimer",
  "mobile-app-privacy-policy-indel-money-private-limited",
  "fair-practices-code",
  "gold-loan-terms-and-conditions",
  "kyc-policy",
  "methodology-and-valuation-of-gold-collateral",
  "contest",
];

export default async function sitemap() {
  const staticEntries = [...STATIC_ROUTES, ...POLICY_SLUGS].map((path) => ({
    url: path ? `${baseUrl}/${path}` : baseUrl,
    lastModified: new Date(),
  }));

  const [blogs, news, csr, cares, gallery, celebrations] = await Promise.all([
    getBlogEntries(),
    getNewsEntries(),
    getCsrEntries(),
    getIndelCaresEntries(),
    getGalleryEntries(),
    getCelebrationsEntries(),
  ]);

  const dynamicEntries = [...blogs, ...news, ...csr, ...cares, ...gallery, ...celebrations].map((entry) => ({
    ...entry,
    url: `${baseUrl}${entry.url}`,
  }));

  return [...staticEntries, ...dynamicEntries];
}
