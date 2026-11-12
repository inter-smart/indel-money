import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { serverMediaPath } from "@/constants/constants";

export default function IndelValueBanner({ image, alt, title }) {



  return (
   <section className="relative w-full overflow-hidden">
        <div className="sm:relative absolute w-full h-full md:h-[280px] lg:h-[340px] xl:h-[365px] 2xl:h-[460px] 3xl:h-[560px]">
          <picture className="block w-full h-full">
            <source media="(min-width: 640px)" srcSet={image ? `${serverMediaPath}${image}` : "/images/valueBannerDesk.jpg"} />
            <img
              src={image ? `${serverMediaPath}${image}` : "/images/valueBannerMb.jpg"}
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

            <h1
              className="text-title1 text-white mb-[15px] 2xl:mb-[20px] [&>span]:text-base2  [&>span]:font-bold"
              dangerouslySetInnerHTML={{ __html: title ? title : "" }}
            />
            <PageBreadcrumb variant="white" />

            {/* <h1 className="text-title2 text-black mb-[15px] 2xl:mb-[20px] [&>span]:text-base2 [&>span]:font-bold">
                Explore a World of <br></br>
                <span className="text-base2 font-bold">Financial&nbsp;</span>
                Services
              </h1> */}
          </div>
          
        </div>
      </section>
  );
}
