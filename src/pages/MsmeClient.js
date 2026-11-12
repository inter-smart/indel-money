//export const dynamic = "force-dynamic";

"use client";
import dynamic from "next/dynamic";

const KickStartVenture = dynamic(() => import("@/components/features/msmeloan/KickStartVenture"), { ssr: true });
const LoansList = dynamic(() => import("@/components/features/msmeloan/LoansList"), { ssr: false });
const WhyMsme = dynamic(() => import("@/components/features/msmeloan/WhyMsme"), { ssr: false });
const WhoDoServe = dynamic(() => import("@/components/features/msmeloan/WhoDoServe"), { ssr: false });
const MsmePresence = dynamic(() => import("@/components/features/msmeloan/MsmePresence"), { ssr: false });
const GrownWithMsme = dynamic(() => import("@/components/features/msmeloan/GrownWithMsme"), { ssr: false });
const MobKickStartVenture = dynamic(() => import("@/components/features/msmeloan/MobKickStartVenture"), { ssr: true });
const MobWhoDoServe = dynamic(() => import("@/components/features/msmeloan/MobWhoDoServe"), { ssr: false });

export default function MsmeLoanClient({ contents, offerings, faqs, loanTypes, industries, audience, initialIsMobile }) {
  const isMobile = initialIsMobile;
  return (
    <>
      {isMobile ? (
        // <div className="block sm:hidden">
        <MobKickStartVenture
          title={contents?.title}
          sub_title={contents?.sub_title}
          button_text={contents?.button_text}
          button_url={contents?.button_url}
          our_offering_title={contents?.our_offering_title}
          offerings={offerings}
        />
      ) : (
        // </div>
        <KickStartVenture
          title={contents?.title}
          sub_title={contents?.sub_title}
          description={contents?.description}
          button_text={contents?.button_text}
          button_url={contents?.button_url}
          our_offering_title={contents?.our_offering_title}
          our_offering_description={contents?.our_offering_description}
          offerings={offerings}
        />
      )}

      {/* KickStartVenture contents*/}
      {/* <div className="hidden sm:block">
        <KickStartVenture
          title={contents?.title}
          sub_title={contents?.sub_title}
          description={contents?.description}
          button_text={contents?.button_text}
          button_url={contents?.button_url}
          our_offering_title={contents?.our_offering_title}
          our_offering_description={contents?.our_offering_description}
          offerings={offerings}
        />
      </div>
      <div className="block sm:hidden">
        <MobKickStartVenture
          title={contents?.title}
          sub_title={contents?.sub_title}
          button_text={contents?.button_text}
          button_url={contents?.button_url}
          our_offering_title={contents?.our_offering_title}
          offerings={offerings}
        />
      </div> */}

      {/* LoanSlider contents*/}
      <LoansList loanTypes={loanTypes} />

      {/* WhyMsme contents*/}
      <WhyMsme
        title={contents?.why_msme_loan_title}
        description={contents?.why_msme_loan_description}
        image={contents?.why_msme_loan_image}
        alt={contents?.image_alt}
      />

      {isMobile ? (
        <MobWhoDoServe audience={audience} who_do_serve_title={contents?.who_do_serve_title} />
      ) : (
        <WhoDoServe audience={audience} who_do_serve_title={contents?.who_do_serve_title} />
      )}

      {/* WhoDoServe contents*/}
      {/* <div className="hidden sm:block">
        <WhoDoServe audience={audience} who_do_serve_title={contents?.who_do_serve_title} />
      </div>
      <div className="block sm:hidden">
        <MobWhoDoServe audience={audience} who_do_serve_title={contents?.who_do_serve_title} />
      </div> */}

      {/* MsmePresence contents*/}
      <MsmePresence title={contents?.about_msme_title} description={contents?.about_msme_description} audience={industries} />

      {/* Grown With Msme contents*/}
      <GrownWithMsme
        faqs={faqs}
        title={contents?.msme_loan_overview_title}
        description={contents?.msme_loan_overview_description}
      />
    </>
  );
}
