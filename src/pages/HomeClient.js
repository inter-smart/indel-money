"use client";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@react-hook/media-query";
import LazySection from "../components/common/LazySection";

const sectionLoading = (heightClass) => () => (
  <div className={`w-full ${heightClass} animate-pulse rounded-[15px] bg-gray-200`} />
);

const SECTION_HEIGHT = {
  deals: "min-h-[360px] lg:min-h-[480px]",
  steps: "min-h-[320px] lg:min-h-[420px]",
  calculator: "min-h-[480px] lg:min-h-[560px]",
  branchLocator: "min-h-[560px] lg:min-h-[640px]",
  joinTeam: "min-h-[420px] lg:min-h-[480px]",
  latestUpdates: "min-h-[420px] lg:min-h-[530px] xl:min-h-[586px] 2xl:min-h-[700px]",
  innovations: "min-h-[220px] lg:min-h-[320px]",
  faq: "min-h-[480px] lg:min-h-[600px]",
};

// DESKTOP COMPONENTS
const HeroBanner = dynamic(
  () => import("../components/features/home/HeroBanner"),
  { ssr: true },
);
const DreamsToReality = dynamic(
  () => import("../components/features/home/DreamsToReality"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.deals) },
);
const StepGoldLoan = dynamic(
  () => import("../components/features/home/StepGoldLoan"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.steps) },
);
const StepGoldLoanCalculator = dynamic(
  () => import("../components/features/home/StepGoldLoanCalculator"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.calculator) },
);
const LifeAtIndel = dynamic(
  () => import("../components/features/home/LifeAtIndel"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.joinTeam) },
);
const LatestUpdates = dynamic(
  () => import("../components/features/home/LatestUpdates"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.latestUpdates) },
);
const BranchLocator = dynamic(
  () => import("../components/features/home/BranchLocator"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.branchLocator) },
);
const Innovations = dynamic(
  () => import("../components/features/home/Innovations"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.innovations) },
);
const FAQ = dynamic(() => import("../components/features/home/FAQ"), {
  ssr: false,
  loading: sectionLoading(SECTION_HEIGHT.faq),
});
const WelcomeModal = dynamic(
  () => import("../components/common/WelcomeModal"),
  { ssr: false },
);

// MOBILE COMPONENTS
const MobHeroBanner = dynamic(
  () => import("../components/features/home/MobHeroBanner"),
  { ssr: true },
);
const MobSmartMoneyDeals = dynamic(
  () => import("../components/features/home/MobSmartMoneyDeals"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.deals) },
);
const MobStepGoldLoan = dynamic(
  () => import("../components/features/home/MobStepGoldLoan"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.steps) },
);
const MobStepGoldLoanCalculator = dynamic(
  () => import("../components/features/home/MobStepGoldLoanCalculator"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.calculator) },
);
const MobBranchLocator = dynamic(
  () => import("../components/features/home/MobBranchLocator"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.branchLocator) },
);
const MobJoinTeam = dynamic(
  () => import("../components/features/home/MobJoinTeam"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.joinTeam) },
);
const MobLatestUpdates = dynamic(
  () => import("../components/features/home/MobLatestUpdates"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.latestUpdates) },
);
const MobInnovations = dynamic(
  () => import("../components/features/home/MobInnovations"),
  { ssr: false, loading: sectionLoading(SECTION_HEIGHT.innovations) },
);
const MobWelcomeModal = dynamic(
  () => import("../components/common/MobWelcomeModal"),
  { ssr: false },
);
// import MobWelcomeModal from "../components/common/MobWelcomeModal";

export default function Home({
  initialData,
  serviceBanner,
  banner,
  branchLocatorData,
  goldRate,
  initialIsMobile,
}) {
  // const isMobile = useMediaQuery("only screen and (max-width: 768px)");

  // Use media query for client-side viewport detection
  const isMobileViewport = useMediaQuery("only screen and (max-width: 768px)");
  // Combine server-side and client-side detection (client takes precedence after hydration)
  const isMobile =
    typeof window !== "undefined" ? isMobileViewport : initialIsMobile;

  return (
    <>
      {/* welcome contents*/}

      {isMobile ? (
        // <MobWelcomeModal banner={banner} serviceBanner={serviceBanner} key={1} />
        <></>
      ) : (
        <WelcomeModal banner={banner} serviceBanner={serviceBanner} key={2} />
      )}

      {isMobile ? (
        // <MobHeroBanner
        //   heroBanner={initialData?.heroBanner || []}
        //   initialData={initialData}
        //   announcement={initialData?.pageContent?.announcement_text}
        //   goldRate={goldRate}
        // />
        <></>
      ) : (
        <HeroBanner
          heroBanner={initialData?.heroBanner || []}
          initialData={initialData}
          announcement={initialData?.pageContent?.announcement_text}
          goldRate={goldRate}
        />
      )}

      <LazySection placeholderClassName={SECTION_HEIGHT.deals}>
        {isMobile ? (
          <MobSmartMoneyDeals
            title={initialData?.pageContent?.smart_deal_title}
            deals={initialData?.smartMoneyDeals}
          />
        ) : (
          <DreamsToReality
            initialData={initialData?.pageContent}
            statsData={initialData?.homeStatistics}
          />
        )}
      </LazySection>

      <LazySection placeholderClassName={SECTION_HEIGHT.steps}>
        {isMobile ? (
          <MobStepGoldLoan
            title={initialData?.pageContent?.step_title}
            loanSteps={initialData?.loanSteps}
          />
        ) : (
          <StepGoldLoan
            title={initialData?.pageContent?.step_title}
            loanSteps={initialData?.loanSteps}
            sectionTitle={initialData?.pageContent?.step_title}
          />
        )}
      </LazySection>

      <LazySection placeholderClassName={SECTION_HEIGHT.calculator}>
        {isMobile ? (
          <MobStepGoldLoanCalculator goldRate={goldRate} />
        ) : (
          <StepGoldLoanCalculator goldRate={goldRate} />
        )}
      </LazySection>

      <LazySection placeholderClassName={SECTION_HEIGHT.branchLocator}>
        {isMobile ? (
          <MobBranchLocator pageContent={branchLocatorData} />
        ) : (
          <BranchLocator
            pageContent={branchLocatorData}
            variant="home"
            useQueryParams={false}
          />
        )}
      </LazySection>

      <LazySection placeholderClassName={SECTION_HEIGHT.joinTeam}>
        {isMobile ? (
          <MobJoinTeam
            pageContent={initialData?.pageContent}
            lifeAtIndel={initialData?.lifeAtIndel}
            image1={initialData?.pageContent?.life_section_image1}
            image2={initialData?.pageContent?.life_section_image2}
            image3={initialData?.pageContent?.life_section_image3}
          />
        ) : (
          <LifeAtIndel
            pageContent={initialData?.pageContent}
            lifeAtIndel={initialData?.lifeAtIndel}
            image1={initialData?.pageContent?.life_section_image1}
            image2={initialData?.pageContent?.life_section_image2}
            image3={initialData?.pageContent?.life_section_image3}
          />
        )}
      </LazySection>

      <LazySection placeholderClassName={SECTION_HEIGHT.latestUpdates}>
        {isMobile ? (
          <MobLatestUpdates
            sliderItems={initialData?.blogs}
            sliderTitle={initialData?.pageContent?.updates_section_title}
            type="indel-money-cares"
          />
        ) : (
          <LatestUpdates
            sliderItems={initialData?.blogs}
            sliderTitle={initialData?.pageContent?.updates_section_title}
            type="indel-money-cares"
          />
        )}
      </LazySection>

      <LazySection placeholderClassName={SECTION_HEIGHT.innovations}>
        {isMobile ? (
          <MobInnovations pageContent={initialData?.pageContent} />
        ) : (
          <Innovations pageContent={initialData?.pageContent} />
        )}
      </LazySection>

      {!isMobile && (
        <LazySection placeholderClassName={SECTION_HEIGHT.faq}>
          <FAQ faqs={initialData?.faqs} pageContents={initialData?.pageContent} type="home" />
        </LazySection>
      )}
    </>
  );
}
