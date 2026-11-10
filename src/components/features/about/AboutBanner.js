"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import { renderHtml } from "@/lib/utils/htmlParser";
import { useMediaQuery } from "@react-hook/media-query";

import "./About.css";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";

const slides = [
  {
    image: "/images/aboutBanner.jpg",
    alt: "Indel Money Banner 1",
    title: "Simplifying Finance, Empowering You",
  },
  {
    image: "/images/hero_banner.jpeg",
    alt: "Indel Money Banner 2",
    title: "Simplifying Finance, Empowering You",
  },
  {
    image: "/images/aboutBanner.jpg",
    alt: "Indel Money Banner 3",
    title: "Simplifying Finance, Empowering You",
  },
];

export default function AboutBanner({ banners }) {
  const isMobile = useMediaQuery("only screen and (max-width: 768px)");

  return (
    <section className="w-full h-auto overflow-hidden">
      <Swiper
        effect={"fade"}
        modules={[EffectFade, Pagination, Autoplay]}
        navigation={false}
        pagination={{
          clickable: true,
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="w-full aboutSlide h-[560px] sm:h-[320px] lg:h-[468px] 2xl:h-[560px]"
      >
        {banners?.map((item, index) => (
          <>
            <SwiperSlide key={index} className="relative z-0">
              <div className="absolute -z-1 inset-0 w-full sm:w-[60%] h-[60%] sm:h-full bg-gradient-to-t sm:bg-gradient-to-r from-black sm:from-white/80 to-transparent pointer-events-none mt-auto"></div>
              <picture className="absolute -z-2 inset-0">
                <source
                  media="(max-width: 640px)"
                  srcSet={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image_mobile}`}
                />
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                  alt={"Slide Image"}
                  fill
                  priority
                  className="-z-2 object-cover"
                />
              </picture>
              <div className="absolute bottom-[80px] sm:bottom-1/2 left-1/2 transform -translate-x-1/2 sm:translate-y-1/2 container">
                <div className="max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] 2xl:max-w-[550px] 3xl:max-w-[750px]">
                  <div className="text-[12px] sm:text-[14px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] text-white sm:text-base1 font-normal leading-none uppercase mb-[10px] lg:mb-[15px] 2xl:mb-[20px]">
                    {item?.title
                      ? renderHtml(item?.title)
                      : "Simplifying Finance, Empowering You"}
                  </div>
                  <h1 className="text-title2 capitalize text-white sm:text-black lg:-ml-[2px] 2xl:-ml-[4px] mb-[10px] lg:mb-[15px] 2xl:mb-[20px] [&>span]:text-base2 [&>span]:font-bold">
                    {item?.super_title
                      ? renderHtml(item?.super_title)
                      : "Indel Money"}
                  </h1>
                  <div className="hidden sm:block">
                    <PageBreadcrumb />
                  </div>
                  <div className="block sm:hidden">
                    <PageBreadcrumb variant="white" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </>
        ))}
      </Swiper>
    </section>
  );
}
