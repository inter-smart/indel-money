"use client";
import Image from "next/image";
import Link from "next/link";
import LatestUpdatesSlide from "../../common/LatestUpdatesSlide";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { formatPostDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function LatestUpdates({ sliderItems, sliderTitle, type = "blog" }) {
  const router = useRouter();
  return (
    <section className="w-full block">
      <div className="container">
        <div className="flex flex-wrap bg-[#cae5f4] rounded-[30px] overflow-hidden">
          <div className="w-full md:w-[55%] lg:w-1/2 p-4 lg:p-6 xl:p-8">
            <div className="flex justify-between items-center gap-2 mb-[10px] xl:mb-[15px] 3xl:mb-[20px]">
              <h3 className="text-title1 text-black font-medium max-w-[70%]">{sliderTitle}</h3>
              <Link
                href={`/${type}/#all`}
                className="text-[12px] lg:text-[12px] 2xl:text-[14px] 3xl:text-[16px] font-bold flex items-center shrink-0 hover:text-base2 transition-color duration-300"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor jump
                  const section = document.querySelector("#all");
                  if (type === "indel-money-cares") {
                    router.push(`/${type}`, undefined, { scroll: false });
                    return;
                  }
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                View All
                <Image src="/images/icon-right.svg" width={7} height={13} alt="right" className="w-[4px] lg:w-[6px] ml-1 lg:ml-2" />
              </Link>
            </div>
            <LatestUpdatesSlide
              className={
                "relative lg:before:[''] before:hidden lg:before:block before:absolute before:bottom-0 before:right-0 before:w-[170px] before:lg:w-[198px] before:xl:w-[241px] before:2xl:w-[337px] before:3xl:w-[423px] before:h-[1px] before:bg-[#a8a8a8]"
              }
              slides={sliderItems}
              type={type}
            />
          </div>
          <div className="w-full md:w-[45%] lg:w-1/2">
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination, Autoplay]}
              className="blogSlide h-full"
              style={{
                "--swiper-pagination-bottom": "10px",
                "--swiper-pagination-bullet-size": "5px",
                "--swiper-pagination-bullet-inactive-color": "#fff",
                "--swiper-pagination-color": "#f30000",
                "--swiper-pagination-bullet-inactive-opacity": "1",
              }}
            >
              {sliderItems?.map((item, index) => (
                <SwiperSlide key={index}>
                  <div
                    // href={`/${type}/${item?.slug}`}
                    key={index}
                    className="group w-full h-[368px] sm:h-[420px] md:h-[490px] lg:h-[530px] xl:h-[586px] 2xl:h-[701px] 3xl:h-[854px] overflow-hidden block relative z-0"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image}`}
                      alt={item?.image_alt}
                      fill
                      sizes="520px"
                      priority={index === 0} // Prioritize first image
                      className="w-full h-full transition-transform duration-300 object-cover group-hover:scale-105"
                    />
                    <div className="w-full h-auto absolute inset-0 top-auto p-[15px_15px_30px] lg:p-[20px_20px_30px] xl:p-[30px_30px_40px] 3xl:p-[50px_50px_60px] bg-gradient-to-t from-black/60 to-transparent">
                      {(item?.event_date || item?.posted_on) && (
                        <div className="text-sm 3xl:text-lg text-white line-clamp-1 mb-2 3xl:mb-4">
                          {formatPostDate(item?.posted_on || item?.event_date)}
                        </div>
                      )}
                      <div className="text-[14px] sm:text-[18px] lg:text-[22px] xl:text-[26px] 2xl:text-[32px] 3xl:text-[36px] leading-[1.2] text-white font-medium line-clamp-2 mb-4 3xl:mb-6">
                        {item?.title}
                      </div>
                      <Link
                        href={ `/${type}/${item?.slug}`  }
                        className="text-[12px] lg:text-[12px] 2xl:text-[14px] 3xl:text-[16px] font-bold text-white hover:text-base2 transition-color duration-300 uppercase flex items-center"
                      >
                        Read More
                        <Image
                          src="/images/icon-news1.svg"
                          width={20}
                          height={20}
                          alt="news1"
                          className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* </motion.div> */}
        </div>
      </div>
    </section>
  );
}
