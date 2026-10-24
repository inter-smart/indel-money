"use client";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@react-hook/media-query";
import LazySection from "../components/common/LazySection";

// Shared skeleton fallback for the moment a section's chunk is still
// downloading after LazySection has already decided to mount it. Sized to
// match that section's LazySection placeholder (see HEIGHT below) so the
// handoff from "not in view" -> "in view, loading" -> "loaded" never
// collapses to 0 height.
const sectionLoading = (heightClass) => () => <div className={`w-full ${heightClass} bg-gray-200 animate-pulse rounded-[15px]`} />;

// Approximate rendered heights per section (estimated from each component's
// own internal sizing, e.g. LatestUpdates/LatestUpdatesSlide's
// h-[420px] lg:h-[440px] xl:h-[468px] 2xl:h-[576px] pattern). These only need
// to be roughly right to reduce layout shift; adjust after a visual check.
const HEIGHT = {
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
const HeroBanner = dynamic(() => import("../components/features/home/HeroBanner"), { ssr: true });
const DreamsToReality = dynamic(() => import("../components/features/home/DreamsToReality"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.deals),
});
const StepGoldLoan = dynamic(() => import("../components/features/home/StepGoldLoan"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.steps),
});
const StepGoldLoanCalculator = dynamic(() => import("../components/features/home/StepGoldLoanCalculator"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.calculator),
});
const LifeAtIndel = dynamic(() => import("../components/features/home/LifeAtIndel"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.joinTeam),
});
const LatestUpdates = dynamic(() => import("../components/features/home/LatestUpdates"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.latestUpdates),
});
const BranchLocator = dynamic(() => import("../components/features/home/BranchLocator"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.branchLocator),
});
const Innovations = dynamic(() => import("../components/features/home/Innovations"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.innovations),
});
const FAQ = dynamic(() => import("../components/features/home/FAQ"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.faq),
});
const WelcomeModal = dynamic(() => import("../components/common/WelcomeModal"), { ssr: false });

// MOBILE COMPONENTS
const MobHeroBanner = dynamic(() => import("../components/features/home/MobHeroBanner"), { ssr: true });
const MobSmartMoneyDeals = dynamic(() => import("../components/features/home/MobSmartMoneyDeals"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.deals),
});
const MobStepGoldLoan = dynamic(() => import("../components/features/home/MobStepGoldLoan"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.steps),
});
const MobStepGoldLoanCalculator = dynamic(() => import("../components/features/home/MobStepGoldLoanCalculator"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.calculator),
});
const MobBranchLocator = dynamic(() => import("../components/features/home/MobBranchLocator"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.branchLocator),
});
const MobJoinTeam = dynamic(() => import("../components/features/home/MobJoinTeam"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.joinTeam),
});
const MobLatestUpdates = dynamic(() => import("../components/features/home/MobLatestUpdates"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.latestUpdates),
});
const MobInnovations = dynamic(() => import("../components/features/home/MobInnovations"), {
  ssr: false,
  loading: sectionLoading(HEIGHT.innovations),
});
const MobWelcomeModal = dynamic(() => import("../components/common/MobWelcomeModal"), { ssr: false });
// import MobWelcomeModal from "../components/common/MobWelcomeModal";

export default function Home({ initialData, serviceBanner, banner, branchLocatorData, goldRate, initialIsMobile }) {
  // const isMobile = useMediaQuery("only screen and (max-width: 768px)");

  // Use media query for client-side viewport detection
  const isMobileViewport = useMediaQuery("only screen and (max-width: 768px)");
  // Combine server-side and client-side detection (client takes precedence after hydration)
  const isMobile = typeof window !== "undefined" ? isMobileViewport : initialIsMobile;

  return (
    <>
      {/* welcome contents - eager, above the fold, intentionally not lazy */}

      {isMobile ? (
        <MobWelcomeModal banner={banner} serviceBanner={serviceBanner} key={1} />
      ) : (
        // <WelcomeModal banner={banner} serviceBanner={serviceBanner} key={2} />
        <></>
      )}

      {/* hero banner - eager, above the fold, intentionally not lazy */}
      {isMobile ? (
        <MobHeroBanner
          heroBanner={initialData?.heroBanner || []}
          initialData={initialData}
          announcement={initialData?.pageContent?.announcement_text}
          goldRate={goldRate}
        />
      ) : (
        // <HeroBanner
        //   heroBanner={initialData?.heroBanner || []}
        //   initialData={initialData}
        //   announcement={initialData?.pageContent?.announcement_text}
        //   goldRate={goldRate}
        // />
        <></>
      )}

      <LazySection placeholderClassName={HEIGHT.deals}>
        {isMobile ? (
          <MobSmartMoneyDeals title={initialData?.pageContent?.smart_deal_title} deals={initialData?.smartMoneyDeals} />
        ) : (
          <DreamsToReality initialData={initialData?.pageContent} statsData={initialData?.homeStatistics} />
        )}
      </LazySection>

      <LazySection placeholderClassName={HEIGHT.steps}>
        {isMobile ? (
          <MobStepGoldLoan title={initialData?.pageContent?.step_title} loanSteps={initialData?.loanSteps} />
        ) : (
          <StepGoldLoan
            title={initialData?.pageContent?.step_title}
            loanSteps={initialData?.loanSteps}
            sectionTitle={initialData?.pageContent?.step_title}
          />
        )}
      </LazySection>

      <LazySection placeholderClassName={HEIGHT.calculator}>
        {isMobile ? <MobStepGoldLoanCalculator goldRate={goldRate} /> : <StepGoldLoanCalculator goldRate={goldRate} />}
      </LazySection>

      <LazySection placeholderClassName={HEIGHT.branchLocator}>
        {isMobile ? (
          <MobBranchLocator pageContent={branchLocatorData} />
        ) : (
          <BranchLocator pageContent={branchLocatorData} variant={"home"} useQueryParams={false} />
        )}
      </LazySection>

      <LazySection placeholderClassName={HEIGHT.joinTeam}>
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

      <LazySection placeholderClassName={HEIGHT.latestUpdates}>
        {isMobile ? (
          <MobLatestUpdates
            sliderItems={initialData?.blogs}
            sliderTitle={initialData?.pageContent?.updates_section_title}
            type="indel-money-cares"
          />
        ) : (
          <LatestUpdates sliderItems={initialData?.blogs} sliderTitle={initialData?.pageContent?.updates_section_title} type="indel-money-cares" />
        )}
      </LazySection>

      <LazySection placeholderClassName={HEIGHT.innovations}>
        {isMobile ? <MobInnovations pageContent={initialData?.pageContent} /> : <Innovations pageContent={initialData?.pageContent} />}
      </LazySection>

      {/* faq contents - desktop/tablet only. Previously rendered (and its JS
          chunk downloaded + mounted) on mobile too, just CSS-hidden via
          `hidden sm:block`. Now it's never rendered at all on mobile, and is
          also lazy-mounted on desktop like every other section. */}
      {!isMobile && (
        <LazySection placeholderClassName={HEIGHT.faq}>
          <FAQ faqs={initialData?.faqs} pageContents={initialData?.pageContent} type={"home"} />
        </LazySection>
      )}
    </>
  );
}
