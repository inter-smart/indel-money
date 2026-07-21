//export const dynamic = "force-dynamic";
import CareerBanner from "@/components/features/career/CareerBanner";
import CareerLifeAtIndel from "@/components/features/career/CareerLifeAtIndel";
import MobCareerLifeAtIndel from "@/components/features/career/MobCareerLifeAtIndel";
import EmployeeTestimonials from "@/components/features/career/EmployeeTestimonials";
import FindJob from "@/components/features/career/FindJob";
import MakeYourMove from "@/components/features/career/MakeYourMove";
import BenefitsEmployee from "@/components/features/career/BenefitsEmployee";
import MobBenefitsEmployee from "@/components/features/career/MobBenefitsEmployee";
import { defaultMeta } from "@/constants/constants";

async function fetchData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/career`, {
      cache: "no-store", // Ensure fresh data
      // cache: "force-cache",
      // next: { revalidate: 600 },
    });

    const result = await response.json();
    const careerData = result.data;

    if (result.status === "success") {
      return {
        contents: careerData?.careersContent,
        gallery: careerData?.careerGallery,
        banners: careerData?.careerBanners,
        benefits: careerData?.empBenefits,
        awards: careerData?.awards,
        award_content: careerData?.awardContent,
        testimonials: careerData?.testimoinials,
        states: careerData?.careerStates,
        jobs: careerData?.careerJobs,
        error: null,
      };
    }

    return {
      contents: null,
      banners: null,
      benefits: null,
      gallery: null,
      awards: null,
      award_content: null,
      testimonials: null,
      states: null,
      jobs: null,
      error: result.message,
    };
  } catch (error) {
    return {
      contents: null,
      banners: null,
      benefits: null,
      gallery: null,
      awards: null,
      award_content: null,
      testimonials: null,
      states: null,
      jobs: null,
      error: "Failed to fetch career data",
    };
  }
}

async function getMetaData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/meta?page=career`, {
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
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/career`,
        },
        twitter: {
          card: "summary_large_image",
          title: meta?.twitter_title || meta?.meta_title || defaultMeta.title,
          description: meta?.twitter_description || meta?.meta_description || defaultMeta.description,
          images: meta?.twitter_image ? [meta.twitter_image] : [],
        },
        alternates: {
          canonical: meta?.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL}/career`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/career`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/career`,
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
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/career`,
      },
      twitter: {
        card: "summary_large_image",
        title: defaultMeta.title,
        description: defaultMeta.description,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/career`,
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

export default async function Career() {
  const { contents, banners, benefits, awards, gallery, testimonials, states, jobs, error } = await fetchData();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full h-auto bg-linear-to-b from-base1/10 to-base2/10">
      <CareerBanner banners={banners} />
      <FindJob
        states={states}
        jobs={jobs}
        find_job_title={contents?.find_job_title}
        find_job_button_name={contents?.find_job_button_name}
        find_job_button_link={contents?.find_job_button_link}
      />
      <MakeYourMove
        make_your_move_title={contents?.make_your_move_title}
        make_your_move_description={contents?.make_your_move_description}
        make_your_move_image={contents?.make_your_move_image}
        image_alt={contents?.image_alt}
        isGeneral={true}
      />
      <div id="life" className="hidden sm:block">
        <CareerLifeAtIndel
          gallery_title={contents?.gallery_title}
          gallery_sub_title={contents?.gallery_sub_title}
          gallery_description={contents?.gallery_description}
          gallery_button_text={contents?.gallery_button_text}
          gallery_button_link={contents?.gallery_button_link}
          gallery={gallery}
        />
      </div>
      <div className="block sm:hidden">
        <MobCareerLifeAtIndel
          gallery_title={contents?.gallery_title}
          gallery_sub_title={contents?.gallery_sub_title}
          gallery_description={contents?.gallery_description}
          gallery_button_text={contents?.gallery_button_text}
          gallery_button_link={contents?.gallery_button_link}
          gallery={gallery}
        />
      </div>
      <div className="hidden sm:block">
        <BenefitsEmployee benefits={benefits} benefits_title={contents?.benefits_title} />
      </div>
      <div className="block sm:hidden">
        <MobBenefitsEmployee benefits={benefits} benefits_title={contents?.benefits_title} />
      </div>
      <EmployeeTestimonials
        textTestimonials={testimonials.textTestimonials}
        videoTestimonials={testimonials.imageTestimonials}
        awards={awards}
        testimonial_button_link={contents?.testimonial_button_link}
        testimonial_button_name={contents?.testimonial_button_name}
        testimonial_description={contents?.testimonial_description}
        testimonial_title={contents?.testimonial_title}
        title={contents?.awards_title}
        description={contents?.awards_description}
      />
    </div>
  );
}
