//export const dynamic = "force-dynamic";
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

  return (
    <>
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
