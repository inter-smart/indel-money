"use client";
import dynamic from "next/dynamic";

const ServiceBanner = dynamic(() => import("../components/features/goldLoan/ServiceBanner"), { ssr: true });
const StepGoldLoan = dynamic(() => import("../components/features/home/StepGoldLoan"), { ssr: false });
const StepGoldLoanCalculator = dynamic(() => import("../components/features/home/StepGoldLoanCalculator"), { ssr: false });
const GoldLoanCriteria = dynamic(() => import("../components/features/goldLoan/GoldLoanCriteria"), { ssr: false });
const InstantHasslefree = dynamic(() => import("../components/features/goldLoan/InstantHasslefree"), { ssr: false });
const GoldLoanServices = dynamic(() => import("../components/features/goldLoan/GoldLoanServices"), { ssr: false });
const GoldLoanScheme = dynamic(() => import("../components/features/goldLoan/GoldLoanScheme"), { ssr: false });
const GoldLoanFaq = dynamic(() => import("../components/features/goldLoan/GoldLoanFaq"), { ssr: false });

const MobServiceBanner = dynamic(() => import("../components/features/goldLoan/MobServiceBanner"), { ssr: true });
const MobStepGoldLoan = dynamic(() => import("../components/features/home/MobStepGoldLoan"), { ssr: false });
const MobStepGoldLoanCalculator = dynamic(() => import("../components/features/home/MobStepGoldLoanCalculator"), { ssr: false });
const MobGoldLoanCriteria = dynamic(() => import("../components/features/goldLoan/MobGoldLoanCriteria"), { ssr: false });
const MobInstantHasslefree = dynamic(() => import("../components/features/goldLoan/MobInstantHasslefree"), { ssr: false });
const MobGoldLoanServices = dynamic(() => import("../components/features/goldLoan/MobGoldLoanServices"), { ssr: false });
const MobGoldLoanScheme = dynamic(() => import("../components/features/goldLoan/MobGoldLoanScheme"), { ssr: false });
const MobGoldLoanFaq = dynamic(() => import("../components/features/goldLoan/MobGoldLoanFaq"), { ssr: false });
export default function GoldLoanClient({
  steps,
  contents,
  bannerIcons,
  schemes,
  faqs,
  features,
  GoldloanBenefits,
  announcement,
  initialIsMobile,
  goldRateData,
  flattenedFeatures,
}) {
  const isMobile = initialIsMobile;
  return (
    <>
      {isMobile ? (
        <MobServiceBanner
          bannerIcons={bannerIcons}
          title={contents?.page_title}
          announcement_text={announcement?.text}
          gold_rate_text={contents?.gold_rate_text}
          banner_image={contents?.banner_image_mobile}
          alt={contents?.banner_alt}
          goldRate={goldRateData}
        />
      ) : (
        <ServiceBanner
          bannerIcons={bannerIcons}
          title={contents?.page_title}
          announcement_text={announcement?.text}
          gold_rate_text={contents?.gold_rate_text}
          banner_image={contents?.banner_image}
          alt={contents?.banner_alt}
          banner_image_mobile={contents?.banner_image_mobile}
          goldRate={goldRateData}
        />
      )}
      {/* Gold loan calculator contents*/}
      {/* <div className="hidden sm:block">
        <ServiceBanner
          bannerIcons={bannerIcons}
          title={contents?.page_title}
          announcement_text={announcement?.text}
          gold_rate_text={contents?.gold_rate_text}
          banner_image={contents?.banner_image}
          alt={contents?.banner_alt}
          banner_image_mobile={contents?.banner_image_mobile}
          goldRate={goldRateData}
        />
      </div>
      <div className="block sm:hidden">
        <MobServiceBanner
          bannerIcons={bannerIcons}
          title={contents?.page_title}
          announcement_text={announcement?.text}
          gold_rate_text={contents?.gold_rate_text}
          banner_image={contents?.banner_image_mobile}
          alt={contents?.banner_alt}
          goldRate={goldRateData}
        />
      </div> */}

      {isMobile ? (
        <MobStepGoldLoan loanSteps={steps} className="py-[30px_20px]" title={contents?.gold_loan_step_title} />
      ) : (
        <StepGoldLoan
          className="py-[30px] lg:py-[40px] 2xl:py-[80px] 3xl:py-[100px]"
          hideTitle={false}
          loanSteps={steps}
          title={contents?.gold_loan_step_title}
        />
      )}

      {/* Gold loan contents*/}
      {/* <div id="gold-loan-steps" className="hidden sm:block">
        <StepGoldLoan
          className="py-[30px] lg:py-[40px] 2xl:py-[80px] 3xl:py-[100px]"
          hideTitle={true}
          loanSteps={steps}
          title={contents?.gold_loan_step_title}
        />
      </div>
      <div className="block sm:hidden">
        <MobStepGoldLoan loanSteps={steps} className="py-[30px_20px]" title={contents?.gold_loan_step_title} />
      </div> */}

      {isMobile ? (
        <div id="easy-step">
          <MobGoldLoanCriteria
            title={contents?.gold_loan_step_title}
            description={contents?.description}
            idProofTitle={contents?.identity_proof_title}
            identityProof={contents?.identity_proof_description}
            addressProofTitle={contents?.address_proof}
            addressProof={contents?.address_proof_description}
            image={contents?.steps_image}
          />
        </div>
      ) : (
        <div id="easy-step">
          <GoldLoanCriteria
            title={contents?.gold_loan_step_title}
            eligibilityTitle={contents?.eligibility_title}
            description={contents?.description}
            documentationTitle={contents?.documentation_title}
            documentationDescription={contents?.documentation_description}
            identityProofTitle={contents?.identity_proof_title}
            identityProof={contents?.identity_proof_description}
            addressProofTitle={contents?.address_proof}
            addressProof={contents?.address_proof_description}
            image={contents?.steps_image}
          />
        </div>
      )}
      {/* Gold loan steps */}
      {/* <div id="easy-step" className="hidden sm:block">
        <GoldLoanCriteria
          title={contents?.gold_loan_step_title}
          eligibilityTitle={contents?.eligibility_title}
          description={contents?.description}
          documentationTitle={contents?.documentation_title}
          documentationDescription={contents?.documentation_description}
          identityProofTitle={contents?.identity_proof_title}
          identityProof={contents?.identity_proof_description}
          addressProofTitle={contents?.address_proof}
          addressProof={contents?.address_proof_description}
          image={contents?.steps_image}
        />
      </div> */}
      {/* <div className="block sm:hidden">
        <MobGoldLoanCriteria
          title={contents?.gold_loan_step_title}
          description={contents?.description}
          idProofTitle={contents?.identity_proof_title}
          identityProof={contents?.identity_proof_description}
          addressProofTitle={contents?.address_proof}
          addressProof={contents?.address_proof_description}
          image={contents?.steps_image}
        />
      </div> */}

      {isMobile ? (
        <MobStepGoldLoanCalculator goldRate={goldRateData} />
      ) : (
        <StepGoldLoanCalculator className="py-[30px] lg:py-[40px] 2xl:py-[80px] 3xl:py-[100px]" goldRate={goldRateData} />
      )}

      {/* Gold loan calculator contents*/}
      {/* <div className="hidden sm:block">
        <StepGoldLoanCalculator className="py-[30px] lg:py-[40px] 2xl:py-[80px] 3xl:py-[100px]" />
      </div>
      <div className="block sm:hidden">
        <MobStepGoldLoanCalculator />
      </div> */}

      {isMobile ? (
        <div id="hassle-free">
          <MobInstantHasslefree
            title={contents?.gold_loan_title}
            description={contents?.gold_loan_description}
            hassle_free_image={contents?.hassle_free_image}
            hassle_free_image_alt={contents?.hassle_free_image_alt}
            GoldloanBenefits={GoldloanBenefits}
          />
        </div>
      ) : (
        <div id="hassle-free">
          <InstantHasslefree
            title={contents?.gold_loan_title}
            description={contents?.gold_loan_description}
            hassle_free_image={contents?.hassle_free_image}
            hassle_free_image_alt={contents?.hassle_free_image_alt}
            GoldloanBenefits={GoldloanBenefits}
          />
        </div>
      )}

      {/* instant hussle free */}
      {/* <div id="hassle-free" className="hidden sm:block">
        <InstantHasslefree
          title={contents?.gold_loan_title}
          description={contents?.gold_loan_description}
          hassle_free_image={contents?.hassle_free_image}
          hassle_free_image_alt={contents?.hassle_free_image_alt}
          GoldloanBenefits={GoldloanBenefits}
        />
      </div>
      <div className="block sm:hidden">
        <MobInstantHasslefree
          title={contents?.gold_loan_title}
          description={contents?.gold_loan_description}
          hassle_free_image={contents?.hassle_free_image}
          hassle_free_image_alt={contents?.hassle_free_image_alt}
          GoldloanBenefits={GoldloanBenefits}
        />
      </div> */}

      {isMobile ? <MobGoldLoanServices features={flattenedFeatures} /> : <GoldLoanServices features={features} />}

      {/* instant hussle free */}
      {/* <div className="hidden sm:block">
        <GoldLoanServices features={features} />
      </div>
      <div className="block sm:hidden">
        <MobGoldLoanServices features={flattenedFeatures} />
      </div> */}

      {isMobile ? (
        <MobGoldLoanScheme goldLoanSchemes={schemes} scheme_title={contents?.scheme_title} />
      ) : (
        <GoldLoanScheme goldLoanSchemes={schemes} scheme_title={contents?.scheme_title} />
      )}

      {/* Scheme */}
      {/* <div id="scheme" className="hidden sm:block">
        <GoldLoanScheme goldLoanSchemes={schemes} scheme_title={contents?.scheme_title} />
      </div>
      <div className="block sm:hidden">
        <MobGoldLoanScheme goldLoanSchemes={schemes} scheme_title={contents?.scheme_title} />
      </div> */}

      {isMobile ? <MobGoldLoanFaq faq_title={contents?.faq_title} type="goldloan" /> : <GoldLoanFaq faq_title={contents?.faq_title} />}

      {/* faq contents */}
      {/* <div className="hidden sm:block">
        <GoldLoanFaq faqs={faqs} faq_title={contents?.faq_title} />
      </div>
      <div className="block sm:hidden">
        <MobGoldLoanFaq faqs={faqs} faq_title={contents?.faq_title} type="goldloan" />
      </div> */}
    </>
  );
}
