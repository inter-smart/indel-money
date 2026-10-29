"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation } from "swiper/modules";
import "./celebrationSlider.css";
import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "./celebrationConstants";

// Coverflow slider of the "slider" categories on /celebrations; each slide links to its category.
export default function CelebrationSlider({ sliderItems = [] }) {
  // loop needs more slides than fit on screen, otherwise swiper duplicates / jumps
  const canLoop = sliderItems.length > 5;

  return (
    <div className="w-full flex justify-center items-center py-10">
      <style>{`
            .CelebrationSlider .swiper-slide:not(.swiper-slide-active) .card-box-content{
                    opacity: 0;
            }`}</style>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1.5}
        spaceBetween={20}
        loop={canLoop}
        initialSlide={Math.min(2, Math.max(0, sliderItems.length - 1))}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={true}
        coverflowEffect={{
          // rotate: -2,
          // stretch: 2,
          // depth: 3,
          // modifier: 2,
          rotate: -5,
          stretch: 0,
          depth: 80,
          modifier: 1.2,
          slideShadows: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1.8,
            spaceBetween: 30,
            coverflowEffect: {
              rotate: -5,
              stretch: 0,
              depth: 80,
              modifier: 1.2,
              slideShadows: false,
            },
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 20,
            coverflowEffect: {
              rotate: -5,
              stretch: 0,
              depth: 80,
              modifier: 1.2,
              slideShadows: false,
            },
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
            coverflowEffect: {
              rotate: -5,
              stretch: 0,
              depth: 80,
              modifier: 1,
              slideShadows: false,
            },
          },
          1536: {
            slidesPerView: 5,
            spaceBetween: 40,
            coverflowEffect: {
              rotate: -5,
              stretch: 0,
              depth: 80,
              modifier: 1.2,
              slideShadows: false,
            },
          },
          1920: {
            slidesPerView: 5,
            spaceBetween: 40,
            coverflowEffect: {
              rotate: -5,
              stretch: 0,
              depth: 20,
              modifier: 1.8,
              slideShadows: false,
            },
          },
        }}
        modules={[EffectCoverflow, Navigation]}
        className="w-full max-w-full CelebrationSlider"
      >
        {sliderItems.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="w-full h-full not-[:where(.swiper-slide-visible)]:opacity-0 not-[:has(.swiper-slide-active)]:[.SwiprCntn]:opacity-0"
          >
            <Link
              href={`/celebrations/${slide.slug}`}
              aria-label={slide.title}
              className="relative block w-full h-[370px] lg:h-[350px] xl:h-[400px] 2xl:h-[400px] 3xl:h-[518px] rounded-[38px] overflow-hidden shadow-lg"
            >
              <Image
                src={mediaUrl(slide.cover)}
                alt={slide.alt || slide.title}
                fill
                sizes="518px"
                className="object-cover"
              />
              <div className="card-box-content absolute z-1 bottom-0 left-0 right-0 p-[30px_15px] lg:p-[30px_15px] 2xl:p-[65px_25px] pointer-events-none transition-all duration-300  bg-gradient-to-b from-[rgba(143,0,0,0)] to-base1">
                <h3 className="text-[18px] lg:text-[18px] xl:text-[20px] 2xl:text-[18px] 3xl:text-[25px] uppercase font-black text-center text-white">
                  {slide.title}
                </h3>
                <span className="w-full max-w-[120px] h-[1px] bg-white my-[8px] lg:my-[10px] 2xl:my-[14px] mx-auto block"></span>
                {slide.description && (
                  <p className="text-[14px] sm:text-[12px] xl:text-[13px] 2xl:text-[14px] 3xl:text-[18px] font-normal leading-[1.3] text-center text-white line-clamp-3">
                    {slide.description}
                  </p>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
