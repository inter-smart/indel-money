"use client";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MobJoinTeam({
  pageContent,
  lifeAtIndel,
  image1,
  image2,
  image3,
}) {
  const images = [image1, image2, image3];
  const lifeAtIndelSwiper = useRef(null);
  const [activeLifeSlide, setActiveLifeSlide] = useState(0);

  return (
    <section className="w-full pb-[30px]">
      <div className="w-full py-[30px] mb-[30px] bg-[#E3E3E3] rounded-[15px] bg-gradient-to-tl from-base1 to-base2">
        <div className="container">
          <div className="text-title1 text-white mb-[15px] 2xl:mb-[30px] [&>span]:text-white [&>span]:font-bold">
            {pageContent?.life_section_title
              ? parse(pageContent?.life_section_title)
              : "Join Our Team"}
          </div>
        </div>
        <div className="w-full max-w-[calc(100%-((100%-var(--container-x))/2))] pr-0 mr-0 mx-auto pl-[var(--container-padding)]">
          <Swiper
            modules={[Autoplay]}
            slidesPerView={"auto"}
            spaceBetween={5}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: false,
            }}
            breakpoints={{
              384: {
                spaceBetween: 10,
              },
            }}
            className="mobJoinTeamSlide mb-[15px] @sm:mb-[25px]"
          >
            {images?.map((item, index) => (
              <SwiperSlide key={index} className="max-w-[180px]">
                <div className="group w-full h-[150px] rounded-[15px] overflow-hidden relative z-0">
                  <Image
                    src={
                      item
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item}`
                        : "/images/mobJoinTeam-1.jpg"
                    }
                    alt={"mobJoinTeam"}
                    fill
                    className="aspect-4/3 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="container">
          <div className="w-full h-auto bg-white rounded-[24px] p-[20px] mb-[15px] @sm:mb-[25px]">
            {pageContent?.life_section_mob_description
              ? parse(pageContent?.life_section_mob_description)
              : ""}
          </div>
          <div className="flex flex-wrap justify-between -mx-[5px]">
            <div className="p-[5px]">
              <Link
                href={pageContent?.life_section_button_link_1 || "#"}
                className="btn btn-base2 min-w-[210px]"
              >
                {pageContent?.life_section_button_name_1
                  ? pageContent?.life_section_button_name_1
                  : "Apply Now"}
              </Link>
            </div>
            <div className="p-[5px]">
              <Link
                href={pageContent?.life_section_button_link_2 || "#"}
                className="btn bg-white text-base1 hover:bg-base2 hover:text-white min-w-[140px]"
              >
                {pageContent?.life_section_button_name_2
                  ? pageContent?.life_section_button_name_2
                  : "Learn More"}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="w-full p-[20px_20px_10px] bg-white rounded-[24px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)]">
          <div className="text-title1 text-base1 text-center font-bold mb-[15px] 2xl:mb-[20px]">
            {pageContent?.awards_title
              ? parse(pageContent?.awards_title)
              : "Life at Indel"}
          </div>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={5}
            onSwiper={(swiper) => {
              lifeAtIndelSwiper.current = swiper;
              setActiveLifeSlide(swiper.realIndex);
            }}
            onSlideChange={(swiper) => setActiveLifeSlide(swiper.realIndex)}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            className="achievementsSlide"
          >
            {lifeAtIndel?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="w-full block">
                  <div className="text-[14px] text-[#1e1e1e] font-normal text-center mb-[15px] @sm:mb-[20px] [&>span]:block [&>span]:text-[#EB0208] [&>span]:uppercase [&>span]:font-bold ">
                    {item?.title ? parse(item?.title) : ""}
                  </div>
                  <div className="w-full h-auto">
                    <Image
                      src={
                        item.image
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`
                          : "/images/awards-img-1.jpg"
                      }
                      alt={item?.alt ? item?.alt : item?.image_alt}
                      width={350}
                      height={350}
                      className="aspect-square object-cover size-full rounded-[24px] mx-auto"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {lifeAtIndel?.length > 1 && (
            <div className="mt-[20px] mb-[10px] flex items-center gap-[35px] pb-2.5">
              <div className="flex flex-1 items-center gap-[7px]">
                {lifeAtIndel.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={
                      activeLifeSlide === index ? "step" : undefined
                    }
                    onClick={() => lifeAtIndelSwiper.current?.slideTo(index)}
                    className={`h-[2px] flex-1 rounded-full transition-colors ${
                      activeLifeSlide === index
                        ? "bg-[#19479E]"
                        : "bg-[#E1E6EE]"
                    }`}
                  />
                ))}
              </div>
              <div className="flex shrink-0 gap-[7px]">
                <button
                  type="button"
                  aria-label="Previous slide"
                  disabled={activeLifeSlide === 0}
                  onClick={() => lifeAtIndelSwiper.current?.slidePrev()}
                  className="flex size-[35px] items-center justify-center rounded-full border-1 border-[#DCE4F1] text-[#7D96C2] transition-colors enabled:hover:bg-[#19479E] enabled:hover:text-white disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} strokeWidth={1} />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  disabled={activeLifeSlide === lifeAtIndel.length - 1}
                  onClick={() => lifeAtIndelSwiper.current?.slideNext()}
                  className="flex size-[35px] items-center justify-center rounded-full border-1 border-[#DCE4F1] text-[#7D96C2] transition-colors enabled:hover:bg-[#19479E] enabled:hover:text-white disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} strokeWidth={1} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
