//export const dynamic = "force-dynamic";
"use client";
import dynamic from "next/dynamic";
const ConsumerDurable = dynamic(() => import("@/components/features/services/ConsumerDurable"), { ssr: true });
const ProductCovered = dynamic(() => import("@/components/features/services/ProductCovered"), { ssr: false });
const FeatureBenefit = dynamic(() => import("@/components/features/services/FeatureBenefit"), { ssr: false });
const GoldLoanFaq = dynamic(() => import("../components/features/goldLoan/GoldLoanFaq"), { ssr: false });
const MobEligibility = dynamic(() => import("@/components/features/services/MobEligibility"), { ssr: false });
const MobGoldLoanFaq = dynamic(() => import("@/components/features/goldLoan/MobGoldLoanFaq"), { ssr: false });

export default function LAPClient({ contents, benfits, products, initialIsMobile, faqs }) {
  const isMobile = initialIsMobile;

  return (
    <>
      {/* ConsumerDurable contents */}
      <ConsumerDurable
        page_title={contents?.page_title}
        image={contents?.image}
        image_alt={contents?.image_alt}
        loan_offer_description={contents?.loan_offer_description}
        loan_offer_title={contents?.loan_offer_title}
        loan_offer_button_text={contents?.loan_offer_button_text}
        loan_offer_button_link={contents?.loan_offer_button_link}
      />

      {/* ProductCovered contents */}
      <ProductCovered
        products={products}
        title={contents?.covered_products_section_title}
        image={contents?.covered_products_section_image}
        criteriaTitle={contents?.eligibility_criteria_title}
        criteriaIcon={contents?.eligibility_criteria_icon}
        criteriaDescription={contents?.eligibility_criteria_description}
        criteriaNote={contents?.eligibility_criteria_note}
        isMobile={isMobile}
      />

      {/* ConsumerDurable contents */}
      <FeatureBenefit benefits={benfits} title={contents?.feature_title} image={contents?.feature_image} />

      {/* Eligibility for mobile view contents */}
      <div className="block sm:hidden">
        {isMobile && (
          <MobEligibility
            criteriaTitle={contents?.eligibility_criteria_title}
            criteriaIcon={contents?.eligibility_criteria_icon}
            criteriaDescription={contents?.eligibility_criteria_description}
            criteriaNote={contents?.eligibility_criteria_note}
          />
        )}
      </div>
      {isMobile ? <MobGoldLoanFaq faq_title={contents?.faq_title} type="lap" /> : <GoldLoanFaq faq_title={contents?.faq_title} type="lap" />}
    </>
  );
}
