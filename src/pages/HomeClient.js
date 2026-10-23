"use client";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@react-hook/media-query";
// DESKTOP COMPONENTS
const HeroBanner = dynamic(() => import("../components/features/home/HeroBanner"), { ssr: true });
const DreamsToReality = dynamic(() => import("../components/features/home/DreamsToReality"), { ssr: false });
const StepGoldLoan = dynamic(() => import("../components/features/home/StepGoldLoan"), { ssr: false });
const StepGoldLoanCalculator = dynamic(() => import("../components/features/home/StepGoldLoanCalculator"), { ssr: false });
const LifeAtIndel = dynamic(() => import("../components/features/home/LifeAtIndel"), { ssr: false });
const LatestUpdates = dynamic(() => import("../components/features/home/LatestUpdates"), { ssr: false });
const BranchLocator = dynamic(() => import("../components/features/home/BranchLocator"), { ssr: false });
// Innovations section is hidden; app download buttons now live in AppDownloadStrip
// const Innovations = dynamic(() => import("../components/features/home/Innovations"), { ssr: false });
const AppDownloadStrip = dynamic(() => import("../components/features/home/AppDownloadStrip"), { ssr: false });
const FAQ = dynamic(() => import("../components/features/home/FAQ"), { ssr: false });
const WelcomeModal = dynamic(() => import("../components/common/WelcomeModal"), { ssr: false });

// MOBILE COMPONENTS
const MobHeroBanner = dynamic(() => import("../components/features/home/MobHeroBanner"), { ssr: true });
const MobSmartMoneyDeals = dynamic(() => import("../components/features/home/MobSmartMoneyDeals"), { ssr: false });
const MobStepGoldLoan = dynamic(() => import("../components/features/home/MobStepGoldLoan"), { ssr: false });
const MobStepGoldLoanCalculator = dynamic(() => import("../components/features/home/MobStepGoldLoanCalculator"), { ssr: false });
const MobBranchLocator = dynamic(() => import("../components/features/home/MobBranchLocator"), { ssr: false });
const MobJoinTeam = dynamic(() => import("../components/features/home/MobJoinTeam"), { ssr: false });
const MobLatestUpdates = dynamic(() => import("../components/features/home/MobLatestUpdates"), { ssr: false });
// const MobInnovations = dynamic(() => import("../components/features/home/MobInnovations"), { ssr: false });
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
      {/* welcome contents*/}

      {isMobile ? (
        <MobWelcomeModal banner={banner} serviceBanner={serviceBanner} key={1} />
      ) : (
        <WelcomeModal banner={banner} serviceBanner={serviceBanner} key={2} />
      )}

      {isMobile ? (
        <MobHeroBanner
          heroBanner={initialData?.heroBanner || []}
          initialData={initialData}
          announcement={initialData?.pageContent?.announcement_text}
          goldRate={goldRate}
        />
      ) : (
        <HeroBanner
          heroBanner={initialData?.heroBanner || []}
          initialData={initialData}
          announcement={initialData?.pageContent?.announcement_text}
          goldRate={goldRate}
        />
      )}

      {isMobile ? (
        <MobSmartMoneyDeals title={initialData?.pageContent?.smart_deal_title} deals={initialData?.smartMoneyDeals} />
      ) : (
        <DreamsToReality initialData={initialData?.pageContent} statsData={initialData?.homeStatistics} />
      )}

      {isMobile ? (
        <MobStepGoldLoan title={initialData?.pageContent?.step_title} loanSteps={initialData?.loanSteps} />
      ) : (
        <StepGoldLoan
          title={initialData?.pageContent?.step_title}
          loanSteps={initialData?.loanSteps}
          sectionTitle={initialData?.pageContent?.step_title}
        />
      )}

      {isMobile ? <MobStepGoldLoanCalculator goldRate={goldRate} /> : <StepGoldLoanCalculator goldRate={goldRate} />}

      {isMobile ? (
        <MobBranchLocator pageContent={branchLocatorData} />
      ) : (
        <BranchLocator pageContent={branchLocatorData} variant={"home"} useQueryParams={false} />
      )}

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

      {isMobile ? (
        <MobLatestUpdates sliderItems={initialData?.blogs} sliderTitle={initialData?.pageContent?.updates_section_title} type="indel-money-cares" />
      ) : (
        <LatestUpdates sliderItems={initialData?.blogs} sliderTitle={initialData?.pageContent?.updates_section_title} type="indel-money-cares" />
      )}

      {/* Innovations section hidden
      {isMobile ? <MobInnovations pageContent={initialData?.pageContent} /> : <Innovations pageContent={initialData?.pageContent} />}
      */}

      {/* faq contents */}
      <div className="hidden sm:block">
        <FAQ faqs={initialData?.faqs} pageContents={initialData?.pageContent} type={"home"} />
      </div>

      {/* app download buttons, just above the footer */}
      <AppDownloadStrip pageContent={initialData?.pageContent} />
    </>
  );
}
