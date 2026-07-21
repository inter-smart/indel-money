//export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import Script from "next/script";
import HomeClient from "../pages/HomeClient";
import { defaultMeta } from "@/constants/constants";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

async function fetchHomeData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/home`, {
      cache: "force-cache",
      next: { revalidate: 600 },
      credentials: "include", // Ensures session cookie is sent
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.message };
  } catch (error) {
    return { data: null, error: "Failed to fetch home data" };
  }
}

async function fetchGoldRate() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/gold-rate`, {
      cache: "force-cache",
      next: { revalidate: 600 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result?.success && result?.goldRate) {
      return { data: result.goldRate, error: null };
    }

    return { data: null, error: result?.message || "Invalid response from gold rate API" };
  } catch (error) {
    return { data: null, error: "Failed to fetch gold rate" };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=home`, {
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const meta = result.data;

    if (result.status === "success") {
      return {
        title: meta?.meta_title || defaultMeta.title,
        description: meta?.meta_description || defaultMeta.description,
        keywords: meta?.meta_keywords || defaultMeta.keywords,
        // Enhanced SEO fields
        openGraph: {
          title: meta?.og_title || meta?.meta_title || defaultMeta.title,
          description: meta?.og_description || meta?.meta_description || defaultMeta.description,
          images: meta?.og_image ? [{ url: meta.og_image, width: 1200, height: 630 }] : [],
          type: "website",
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}`,
        },
        error: null,
      };
    }
    return {
      title: defaultMeta.title,
      description: defaultMeta.description,
      keywords: defaultMeta.keywords,
      openGraph: {
        title: defaultMeta.title,
        description: defaultMeta.description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
      },
      error: result.message || "No metadata found",
    };
  } catch (error) {
    return {
      title: defaultMeta.title,
      description: defaultMeta.description,
      keywords: defaultMeta.keywords,
      openGraph: {
        title: defaultMeta.title,
        description: defaultMeta.description,
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/home`,
      },

      error: result.message || "No metadata found",
    };
  }
}

export async function generateMetadata() {
  const { title, description, keywords, twitter, openGraph, alternates } = await getMetaData();
  return {
    title,
    description,
    keywords,
    twitter,
    openGraph,
    alternates,
  };
}

export default async function HomePage() {
  const { data, error } = await fetchHomeData();
  const { data: goldRateData, error: goldRateError } = await fetchGoldRate();

  const headersList = await headers(); // ✅ await here
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = isMobileDevice(userAgent);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fbanner%2F1763029961331-201441951.jpg&w=1920&q=75",
        "description": "Indel Money offers gold loans and MSME loans in India.",
        "telephone": "1800 4253 990",
        "email": "care@indelmoney.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Indel House, Changampuzhanagar",
          "addressLocality": "South Kalamassery P O",
          "addressRegion": "Kerala",
          "postalCode": "682033",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 10.043098838609305,
          "longitude": 76.31735007301208
        },
        "sameAs": [
          "https://www.facebook.com/indelmoney",
          "https://www.instagram.com/indelmoney",
          "https://www.linkedin.com/company/indel-money",
          "https://twitter.com/indelmoney"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Branches",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "LocalBusiness",
                "name": "Indel Money Limited — Kalamassery Branch",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Indel House, Changampuzhanagar",
                  "addressLocality": "South Kalamassery P O",
                  "addressRegion": "Kerala",
                  "postalCode": "682033",
                  "addressCountry": "IN"
                },
                "telephone": "04842933979"
              }
            }
          ]
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "09:30",
            "closes": "17:30"
          }
        ],
        "paymentAccepted": "Cash, Credit Card, NEFT/IMPS",
        "currenciesAccepted": "INR"
      },
      {
        "@type": "WebSite",
        "name": "Indel Money",
        "url": "https://indelmoney.com/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://indelmoney.com/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What types of loans does Indel Money offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indel Money offers a variety of loans, including Gold Loans, Consumer Durable Loans, MSME Loans, and other financial services tailored to meet different customer needs."
            }
          },
          {
            "@type": "Question",
            "name": "How can I apply for a Gold Loan with Indel Money?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can apply for a Gold Loan by visiting your nearest Indel Money branch with your jewellery. Alternatively, you can also opt for digital gold loans, which can be processed entirely online."
            }
          },
          {
            "@type": "Question",
            "name": "What are the eligibility criteria for MSME Loans at Indel Money?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To be eligible for an MSME Loan, you should be an Indian citizen, between 25 and 55 years old, and your business should have at least 3 years of experience. Other criteria may apply based on specific loan requirements."
            }
          },
          {
            "@type": "Question",
            "name": "Can I repay my loan early with Indel Money?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can repay your loan ahead of schedule by making part or full pre-payments, subject to applicable charges. This option is available for most loan types offered by Indel Money."
            }
          },
          {
            "@type": "Question",
            "name": "What investment assistance services does Indel Money provide?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indel Money offers comprehensive investment assistance as part of its financial services. This includes guidance and support for various investment options tailored to individual financial goals."
            }
          },
          {
            "@type": "Question",
            "name": "How can I make loan repayments with Indel Money?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can make loan repayments through various convenient methods such as post-dated cheques, NACH facility, ECS, or direct debit. Additionally, Indel Money facilitates online repayments for added convenience."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-home"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <HomeClient
        initialData={data}
        serviceBanner={data?.service}
        banner={data?.banner}
        branchLocatorData={data?.branchLocatorData}
        initialError={error}
        goldRate={goldRateData}
        initialIsMobile={isMobile}
      />
    </>
  );
}
