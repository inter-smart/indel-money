//export const dynamic = "force-dynamic";
import Script from "next/script";
import ContactBanner from "@/components/features/contact/ContactBanner";
import WriteIntel from "@/components/features/contact/WriteIntel";
import ContactFaq from "@/components/features/contact/ContactFaq";
import { defaultMeta } from "@/constants/constants";
import BranchLocator from "../../components/features/home/BranchLocator";

async function fetchContactsData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/contacts`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();

    if (result.status === "success") {
      return {
        contents: result.data?.content,
        faqs: result.data?.faqs,
        officeContacts: result.data?.officeContacts,
        branchLocatorData: result.data?.branchLocatorData,
        error: null,
      };
    }
    return { contents: null, faqs: null, officeContacts: null, branchLocatorData: null, error: result.message };
  } catch (error) {
    return {
      contents: null,
      faqs: null,
      officeContacts: null,
      branchLocatorData: null,
      error: "Failed to fetch management data",
    };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=contact`);
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`,
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

export default async function Contact() {
  const { contents, faqs, officeContacts, branchLocatorData, error } = await fetchContactsData();

  if (!contents || !faqs || !officeContacts) {
    return <div>Failed to fetch contact data</div>;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/contact",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fbanner%2F1763029961331-201441951.jpg&w=1920&q=75",
        "description": "Contact Indel Money for inquiries related to gold loans, MSME loans, and other financial services. Get customer support through phone, email, or by visiting our corporate office.",
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
        "name": "Contact Us - Indel Money",
        "url": "https://indelmoney.com/contact",
        "description": "Get in touch with Indel Money. Reach our customer care team for assistance regarding loans, services, and branch information."
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
            "name": "Contact",
            "item": "https://indelmoney.com/contact"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-contact"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ContactBanner
        trollFreeNum={contents?.toll_free_number}
        contactTitle={contents?.title}
        contactDesc={contents?.description}
        helpText={contents?.help_title}
      />
      <WriteIntel
        formTitle={contents?.form_title}
        formSubtitle={contents?.form_sub_title}
        contactImage={contents?.contact_image}
      />
      <BranchLocator variant="contact" pageContent={branchLocatorData} />
      <ContactFaq
        faqs={faqs}
        officeContacts={officeContacts}
        faqTitle={contents?.faq_title}
        faqSuperTitle={contents?.faq_super_title}
      />
    </>
  );
}
