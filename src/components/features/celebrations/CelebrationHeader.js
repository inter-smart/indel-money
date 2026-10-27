import PageBreadcrumb from "@/components/common/PageBreadcrumb";

// Banner shared by the three celebrations levels.
export default function CelebrationHeader({ title, description }) {
  return (
    <header
      className="
        w-full flex flex-wrap items-center mb-[40px] 2xl:mb-[50px] 3xl:mb-[65px]
        py-[10px] 2xl:py-[15px] px-[30px] 2xl:px-[40px] 3xl:px-[60px]
        rounded-l-[20px] border-l-2 border-[#17479E]
        bg-gradient-to-r from-[rgba(238,56,36,0.30)] to-[rgba(23,71,158,0.00)]
      "
    >
      {/* with a description beside it, the title column is the left half and the title stays on one line */}
      <div className={description ? "w-full md:w-1/2 md:shrink-0" : "w-full"}>
        <h1 className={`text-title1 mb-[10px] 2xl:mb-[15px] 3xl:mb-[20px] ${description ? "md:whitespace-nowrap" : ""}`}>
          <span className="text-base2 font-bold">{title}</span>
        </h1>
        <PageBreadcrumb />
      </div>
      {description ? (
        <div className="w-full md:w-1/2 pt-[20px] md:pt-0 md:pl-[20px] 2xl:pl-[30px]">
          <p className="text-sm1">{description}</p>
        </div>
      ) : null}
    </header>
  );
}
