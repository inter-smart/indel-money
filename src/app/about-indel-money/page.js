//export const dynamic = "force-dynamic";
import AboutBanner from "../../components/features/about/AboutBanner";
import AboutFinacial from "../../components/features/about/AboutFinacial";
import AboutSupermarket from "../../components/features/about/AboutSupermarket";
import AboutMessage from "../../components/features/about/AboutMessage";
import Accolades from "../../components/features/about/Accolades";
import Indelvalues from "../../components/features/about/IndelValuesInfo";
import Investors from "../../components/features/about/InvestorsInfo";
import LifeIndel from "../../components/features/about/LifeIndelInfo";
import { defaultMeta } from "@/constants/constants";

// MOBILE_VERSION
import MobAboutFinacial from "../../components/features/about/MobAboutFinacial";
import MobAboutSupermarket from "../../components/features/about/MobAboutSupermarket";
import MobAboutMessage from "../../components/features/about/MobAboutMessage";
import MobAccolades from "../../components/features/about/MobAccolades";
import MobIndelValuesInfo from "../../components/features/about/MobIndelValuesInfo";
import MobInvestors from "../../components/features/about/MobInvestorsInfo";
import MobLifeIndel from "../../components/features/about/MobLifeIndelInfo";
import { getServerLocale } from "../../lib/locale/getServerLocale";
import { buildLocalizedUrl } from "../../lib/locale/localizedUrl";

async function fetchAboutData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/about`, locale), {
      // cache: "no-store",
      cache: "force-cache",
      next: { revalidate: 600 },
    });
    const result = await response.json();

    if (result.status === "success") {
      return { data: result.data, error: null };
    }
    return { data: null, error: result.message };
  } catch (error) {
    return { data: null, error: "Failed to about data" };
  }
}

async function getMetaData(locale) {
  try {
    const response = await fetch(buildLocalizedUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=about`, locale));
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-indel-money`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/about-indel-money`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-indel-money`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about-indel-money`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-indel-money`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about-indel-money`,
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

export default async function About() {
  const locale = await getServerLocale();
  const { data, error } = await fetchAboutData(locale);

  if (!data) {
    return <div>Failed to fetch about data</div>;
  }

  return (
    <>
      {/* Banner section */}
      <AboutBanner banners={data?.aboutBanner} />

      {/* Financial Partner section */}
      <div className="hidden sm:block">
        <AboutFinacial
          statsData={data?.statsData}
          super_title={data?.aboutContent?.overview_super_title}
          title={data?.aboutContent?.overview_title}
          sub_title={data?.aboutContent?.overview_sub_title}
          description={data?.aboutContent?.overview_description}
        />
      </div>
      <div className="block sm:hidden">
        <MobAboutFinacial
          statsData={data?.statsData}
          super_title={data?.aboutContent?.overview_super_title}
          title={data?.aboutContent?.overview_title}
          sub_title={data?.aboutContent?.overview_sub_title}
          description={data?.aboutContent?.overview_description}
        />
      </div>

      {/* Financial Supermarket section */}
      <div className="hidden sm:block">
        <AboutSupermarket
          serviceImages={data?.serviceImages}
          description={data?.aboutContent?.service_description}
          title={data?.aboutContent?.service_title}
          sub_title={data?.aboutContent?.service_sub_title}
        />
      </div>
      <div className="block sm:hidden">
        <MobAboutSupermarket
          serviceImages={data?.serviceImages}
          description={data?.aboutContent?.service_description}
          title={data?.aboutContent?.service_title}
        />
      </div>

      {/* Message section */}
      <div className="hidden sm:block">
        <AboutMessage messages={data?.teamMessages} />
      </div>
      <div className="block sm:hidden">
        <MobAboutMessage messages={data?.teamMessages} />
      </div>

      {/* Accolades section */}
      <div className="hidden sm:block">
        <Accolades accolades={data?.accolades} achievements_title={data?.aboutContent?.achievements_title} />
      </div>
      <div className="block sm:hidden">
        <MobAccolades accolades={data?.accolades} />
      </div>

      {/* Indelvalues section */}
      <div className="hidden sm:block">
        <Indelvalues links={data?.quickLinks} />
      </div>
      <div className="block sm:hidden">
        <MobIndelValuesInfo links={data?.quickLinks} />
      </div>

      {/* Investors section */}
      <div className="hidden sm:block">
        <Investors
          title={data?.aboutContent?.investors_title}
          buttonTitle={data?.aboutContent?.investors_button_title}
          buttonLink={data?.aboutContent?.investors_button_link}
          image1={data?.aboutContent?.investors_image_1}
          image2={data?.aboutContent?.investors_image_2}
          card1Title={data?.aboutContent?.investors_card1_title}
          card1SubTitle={data?.aboutContent?.investors_card1_sub_title}
          card2Title={data?.aboutContent?.investors_card2_title}
          card2SubTitle={data?.aboutContent?.investors_card2_sub_title}
          card3Title={data?.aboutContent?.investors_card3_title}
          card3SubTitle={data?.aboutContent?.investors_card3_sub_title}
          description={data?.aboutContent?.description}
        />
      </div>
      <div className="block sm:hidden">
        <MobInvestors
          title={data?.aboutContent?.investors_title}
          buttonTitle={data?.aboutContent?.investors_button_title}
          buttonLink={data?.aboutContent?.investors_button_link}
          card1Title={data?.aboutContent?.investors_card1_title}
          card1SubTitle={data?.aboutContent?.investors_card1_sub_title}
          card2Title={data?.aboutContent?.investors_card2_title}
          card2SubTitle={data?.aboutContent?.investors_card2_sub_title}
          card3Title={data?.aboutContent?.investors_card3_title}
          card3SubTitle={data?.aboutContent?.investors_card3_sub_title}
          description={data?.aboutContent?.description}
        />
      </div>

      {/* LifeAtIndel section */}
      <div id="life-at-indel" className="hidden sm:block">
        <LifeIndel
          title={data?.aboutContent?.life_at_indel_title}
          description={data?.aboutContent?.life_at_indel_description}
          buttonText={data?.aboutContent?.life_at_indel_button_text}
          buttonLink={data?.aboutContent?.life_at_indel_button_link}
          lifeImages={data?.lifeAtIndelImages}
        />
      </div>
      <div className="block sm:hidden">
        <MobLifeIndel
          title={data?.aboutContent?.life_at_indel_title}
          description={data?.aboutContent?.life_at_indel_description}
          buttonText={data?.aboutContent?.life_at_indel_button_text}
          buttonLink={data?.aboutContent?.life_at_indel_button_link}
          lifeImages={data?.lifeAtIndelImages}
        />
      </div>
    </>
  );
}
