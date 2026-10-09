//export const dynamic = "force-dynamic";
import Script from "next/script";
import { headers } from "next/headers";
import LAPClient from "../../pages/LAPClient";
import { defaultMeta } from "@/constants/constants";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
async function fetchData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/loan-against-property`, locale), {
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const cdData = result.data;

    if (result.status === "success") {
      return {
        contents: cdData?.cdLoanContent,
        benfits: cdData?.cdLoanBenefits,
        products: cdData?.cdLoanProducts,
        faqs: cdData?.cdLoanFaqs,
        error: result.message,
      };
    }
    return { contents: null, benfits: null, products: null, error: result.message };
  } catch (error) {
    console.error("Error fetching service data:", error);
    return { contents: null, benfits: null, products: null, error: "Failed to fetch service data" };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=lap`, locale), {
      // cache: "force-cache",
      // next: { revalidate: 600 },
    });
    const result = await response.json();
    const meta = result?.data;

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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/management-team`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/management-team`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/loan-against-property`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/loan-against-property`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/loan-against-property`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/loan-against-property`,
      },

      error: result.message || "No metadata found",
    };
  }
}

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { title, description, keywords, twitter, openGraph, alternates } = await getMetaData(locale);
  return {
    title,
    description,
    keywords,
    twitter,
    openGraph,
    alternates,
  };
}

export default async function Services() {
  const locale = await getServerLocale();
  const { contents, benfits, products, faqs, error } = await fetchData(locale);

  const headersList = await headers(); // ✅ await here
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = isMobileDevice(userAgent);

  if (!contents || !benfits || !products) {
    return <div>Failed to data</div>;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "@id": "https://indelmoney.com/loan-against-property#financialservice",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/loan-against-property",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fheader-contents%2F1751028562747.svg&w=256&q=75",
        "description": "Get funds for your needs by using your property. Enjoy quick approval, low rates, and flexible repayment. Apply online now with Indel Money.",
        "telephone": "1800 4253 990",
        "email": "care@indelmoney.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Indel House, Changampuzhanagar",
          "addressLocality": "South Kalamassery P O",
          "addressRegion": "Kerala",
          "postalCode": "682033",
          "addressCountry": "IN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 10.043098838609305,
          "longitude": 76.31735007301208,
        },
        "sameAs": [
          "https://www.facebook.com/indelmoney",
          "https://www.instagram.com/indelmoney",
          "https://www.linkedin.com/company/indel-money",
          "https://twitter.com/indelmoney",
        ],
        "parentOrganization": {
          "@id": "https://indelmoney.com/#organization",
        },
        "areaServed": {
          "@type": "Country",
          "name": "India",
        },
        "serviceType": "Loan Against Property",
        "provider": {
          "@id": "https://indelmoney.com/#organization",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Loan Against Property",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Loan Against Residential Property",
              "itemOffered": {
                "@type": "Service",
                "name": "Loan Against Residential Property",
                "serviceType": "Secured loan against residential property",
                "provider": {
                  "@id": "https://indelmoney.com/#organization",
                },
              },
            },
            {
              "@type": "Offer",
              "name": "Loan Against Commercial Property",
              "itemOffered": {
                "@type": "Service",
                "name": "Loan Against Commercial Property",
                "serviceType": "Secured loan against commercial property",
                "provider": {
                  "@id": "https://indelmoney.com/#organization",
                },
              },
            },
          ],
        },
      },
      {
        "@type": "Organization",
        "@id": "https://indelmoney.com/#organization",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fheader-contents%2F1751028562747.svg&w=256&q=75",
        "telephone": "1800 4253 990",
        "email": "care@indelmoney.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://indelmoney.com/#website",
        "url": "https://indelmoney.com/",
        "name": "Indel Money",
        "publisher": {
          "@id": "https://indelmoney.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://indelmoney.com/loan-against-property#webpage",
        "url": "https://indelmoney.com/loan-against-property",
        "name": "Loan Against Property - Indel Money",
        "description": "Get funds for your needs by using your property. Enjoy quick approval, low rates, and flexible repayment. Apply online now with Indel Money.",
        "isPartOf": {
          "@id": "https://indelmoney.com/#website",
        },
        "about": {
          "@id": "https://indelmoney.com/loan-against-property#financialservice",
        },
        "breadcrumb": {
          "@id": "https://indelmoney.com/loan-against-property#breadcrumb",
        },
        "mainEntity": {
          "@id": "https://indelmoney.com/loan-against-property#financialservice",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://indelmoney.com/loan-against-property#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://indelmoney.com/",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Loan Against Property",
            "item": "https://indelmoney.com/loan-against-property",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://indelmoney.com/loan-against-property#faq",
        "url": "https://indelmoney.com/loan-against-property",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a Loan Against Property (LAP)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It is a secured loan and borrowers pledge residential/ commercial property as collateral. Indel Money offers up to 60% of the Market Value of the property, as assessed by Indel Money.",
            },
          },
          {
            "@type": "Question",
            "name": "What type of property can I mortgage for a Loan Against Property?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Both commercial and residential properties can be pledged. However, vacant land is *not eligible* for LAP.",
            },
          },
          {
            "@type": "Question",
            "name": "Who is eligible to apply for a Loan Against Property?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "To be eligible for a Loan Against Property, the applicant must be a Resident Indian between 21 and 60 years of age. Both salaried individuals & self-employed professionals can apply, making it accessible to a wide range of working professionals.",
            },
          },
          {
            "@type": "Question",
            "name": "What documents are required to apply?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Proof of Identity & Residence: PAN Card, Passport, Voter ID, or Driver's License Proof of Income: Last 3 months' salary slips/ 6 months' bank statements/ or latest Form-16 and IT returns Property Documents: Title deeds including the complete chain of ownership and proof of no encumbrances on the property. Nationality Proof: Applicant must be a Resident Indian Security: Commercial or residential property offered as collateral Photograph: Passport-size photograph of all applicants and co-applicants, affixed and signed across on the application form.",
            },
          },
          {
            "@type": "Question",
            "name": "How is the interest rate decided?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The interest rate is determined based on multiple factors such as the customer's credit score, repayment history, and overall profile.",
            },
          },
          {
            "@type": "Question",
            "name": "Can I use the loan amount for any purpose?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. You can use the loan amount for either personal or business purposes. Whether it's for funding your child's education, managing medical expenses, expanding your business, or renovating your home, a Loan Against Property gives you the flexibility to use the funds as needed.",
            },
          },
          {
            "@type": "Question",
            "name": "How long does it take to process a Loan Against Property?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In a smooth scenario, disbursement typically happens within 4 to 5 working days.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-loan-against-property"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <LAPClient
        contents={contents}
        benfits={benfits}
        faqs={faqs}
        products={products}
        initialIsMobile={false} // Assuming you want to handle mobile detection client-side
      />
    </>
  );
}
