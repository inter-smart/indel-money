//export const dynamic = "force-dynamic";
import Script from "next/script";
import { defaultMeta } from "@/constants/constants";
import GoldLoanClient from "../../pages/GoldLoanClient";
import { headers } from "next/headers";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

async function fetchGoldLoanData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/gold-loan`, {
      cache: "no-store",
      credentials: "include", // Ensures session cookie is sent
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    const goldloanData = result.data;

    if (result.status === "success") {
      return {
        steps: goldloanData.Steps,
        announcement: goldloanData.announcement,
        contents: goldloanData.GoldloanContent,
        bannerIcons: goldloanData.GoldloanBannerFeatures,
        schemes: goldloanData.schemes,
        faqs: goldloanData.GoldLoanFaq,
        features: goldloanData.GoldLoanFeatures,
        GoldloanBenefits: goldloanData.GoldloanBenefits,
        error: null,
      };
    }
    return {
      steps: null,
      contents: null,
      announcement: null,
      bannerIcons: null,
      GoldloanBenefits: null,
      schemes: null,
      faqs: null,
      features: null,
      error: result.message,
    };
  } catch (error) {
    return {
      steps: null,
      contents: null,
      announcement: null,
      bannerIcons: null,
      schemes: null,
      faqs: null,
      features: null,
      GoldloanBenefits: null,
      error: "Failed to fetch service data",
    };
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=goldloan`);
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/gold-loan`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/gold-loan`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/gold-loan`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/gold-loan`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/gold-loan`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/gold-loan`,
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

export default async function GoldLoan() {
  const { steps, contents, bannerIcons, schemes, faqs, features, GoldloanBenefits, announcement } = await fetchGoldLoanData();
  const flattenedFeatures = features?.flat()?.filter((item) => !item.is_center);
  const { data: goldRateData, error: goldRateError } = await fetchGoldRate();

  console.log("Faqs:", faqs);

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const isMobile = isMobileDevice(userAgent);
  if (!contents && !bannerIcons && !schemes && !faqs && !features) {
    return <div>Failed to fetch Gold Loan data</div>;
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        name: "Indel Money Limited",
        url: "https://indelmoney.com/gold-loan",
        logo: "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fbanner%2F1763029961331-201441951.jpg&w=1920&q=75",
        description: "Indel Money offers instant and secure gold loans with high LTV, easy approval, flexible repayment and safe storage.",
        telephone: "1800 4253 990",
        email: "care@indelmoney.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Indel House, Changampuzhanagar",
          addressLocality: "South Kalamassery P O",
          addressRegion: "Kerala",
          postalCode: "682033",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 10.043098838609305,
          longitude: 76.31735007301208,
        },
        sameAs: [
          "https://www.facebook.com/indelmoney",
          "https://www.instagram.com/indelmoney",
          "https://www.linkedin.com/company/indel-money",
          "https://twitter.com/indelmoney",
        ],
        serviceType: "Gold Loan",
        provider: {
          "@type": "Organization",
          name: "Indel Money Limited",
          url: "https://indelmoney.com/",
        },
        areaServed: "IN",
        offers: {
          "@type": "Offer",
          name: "Gold Loan",
          description: "Quick and secure gold loans with high LTV, transparent interest rates, and instant disbursal.",
          url: "https://indelmoney.com/gold-loan",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Branches",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "LocalBusiness",
                name: "Indel Money Limited",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Indel House, Changampuzhanagar",
                  addressLocality: "South Kalamassery P O",
                  addressRegion: "Kerala",
                  postalCode: "682033",
                  addressCountry: "IN",
                },
                telephone: "04842933979",
              },
            },
          ],
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:30",
            closes: "17:30",
          },
        ],
        paymentAccepted: "Cash, Credit Card, NEFT/IMPS",
        currenciesAccepted: "INR",
      },
      {
        "@type": "WebPage",
        name: "Gold Loan - Indel Money",
        url: "https://indelmoney.com/gold-loan",
        description: "Apply for an instant, secure and hassle-free gold loan from Indel Money with high LTV, low interest and quick approval.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://indelmoney.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Gold Loan",
            item: "https://indelmoney.com/gold-loan",
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A loan obtained by securing your gold jewelry with the lender is called a gold loan. You will receive instant funds on pledging your gold ornaments, thus it can also be called a loan against gold. This way your gold ornaments are mobilized to generate funds instead of lying idle.",
            },
          },
          {
            "@type": "Question",
            name: "How does a gold loan work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Walk into any Indel Money branch with your gold ornaments and documents. After evaluation and verification, the loan amount is sanctioned instantly.",
            },
          },
          {
            "@type": "Question",
            name: "What is the benefit of getting a gold loan from Indel Money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Indel Money offers low interest rates, minimal documentation, flexible repayment options, in-house gold valuation and secure storage, ensuring complete peace of mind.",
            },
          },
          {
            "@type": "Question",
            name: "What is the gold loan interest rate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Gold loan interest rates typically range from 12% to 30% annually depending on the scheme.",
            },
          },
          {
            "@type": "Question",
            name: "Am I a good candidate for a gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Any Indian citizen who owns gold ornaments can apply for a gold loan from Indel Money.",
            },
          },
          {
            "@type": "Question",
            name: "Is my gold secure with Indel Money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. All branches have CCTV-monitored secure vaults ensuring 24x7 safety of your pledged gold.",
            },
          },
          {
            "@type": "Question",
            name: "Why choose a gold loan over a personal loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Gold loans have lower interest, no prepayment charges, higher loan limits and more flexible repayment options compared to personal loans.",
            },
          },
          {
            "@type": "Question",
            name: "How fast is gold loan processing?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "With correct documents, gold loans at Indel Money are processed and disbursed in 10–15 minutes.",
            },
          },
        ],
      },
    ],
  };
  return (
    <>
      <Script
        id="schema-gold-loan"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <GoldLoanClient
        steps={steps}
        contents={contents}
        bannerIcons={bannerIcons}
        schemes={schemes}
        faqs={faqs}
        features={features}
        GoldloanBenefits={GoldloanBenefits}
        announcement={announcement}
        goldRateData={goldRateData}
        flattenedFeatures={flattenedFeatures}
        initialIsMobile={isMobile}
      />
    </>
  );
}
