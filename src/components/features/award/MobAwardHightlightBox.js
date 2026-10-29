"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import "./AwardHighlightBox.css";
import { renderHtml } from "@/lib/utils/htmlParser";

const slides = [
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 1",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "1 Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. ",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 2",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "2 Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. ",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 3",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "3 Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. ",
    href: "/",
  },
];

export default function MobAwardHighlightBox({ variant = "default", title, items = slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState({});

  const isExpanded = expanded[activeIndex];
  const getTextPreview = (text) => {
    const preview = text.slice(0, 180) + "...";
    return preview;
  };

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="relative z-0 w-full h-full block rounded-[25px] sm:bg-[#B7D0FF] bg-[#fff] shadow-[0_0_15px_0_rgba(0,0,0,0.10)] p-[20px] pb-[]">
      <h2 className="text-[20px] text-base1 font-bold mb-[10px] text-center">{title ? title : "Our Achievements"}</h2>
      <Swiper
        modules={[Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        className="awardSlide !pb-[60px]"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {items?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="w-full flex flex-wrap flex-col">
                <div className="w-full sm:w-[calc(100%-150px)] lg:w-[calc(100%-180px)] xl:w-[calc(100%-220px)] 2xl:w-[calc(100%-276px)] 3xl:w-[calc(100%-376px)] 2xl:pr-[90px] xl:pr-[40px] md:pr-[20px] sm:pr-[20px]">
                  {variant === "employeeTestimonials" && (
                    <div className="text-title1 font-bold leading-none mb-[5px] lg:mb-[10px] text-[#f30000]">Awards</div>
                  )}
                  <h5 className="text-[14px] text-black font-normal mb-[10px] text-center [&>span]:block [&>span]:text-center [&>span]:text-[#EB0208] [&>span]:uppercase [&>span]:font-bold">
                    {item.title ? renderHtml(item.title) : ""}
                  </h5>
                </div>
                <div className="w-full m-auto">
                  <div className="flex items-center justify-center w-full h-[240px]">
                    <Image
                      src={item.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/images/awards-img-1.jpg"}
                      alt={item.image_alt ? item.image_alt : item?.alt}
                      width={900}
                      height={700}
                      sizes="100vw"
                      className="w-auto h-auto max-w-full max-h-full rounded-[24px]"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="w-full text-[12px] text-black rounded-[10px] bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.10)] overflow-hidden p-[25px]">
        <div className="w-full text-[12px] text-black leading-relaxed">
          {isExpanded ? items[activeIndex]?.description : getTextPreview(items[activeIndex]?.description || "")}
        </div>
        {items[activeIndex]?.description && items[activeIndex].description.length > 180 && (
          <div
            onClick={() => toggleReadMore(activeIndex)}
            className="text-[13px] leading-none font-medium text-base1 capitalize my-[10px] cursor-pointer hover:underline transition-all duration-200"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </div>
        )}
      </div>
    </div>
  );
}
