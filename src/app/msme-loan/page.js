//export const dynamic = "force-dynamic";
import Script from "next/script";
import MsmeLoanClient from "@/pages/MsmeClient";
import { headers } from "next/headers";
import { getServerLocale } from "@/lib/locale/getServerLocale";
import { buildLocalizedUrl } from "@/lib/locale/localizedUrl";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}
async function fetchData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/msme`, locale), {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();
    const msmeData = result.data;

    if (result.status === "success") {
      return {
        contents: msmeData?.msmeLoanContent,
        offerings: msmeData?.msmeOfferings,
        faqs: msmeData?.msmeLoanFaq,
        loanTypes: msmeData?.msmeLoanTypes,
        industries: msmeData?.msmeLoanSupportedIndustries,
        audience: msmeData?.msmeTargetedAudience,
        error: result.message,
      };
    }
    return {
      contents: null,
      offerings: null,
      faqs: null,
      loanTypes: null,
      industries: null,
      audience: null,
      error: result.message,
    };
  } catch (error) {
    return {
      contents: null,
      offerings: null,
      faqs: null,
      loanTypes: null,
      industries: null,
      audience: null,
      error: "Failed to fetch service data",
    };
  }
}
async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=msme`, locale));
    const result = await response.json();
    const meta = result.data;

    if (result.status === "success") {
      return {
        title: meta?.meta_title || "MSME Loan | My Website",
        description: meta?.meta_description || "Get the best MSME loan offers with us.",
        keywords: meta?.meta_keywords || "msme loan, offers, financial services",
        error: null,
      };
    }
    return {
      title: "MSME Loan | My Website",
      description: "Get the best MSME loan offers with us.",
      keywords: "msme loan, offers, financial services",
      error: result.message,
    };
  } catch (error) {
    return {
      title: "MSME Loan | My Website",
      description: "Get the best MSME loan offers with us.",
      keywords: "msme loan, offers, financial services",
      error: "Failed to fetch service data",
    };
  }
}

export async function generateMetadata() {
  const locale = await getServerLocale();
  const { title, description, keywords } = await getMetaData(locale);

  return {
    title,
    description,
    keywords,
  };
}

export default async function MsmeLoan() {
  const locale = await getServerLocale();
  const { contents, offerings, faqs, loanTypes, industries, audience, error } = await fetchData(locale);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = isMobileDevice(userAgent);

  if (error) {
    return <div>Failed to fetch MSME data</div>;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "name": "Indel Money Limited",
        "url": "https://indelmoney.com/msme-loan",
        "logo": "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fbanner%2F1763029961331-201441951.jpg&w=1920&q=75",
        "description": "Indel Money offers MSME loans designed to support Micro, Small and Medium Enterprises with quick approval, minimal documentation and flexible funding.",
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
        "serviceType": "MSME Loan",
        "provider": {
          "@type": "Organization",
          "name": "Indel Money Limited",
          "url": "https://indelmoney.com/"
        },
        "areaServed": "IN",
        "offers": {
          "@type": "Offer",
          "name": "MSME Loan",
          "description": "MSME business loans with fast approval, minimal documentation and flexible funding options.",
          "url": "https://indelmoney.com/msme-loan"
        },
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
        "name": "MSME Loan - Indel Money",
        "url": "https://indelmoney.com/msme-loan",
        "description": "Apply for an MSME loan from Indel Money with quick approval, minimal documentation, and flexible loan solutions for Micro, Small, and Medium Enterprises."
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
            "name": "MSME Loan",
            "item": "https://indelmoney.com/msme-loan"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is an MSME loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An acronym for Micro, Small, and Medium Enterprise loan, an MSME loan is the fund or amount that you may require for your business to grow. It is an unsecured loan that most financial institutions generally offer. But as a business owner, you need to meet certain eligibility criteria defined by the Indian Government and RBI. It is a loan that supports these enterprises in terms of finance, infrastructure, and other areas."
            }
          },
          {
            "@type": "Question",
            "name": "How can I apply for an MSME loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The application process for an MSME loan at Indel Money is quite simple, secure, and speedy. You need to provide valid personal and business information details in the application form and submit it for evaluation. If approved, then you can avail the loan within 2 days."
            }
          },
          {
            "@type": "Question",
            "name": "Who is eligible for MSME?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Every financial institution has set particular eligibility criteria for acquiring an MSME loan from them. Some common criteria include: You should be a citizen of India. You should be between 25 and 55 years of age. Your business should have an experience of at least 3 years. You should have filed income tax returns for at least the past year for your business. You should have the past year's turnover of your business audited by a CA. You must have a good credit score of above 650 to get your loan approved."
            }
          },
          {
            "@type": "Question",
            "name": "What are the documents required for an MSME loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Along with a duly filled application form, you would require an attested copy of any of these: Passport, driving license, PAN card number, voter's identity card, Aadhar Card, Driving License, Identity Card issued by Employer (if employed in State /Central Government), as identity proof. Passport, Bank Account Statement, Voter Identity Card, Current Telephone /Electricity Bill, Aadhar Card, Driving License as residential proof. PAN Card, Driving License, Aadhar Card, Passport, Banker's Verification as signature proof. Current Telephone / Electricity Bill, Shop & Establishment Act Certificate, GST / VAT Certificate as proof of office."
            }
          },
          {
            "@type": "Question",
            "name": "What financial documents are required to avail an MSME loan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Bank statement of the previous year, proof of your business registration, an attested PAN Card copy and that of your partner (if any), attested copy of your Aadhar Card and that of your partner (if any), partnership deed copy (in case of any partnership), P & L and balance sheet copy of last 2 years, sales tax documents and municipal tax document."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="schema-msme-loan"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <MsmeLoanClient
        contents={contents}
        offerings={offerings}
        faqs={faqs}
        loanTypes={loanTypes}
        industries={industries}
        audience={audience}
        initialIsMobile={isMobile}
      />
    </>
  );
}
