//export const dynamic = "force-dynamic";
import Script from "next/script";
import { defaultMeta } from "@/constants/constants";
import GoldLoanClient from "../../pages/GoldLoanClient";
import { headers } from "next/headers";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

async function fetchGoldLoanData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/gold-loan`, locale), {
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

async function fetchGoldRate(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/gold-rate`, locale), {
      cache: "force-cache",
      next: { revalidate: 600 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { data: null, error: `Gold rate API responded with ${response.status}` };
    }

    const result = await response.json();

    if (result?.success && result?.goldRate) {
      return { data: result.goldRate, error: null };
    }

    return { data: null, error: result?.message || "Invalid response from gold rate API" };
  } catch (error) {
    return { data: null, error: "Failed to fetch gold rate" };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=goldloan`, locale));
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

export default async function GoldLoan() {
  const locale = await getServerLocale();
  const { steps, contents, bannerIcons, schemes, faqs, features, GoldloanBenefits, announcement } = await fetchGoldLoanData(locale);
  const flattenedFeatures = features?.flat()?.filter((item) => !item.is_center);
  const { data: goldRateData, error: goldRateError } = await fetchGoldRate(locale);

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
        logo: "https://indelmoney.com/_next/image?url=https%3A%2F%2Fbackend.indelmoney.com%2Fuploads%2Fheader-contents%2F1751028562747.svg&w=256&q=75",
        description: "Apply for Gold Loan Online in India with Indel money. Get instant approval, low-interest rates, secure your gold for hassle-free funds today!",
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
          description: "Apply for Gold Loan Online in India with Indel money. Get instant approval, low-interest rates, secure your gold for hassle-free funds today!",
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
              text: "A loan obtained by securing your gold jewelry with the lender is called a gold loan. You will receive instant funds on pledging your gold ornaments, thus it can also be called a loan against gold. This way the gold ornaments and jewelry that were secured in the lockers are now mobilized to generate funds.",
            },
          },
          {
            "@type": "Question",
            name: "How does a gold loan work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Quite like other secured loans, you can opt for a gold loan easily. The entire process of a gold loan is quite similar to other secured loans. Simply walk in any of our branches with your gold ornaments, fill in and submit the required documents. After evaluating the documents and the gold articles, our officer will sanction the Loan amount.",
            },
          },
          {
            "@type": "Question",
            name: "What is the benefit of getting a gold loan from Indel Money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can get various benefits by getting gold loans from Indel Money. You can avail gold loan at low-interest rates with us. We have a simple and hassle-free documentation process with various options of repayment and also have an in-house evaluation. We further ensure the security of your gold with our safe gold storage. Also Indel Money values a long standing relationship with you, once you opt in for our services.",
            },
          },
          {
            "@type": "Question",
            name: "What is the gold loan interest rate?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Generally, a gold loan interest rate varies from 12% to 30% per year. You can repay the amount of gold loan within 1 day to 2 years (depending upon the scheme terms and conditions) in EMI or any other available options to repay the interest along with the principal.",
            },
          },
          {
            "@type": "Question",
            name: "Am I a good candidate for a gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Any Indian Citizen who is either a salaried professional, or businessman, or housewife, and who owns gold ornaments is a good candidate for gold loan.",
            },
          },
          {
            "@type": "Question",
            name: "Is my gold secure when opting for a gold loan from Indel Money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, it is. Indel Money has special safe rooms to secure your gold. These rooms have CCTV camera surveillance installed to get 24X7 safety in each of our 191 branches across Tamil Nadu, Kerala, Karnataka, Telangana, Andhra Pradesh & Puducherry.",
            },
          },
          {
            "@type": "Question",
            name: "Why choose gold loan instead of a personal loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Unlike a personal loan, the gold loan does not involve processing fees or pre-payment charges. Plus, it offers a higher loan limit than the personal loan with a lower interest rate. Also, Gold Loans have flexible repayment options, unlike most of the personal loan schemes.",
            },
          },
          {
            "@type": "Question",
            name: "How is a gold loan calculated at Indel Money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The loan amount is determined after evaluating the eligible gold's purity and value, along with the applicable loan scheme and lending criteria.",
            },
          },
          {
            "@type": "Question",
            name: "Can NBFCs like Indel Money lend money against gold?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Eligible non-banking financial companies can provide gold loans subject to applicable regulatory requirements and lending conditions.",
            },
          },
          {
            "@type": "Question",
            name: "What type of gold can I pledge to get a gold loan from Indel Money?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Eligible gold jewellery, such as necklaces, rings and bracelets, may be accepted subject to the lender's valuation process and applicable terms.",
            },
          },
          {
            "@type": "Question",
            name: "What are the documents required for a gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Required documents depend on the lender's policies and applicable requirements. Identity and address proof may be requested. Contact Indel Money to confirm the currently accepted documents before applying.",
            },
          },
          {
            "@type": "Question",
            name: "What happens if the gold loan is not repaid?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Failure to repay a gold loan may result in additional charges and other actions permitted under the loan agreement and applicable regulations, potentially including auction of the pledged gold after the required process.",
            },
          },
          {
            "@type": "Question",
            name: "What are my different options for repayment of my gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Repayment options depend on the gold loan scheme. Contact your nearest Indel Money branch to confirm the available options, payment schedule and applicable charges.",
            },
          },
          {
            "@type": "Question",
            name: "What is the best way to apply for an Indel Money gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can contact Indel Money on 1800 4253 990 or visit a branch to enquire about applying for a gold loan. Check the official website for current online application options.",
            },
          },
          {
            "@type": "Question",
            name: "What is the location and timing of the Indel Money branch closest to me?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can enquire about branch locations through the official Indel Money website or by calling 1800 4253 990. Branch timings may vary, so confirm the hours with the relevant branch before visiting.",
            },
          },
          {
            "@type": "Question",
            name: "What is the minimum and maximum amount of gold loan that I can get?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The amount available depends on the eligible gold's valuation, the selected loan scheme and the lender's eligibility criteria. Contact Indel Money for the current minimum and maximum loan amounts.",
            },
          },
          {
            "@type": "Question",
            name: "What is the tenure for which I can avail a gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Gold loan tenure depends on the selected scheme and its terms and conditions. Confirm the available repayment periods with Indel Money before applying.",
            },
          },
          {
            "@type": "Question",
            name: "Can I get a gold loan by pledging gold coins?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Whether gold coins are accepted depends on applicable regulations and the lender's policies. Contact Indel Money to confirm which forms of gold collateral are eligible.",
            },
          },
          {
            "@type": "Question",
            name: "Is it mandatory to have a co-applicant when applying for an Indel Money gold loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A co-applicant requirement depends on the lender's eligibility criteria and the circumstances of the application. Contact Indel Money to confirm whether one is required.",
            },
          },
          {
            "@type": "Question",
            name: "How fast will my gold loan application be processed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Processing time depends on document verification, gold valuation, eligibility and the applicable loan process. Carry the required documents and eligible gold when visiting a branch.",
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
