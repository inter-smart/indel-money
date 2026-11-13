"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

import { formatPostDate } from "../../../lib/utils";

const slides = [
  {
    href: "/",
    image: "/images/news-1.jpg",
    alt: "news-1",
    date: "24 SEPTEMBER 2024:",
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting dummy text of the printing and typesetting.",
    description:
      "Aliquam malesuada risus at nulla egestas, sit amet feugiat tortor molestie. Fusce dapibus tempus eros ac vehicula. Fusce faucibus, justo et cursus varius, metus.",
  },
  {
    href: "/",
    image: "/images/news-2.jpg",
    alt: "news-1",
    date: "24 SEPTEMBER 2024:",
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting dummy text of the printing and typesetting.",
    description:
      "Aliquam malesuada risus at nulla egestas, sit amet feugiat tortor molestie. Fusce dapibus tempus eros ac vehicula. Fusce faucibus, justo et cursus varius, metus.",
  },
  {
    href: "/",
    image: "/images/news-3.jpg",
    alt: "news-1",
    date: "24 SEPTEMBER 2024:",
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting dummy text of the printing and typesetting.",
    description:
      "Aliquam malesuada risus at nulla egestas, sit amet feugiat tortor molestie. Fusce dapibus tempus eros ac vehicula. Fusce faucibus, justo et cursus varius, metus.",
  },
  {
    href: "/",
    image: "/images/news-4.jpg",
    alt: "news-1",
    date: "24 SEPTEMBER 2024:",
    title: "Lorem Ipsum is simply dummy text of the printing and typesetting dummy text of the printing and typesetting.",
    description:
      "Aliquam malesuada risus at nulla egestas, sit amet feugiat tortor molestie. Fusce dapibus tempus eros ac vehicula. Fusce faucibus, justo et cursus varius, metus.",
  },
];

export default function MobLatestUpdates({ sliderItems, sliderTitle, type = "blog" }) {
  return (
    <section className="w-full py-[30px] bg-[#cae5f4] rounded-[20px_20px_0_0] overflow-hidden">
      <div className="container">
        <div className="mb-[25px]">
          <div className="flex justify-between items-center gap-2 mb-[15px] @sm:mb-[20px]">
            <h3 className="text-title1 font-medium text-black">{sliderTitle}</h3>
            <Link href={type} className="text-[12px] leading-none font-bold flex items-center hover:text-base2 transition-color duration-300">
              VIEW ALL
              <Image src="/images/icon-right.svg" width={5} height={9} alt="right" className="ml-[5px]" />
            </Link>
          </div>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1}
            spaceBetween={5}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={false}
          >
            {sliderItems?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="group w-full h-[220px] overflow-hidden rounded-[25px] block relative z-0">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image}`}
                    alt={item?.alt || "blog alt"}
                    fill
                    sizes="380px"
                    className="transition-transform duration-300 object-cover group-hover:scale-105"
                  />
                  <div className="w-full h-auto absolute inset-0 top-auto p-[20px] bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-[12px] text-white line-clamp-1 mb-[2px]">{item.event_date ? formatPostDate(item.event_date) : ""}</div>
                    <div className="text-[16px] leading-[1.2] text-white font-bold line-clamp-2 mb-[10px]">{item.title}</div>
                    <Link
                      href={`/${type}/${item?.slug}`}
                      className="text-[12px] leading-none font-bold text-white uppercase hover:text-base2 transition-color duration-300 flex items-center"
                    >
                      Read More
                      <Image
                        src="/images/icon-news1.svg"
                        width={10}
                        height={10}
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
        <div>
          <div className="flex justify-between items-center gap-2 mb-[15px] @sm:mb-[20px]">
            <h3 className="text-title1 font-medium text-black max-w-[75%]">CSR Activity</h3>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={2}
            spaceBetween={6}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: false,
            }}
            breakpoints={{
              384: {
                slidesPerView: 2,
                spaceBetween: 8,
              },
            }}
            className="csrActivitySlide"
            style={{
              "--swiper-pagination-bullet-size": "6px",
              "--swiper-pagination-bullet-inactive-color": "#fff",
              "--swiper-pagination-color": "#17479e",
              "--swiper-pagination-bullet-inactive-opacity": "1",
            }}
          >
            {sliderItems?.map((item, index) => (
              <SwiperSlide key={index}>
                <Link href={`/${type}/${item?.slug}`} className="group w-full h-auto block bg-white p-[10px] rounded-[16px]">
                  <div className="w-full h-[100px] rounded-[16px] overflow-hidden relative z-0 mb-[12px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image}`}
                      alt={item?.alt || "blog alt"}
                      fill
                      sizes="160px"
                      className="transition-transform duration-300 object-cover group-hover:scale-105"
                    />
                  </div>
                  <div className="w-full h-auto">
                    <div className="text-[10px] leading-none font-normal text-[#505050] line-clamp-1 mb-[2px]">
                      {" "}
                      {formatPostDate(item?.event_date)}
                    </div>
                    <div className="text-[12px] leading-[1.2] text-black font-medium line-clamp-2 mb-[5px]">{item.title}</div>
                    <div className="text-[10px] leading-[1.4] text-[#2d2d2d] font-normal line-clamp-3 mb-[5px]">{item.description}</div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
