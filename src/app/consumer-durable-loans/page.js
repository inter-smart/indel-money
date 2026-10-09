//export const dynamic = "force-dynamic";
import Script from "next/script";
import { defaultMeta } from "@/constants/constants";
import { headers } from "next/headers";
import CDLoanClient from "../../pages/CDLoanClient";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
async function fetchData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/cd-loan`, locale), {
      // cache: "no-store", // Ensure fresh data
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
    return { contents: null, benfits: null, products: null, error: "Failed to fetch service data" };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=cdloan`, locale), {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
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

export default async function CDLoan() {
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
        "@id": "https://indelmoney.com/consumer-durable-loans#financialservice",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/consumer-durable-loans",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fheader-contents%2F1751028562747.svg&w=256&q=75",
        "description": "Buy electronics or appliances now and pay later with flexible EMIs. Apply online with Indel Money for a quick and hassle-free loan approval.",
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
        "provider": {
          "@id": "https://indelmoney.com/#organization",
        },
        "areaServed": {
          "@type": "Country",
          "name": "India",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Consumer Durable Loan Products",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Consumer Durable Loan for Televisions",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Consumer Durable Loan for Refrigerators",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Consumer Durable Loan for Mobile Phones",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Consumer Durable Loan for Air Conditioners",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Consumer Durable Loan for Washing Machines",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Consumer Durable Loan for Kitchen Appliances",
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
        "@type": "WebPage",
        "@id": "https://indelmoney.com/consumer-durable-loans#webpage",
        "url": "https://indelmoney.com/consumer-durable-loans",
        "name": "Consumer Durable Loans - Indel Money",
        "description": "Buy electronics or appliances now and pay later with flexible EMIs. Apply online with Indel Money for a quick and hassle-free loan approval.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://indelmoney.com/#website",
          "url": "https://indelmoney.com/",
          "name": "Indel Money",
        },
        "about": {
          "@id": "https://indelmoney.com/consumer-durable-loans#financialservice",
        },
        "breadcrumb": {
          "@id": "https://indelmoney.com/consumer-durable-loans#breadcrumb",
        },
        "mainEntity": {
          "@id": "https://indelmoney.com/consumer-durable-loans#financialservice",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://indelmoney.com/consumer-durable-loans#breadcrumb",
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
            "name": "Consumer Durable Loans",
            "item": "https://indelmoney.com/consumer-durable-loans",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://indelmoney.com/consumer-durable-loans#faq",
        "url": "https://indelmoney.com/consumer-durable-loans",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is a Consumer Durable Loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A consumer durable loan is designed to finance the purchase of durable goods like appliances, electronics, and furniture.",
            },
          },
          {
            "@type": "Question",
            "name": "What items can I buy with a Consumer Durable Loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can buy a wide range of household appliances, electronics, and lifestyle products with our hassle-free consumer durable loans in India. These include items like refrigerators, air conditioners, washing machines, televisions, laptops, mobile phones, furniture, and even kitchen appliances like microwaves and dishwashers.",
            },
          },
          {
            "@type": "Question",
            "name": "Who is eligible to apply for a Consumer Durable Loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The applicant must be between 21 and 60 years of age. The loan is offered with a tenure of 6 months and is available exclusively to IMPL customers. Also, the loan must be secured with a gold ornament as collateral.",
            },
          },
          {
            "@type": "Question",
            "name": "Why should I choose Indel Money for Consumer Durable Loans?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Indel Money offers a quick and stress-free application process for consumer durable loans in India.With flexible repayment terms and competitive interest rates, Indel Money is the perfect choice for meeting your urgent financial needs..",
            },
          },
          {
            "@type": "Question",
            "name": "Are there any processing fees or hidden charges?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, there are no processing fees or hidden charges for CDL loans.",
            },
          },
          {
            "@type": "Question",
            "name": "How long does it take to get the loan approved?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CDL loans are processed quickly and follow a process similar to Gold Loans. In most cases, approval is prompt.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="schema-consumer-durable-loans"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <CDLoanClient contents={contents} benfits={benfits} products={products} initialIsMobile={isMobile} faqs={faqs} />
    </>
  );
}

// //export const dynamic = "force-dynamic";
// import ConsumerDurable from "@/components/features/services/ConsumerDurable";
// import ProductCovered from "@/components/features/services/ProductCovered";
// import FeatureBenefit from "@/components/features/services/FeatureBenefit";
// import MobEligibility from "@/components/features/services/MobEligibility";
// import { defaultMeta } from "@/constants/constants";

// async function fetchData() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/cd-loan`, {
//       // cache: "no-store", // Ensure fresh data
//       cache: "force-cache",
//       next: { revalidate: 600 },
//     });
//     const result = await response.json();
//     const cdData = result.data;

//     if (result.status === "success") {
//       return {
//         contents: cdData?.cdLoanContent,
//         benfits: cdData?.cdLoanBenefits,
//         products: cdData?.cdLoanProducts,
//         error: result.message,
//       };
//     }
//     return { contents: null, benfits: null, products: null, error: result.message };
//   } catch (error) {
//     return { contents: null, benfits: null, products: null, error: "Failed to fetch service data" };
//   }
// }

// async function getMetaData() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=cdloan`, {
//       cache: "force-cache",
//       next: { revalidate: 600 },
//     });
//     const result = await response.json();
//     const meta = result.data;

//     if (result.status === "success") {
//       return {
//         title: meta?.meta_title || defaultMeta.title,
//         description: meta?.meta_description || defaultMeta.description,
//         keywords: meta?.meta_keywords || defaultMeta.keywords,
//         // Enhanced SEO fields
//         openGraph: {
//           title: meta?.og_title || meta?.meta_title || defaultMeta.title,
//           description: meta?.og_description || meta?.meta_description || defaultMeta.description,
//           images: meta?.og_image ? [{ url: meta.og_image, width: 1200, height: 630 }] : [],
//           type: "website",
//           url: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
//         },
//         twitter: {
//           card: "summary_large_image",
//           title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
//           description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
//           images: meta?.twitter_image ? [meta.twitter_image] : [],
//         },
//         alternates: {
//           canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
//         },
//         error: null,
//       };
//     }
//     return {
//       title: defaultMeta.title,
//       description: defaultMeta.description,
//       keywords: defaultMeta.keywords,
//       openGraph: {
//         title: defaultMeta.title,
//         description: defaultMeta.description,
//         type: "website",
//         url: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: defaultMeta.title,
//         description: defaultMeta.description,
//       },
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
//       },
//       error: result.message || "No metadata found",
//     };
//   } catch (error) {
//     return {
//       title: defaultMeta.title,
//       description: defaultMeta.description,
//       keywords: defaultMeta.keywords,
//       openGraph: {
//         title: defaultMeta.title,
//         description: defaultMeta.description,
//         type: "website",
//         url: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: defaultMeta.title,
//         description: defaultMeta.description,
//       },
//       alternates: {
//         canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/consumer-durable-loans`,
//       },

//       error: result.message || "No metadata found",
//     };
//   }
// }

// export async function generateMetadata() {
//   const { title, description, keywords, twitter, openGraph, alternates } = await getMetaData();
//   return {
//     title,
//     description,
//     keywords,
//     twitter,
//     openGraph,
//     alternates,
//   };
// }

// export default async function Services() {
//   const { contents, benfits, products, error } = await fetchData();

//   if (!contents || !benfits || !products) {
//     return <div>Failed to data</div>;
//   }

//   return (
//     <>
//       {/* ConsumerDurable contents */}
//       <ConsumerDurable
//         page_title={contents?.page_title}
//         image={contents?.image}
//         image_alt={contents?.image_alt}
//         loan_offer_description={contents?.loan_offer_description}
//         loan_offer_title={contents?.loan_offer_title}
//         loan_offer_button_text={contents?.loan_offer_button_text}
//         loan_offer_button_link={contents?.loan_offer_button_link}
//       />

//       {/* ProductCovered contents */}
//       <ProductCovered
//         products={products}
//         title={contents?.covered_products_section_title}
//         image={contents?.covered_products_section_image}
//         criteriaTitle={contents?.eligibility_criteria_title}
//         criteriaIcon={contents?.eligibility_criteria_icon}
//         criteriaDescription={contents?.eligibility_criteria_description}
//         criteriaNote={contents?.eligibility_criteria_note}
//       />

//       {/* ConsumerDurable contents */}
//       <FeatureBenefit benefits={benfits} title={contents?.feature_title} image={contents?.feature_image} />

//       {/* Eligibility for mobile view contents */}
//       <div className="block sm:hidden">
//         <MobEligibility
//           criteriaTitle={contents?.eligibility_criteria_title}
//           criteriaIcon={contents?.eligibility_criteria_icon}
//           criteriaDescription={contents?.eligibility_criteria_description}
//           criteriaNote={contents?.eligibility_criteria_note}
//         />
//       </div>
//     </>
//   );
// }
