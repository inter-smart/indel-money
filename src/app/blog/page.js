 //export const dynamic = "force-dynamic";
import Script from "next/script";
import LatestBlogs from "@/pages/LatestBlogs";
import AllBlogsPage from "@/pages/AllBlogs";

async function getMetaData() {
  const defaultMeta = {
    title: "Blogs | My Website",
    description: "Explore insights, stories, and updates from Indel.",
    keywords: "blogs, indel, articles, insights",
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=blog`, {
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const meta = result?.data;

    if (result.status === "success" && meta) {
      return {
        title: meta.meta_title || defaultMeta.title,
        description: meta.meta_description || defaultMeta.description,
        keywords: meta.meta_keywords || defaultMeta.keywords,
        error: null,
      };
    }

    return {
      ...defaultMeta,
      error: result?.message || "Metadata not found",
    };
  } catch (error) {
    return {
      ...defaultMeta,
      error: "Failed to fetch meta data",
    };
  }
}

export async function generateMetadata() {
  const { title, description, keywords } = await getMetaData();

  return {
    title,
    description,
    keywords,
  };
}

export default async function Blog({ searchParams }) {
  const page = (await searchParams?.page) || 1;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/blog",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fbanner%2F1763029961331-201441951.jpg&w=1920&q=75",
        "description": "Explore the latest financial articles, insights, guides, and updates on gold loans, MSME loans, personal finance, and more from Indel Money.",
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
        "serviceType": "Financial Services",
        "provider": {
          "@type": "Organization",
          "name": "Indel Money Limited",
          "url": "https://indelmoney.com/"
        },
        "areaServed": "IN",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Branches",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "LocalBusiness",
                "name": "Indel Money Limited",
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
        "@type": "WebPage",
        "name": "Indel Money Blog",
        "url": "https://indelmoney.com/blog",
        "description": "Read informative blogs from Indel Money covering gold loans, MSME loans, business finance, investment tips, and personal financial planning."
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://indelmoney.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://indelmoney.com/blog"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-blog"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <LatestBlogs />
      <AllBlogsPage page={page} />
    </>
  );
}
