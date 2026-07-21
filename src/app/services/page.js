//export const dynamic = "force-dynamic";
import ServiceBanner from "@/components/features/services/ServiceBanner";
import OtherGoldLoan from "@/components/features/services/OtherGoldLoan";
import SmartMoneyDeal from "@/components/features/services/SmartMoneyDeal";
import IndelRemit from "@/components/features/services/IndelRemit";
import { defaultMeta } from "@/constants/constants";

async function fetchManagementData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/our-services`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const serviceData = result.data;

    if (result.status === "success") {
      return {
        serviceContent: serviceData.serviceContent,
        services: serviceData.services,
        serviceBenefit: serviceData.serviceBenefit,
        error: null,
      };
    }
    return { serviceContent: null, services: null, serviceBenefit: null, error: result.message };
  } catch (error) {
    return { serviceContent: null, services: null, serviceBenefit: null, error: "Failed to fetch service data" };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=services`);
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/services`,
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

export default async function Services() {
  const { serviceContent, services, serviceBenefit, error } = await fetchManagementData();

  if ((!serviceContent && !services && !serviceBenefit) || error) {
    return <div>Failed to fetch service data</div>;
  }

  return (
    <div className="relative">
      <div className="absolute bottom-[7%] left-0 w-full h-[65%] md:h-[55%] xl:h-[59%] bg-gradient-to-r from-[rgba(243,0,0,0)] to-[rgba(235,2,8,0.10)] z-0 sm:block hidden"></div>

      {/* InnerBanner contents */}
      <ServiceBanner
        page_title={serviceContent?.page_title}
        page_super_title={serviceContent?.page_super_title}
        image={serviceContent?.banner_image}
        alt={serviceContent?.banner_alt}
      />

      {/* SmartMoneyDeal contents */}
      <SmartMoneyDeal
        deals_description={serviceContent?.deals_description}
        deals_title={serviceContent?.deals_title}
        benfits_title={serviceContent?.benfits_title}
        title={serviceContent?.gold_loan_title}
        desc={serviceContent?.gold_title_description}
        image={serviceContent?.gold_loan_image}
        alt={serviceContent?.gold_loan_image_alt}
        serviceBenefit={serviceBenefit}
      />

      {/* OtherGoldLoan contents */}
      <OtherGoldLoan services={services} />

      {/* IndelRemit contents */}
      <IndelRemit
        remit_section_description={serviceContent?.remit_section_description}
        remit_section_title={serviceContent?.remit_section_title}
        image={serviceContent?.image}
        remit_section_button_link={serviceContent?.remit_section_button_link}
        remit_section_button_title={serviceContent?.remit_section_button_title}
      />
    </div>
  );
}
