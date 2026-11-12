import PageBreadcrumb from "@/components/common/PageBreadcrumb";

export default function ServiceBanner({ page_super_title, page_title, image, alt }) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="sm:relative absolute w-full h-full md:h-[280px] lg:h-[340px] xl:h-[365px] 2xl:h-[460px] 3xl:h-[560px]">
        <picture className="block w-full h-full">
          <source media="(min-width: 640px)" srcSet={image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}` : "/images/serviceBanner.jpg"} />
          <img
            src={image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}` : "/images/serviceBannerMb.png"}
            width={640}
            height={500}
            alt={alt ? alt : "value-innerBanner"}
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </picture>
      </div>
      <div className="container sm:absolute relative h-auto inset-0 flex flex-wrap sm:items-center items-start sm:justify-start justify-start pt-[40px] 3xs:pt-[60px] sm:p-4 md:p-6 lg:p-8 xl:p-10 text-white z-1 mx-auto">
        <div className=" max-w-[655px] md:max-w-[755px] lg:max-w-[840px]">
          <div className="text-base1 text-[16px] lg:text-[16px] 2xl:text-[18px] 3xl:text-[20px] font-normal leading-normal uppercase mb-[8px] lg:mb-[10px] 2xl:mb-[15px]">
            {page_super_title ? page_super_title : "Our Services"}
          </div>
          <h1
            className="text-title2 text-black mb-[15px] 2xl:mb-[20px] [&>span]:text-base2 [&>span]:font-bold"
            dangerouslySetInnerHTML={{
              __html: page_title ? page_title : "Explore a World of <br></br> <span>Financial&nbsp;</span> Services",
            }}
          />

          {/* <h1 className="text-title2 text-black mb-[15px] 2xl:mb-[20px] [&>span]:text-base2 [&>span]:font-bold">
            Explore a World of <br></br>
            <span className="text-base2 font-bold">Financial&nbsp;</span>
            Services
          </h1> */}
          <div className="w-full sm:block hidden">
            <PageBreadcrumb />
          </div>
        </div>
        {/* <div className="relative sm:hidden block w-full h-auto">
          <div className="w-full max-w-[320px] 4xs:max-w-[400px] h-auto aspect-[400/280] absolute z-0 -right-[var(--container-padding)] bottom-[120px]">
            <Image src="/images/redBgElement.png" alt="value-image" fill sizes="400px" className="object-cover" />
          </div>
         
        </div> */}
      </div>
    </section>
  );
}
