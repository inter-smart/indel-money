"use client";
import { useState } from "react";
import PDFViewerAlert from "@/components/common/DisclaimerAlert";
import Image from "next/image";

export default function NCData({
  reports,
  currentReports,
  pastReports,
  title,
  type = "report",
  content,
}) {
  // State for view toggle (only for NCD type)
  const [showPastNCDs, setShowPastNCDs] = useState(false);

  // Determine which reports to display
  const displayReports =
    type === "ncd" ? (showPastNCDs ? pastReports : currentReports) : reports;

  const isDataPresent = displayReports?.length > 0;

  // State for modal
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handlePDFClick = (report) => {
    // Check if the report has showDisclaimer field and it's true
    if (report.show_disclaimer == true) {
      setSelectedReport(report);
      setIsPDFModalOpen(true);
    } else {
      // Open PDF directly in new tab if no disclaimer needed
      window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${report.file}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  const handleAgree = () => {
    // Handle agreement and open the PDF
    if (selectedReport?.file) {
      window.open(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedReport.file}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
    setIsPDFModalOpen(false);
    setSelectedReport(null);
  };

  const handleDisagree = () => {
    // Handle disagreement - just close modal

    setIsPDFModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <>
      <section className="pb-[25px] 3xl:pb-[50px]">
        <div className="text-black text-title1 font-medium mb-[20px] 2xl:mb-[30px] 3xl:mb-[40px]">
          {title}
        </div>

        {isDataPresent ? (
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2 xl:gap-4 3xl:gap-6">
            {displayReports?.map((report, index) => (
              <div
                key={index}
                className="flex flex-col py-[10px] 4xs:py-[15px] sm:py-[25px] px-[10px] 4xs:px-[12px] sm:px-[15px] xl:py-[30px] xl:px-[20px] 3xl:py-[35px] 3xl:px-[25px] rounded-2xl bg-gradient-to-r from-blue-300 to-red-300 shadow-md"
              >
                <div className="flex items-center flex-wrap justify-between">
                  {type === "report" ? (
                    <h3 className="text-[13px] xl:text-[14px] 2xl:text-[18px] 3xl:text-[20px] sm:font-bold font-medium text-black sm:block flex flex-wrap sm:w-fit 4xs:w-[calc(100%-36px)] w-[calc(100%-28px)]">
                      Annual Report{" "}
                      <span className="sm:ml-[3px] sm:text-black text-base1 sm:w-fit w-full">
                        {report?.fiscalYear?.fiscal_year}
                      </span>
                    </h3>
                  ) : (
                    <h3 className="text-[13px] xl:text-[14px] 2xl:text-[18px] 3xl:text-[20px] sm:font-bold font-medium text-black sm:block flex flex-wrap sm:w-fit 4xs:w-[calc(100%-36px)] w-[calc(100%-28px)]">
                      <span className="sm:ml-[3px] sm:text-black text-base1 sm:w-fit w-full">
                        {report?.title ? report?.title : ""}
                      </span>
                    </h3>
                  )}

                  {report.file && report.file !== "" ? (
                    <button
                      onClick={() => handlePDFClick(report)}
                      className="flex items-center space-x-2 md:max-lg:mt-[10px] group cursor-pointer bg-transparent border-none p-0"
                    >
                      <span className="text-[10px] xl:text-[12px] 3xl:text-[16px] text-black whitespace-nowrap sm:block hidden group-hover:text-red-500">
                        View PDF
                      </span>
                      <div className="w-[20px] h-[20px] xl:w-[30px] xl:h-[30px] 3xl:w-[40px] 3xl:h-[40px] bg-red-500 rounded-full flex items-center justify-center">
                        <Image
                          src="/images/pdf-icon.svg"
                          alt="PDF Icon"
                          width={24}
                          height={24}
                          className="w-[10px] h-[10px] xl:w-[15px] xl:h-[15px] 2xl:w-[20px] 2xl:h-[20px] 3xl:w-[24px] 3xl:h-[24px] transition-all group-hover:scale-80"
                        />
                      </div>
                    </button>
                  ) : (
                    <span className="text-[10px] xl:text-[12px] 3xl:text-[16px] text-black-400 italic">
                      No PDF Available
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-[10px] xl:text-[12px] 3xl:text-[16px] text-black-400 italic">
            No Data Available
          </span>
        )}

        {type === "ncd" &&
          (currentReports?.length > 0 || pastReports?.length > 0) && (
            <div className="mt-[25px] xl:mt-[30px] 3xl:mt-[40px] space-y-[15px] xl:space-y-[20px]">
              {/* Application Section Button */}
              {content?.ncd_button_text && content?.ncd_button_link && (
                <div>
                  <button
                    onClick={() =>
                      window.open(
                        content?.ncd_button_link ||
                          "https://asba.indelmoney.com/asbaform/",
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="px-[30px] xl:px-[40px] 3xl:px-[50px] py-[12px] xl:py-[15px] 3xl:py-[18px] bg-red-500 hover:bg-red-600 text-white text-[14px] xl:text-[16px] 3xl:text-[20px] font-medium rounded-lg transition-colors duration-200 shadow-md"
                  >
                    {content?.ncd_button_text || "Application Section"}
                  </button>
                </div>
              )}

              {/* Toggle Button for Past/Current NCDs */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowPastNCDs(!showPastNCDs)}
                  className="px-[30px] xl:px-[40px] 3xl:px-[50px] py-[12px] xl:py-[15px] 3xl:py-[18px] bg-blue-500 hover:bg-blue-600 text-white text-[14px] xl:text-[16px] 3xl:text-[20px] font-medium rounded-lg transition-colors duration-200 shadow-md"
                >
                  {showPastNCDs ? "Current NCD Issues" : "Past NCD Issues"}
                </button>
              </div>
            </div>
          )}
      </section>

      {/* PDF Modal - Only shows when disclaimer is required */}
      {selectedReport && isPDFModalOpen && (
        <PDFViewerAlert
          isOpen={isPDFModalOpen}
          onOpenChange={setIsPDFModalOpen}
          disclaimer={selectedReport.disclaimer || "No disclaimer available."}
          onAgree={handleAgree}
          onDisagree={handleDisagree}
        />
      )}
    </>
  );
}
