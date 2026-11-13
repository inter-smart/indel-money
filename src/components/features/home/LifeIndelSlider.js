"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


import Image from "next/image";
import Link from "next/link";


const slides = [
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 1",
    title: "Indel Money Limited is bestowed as",
    title2: "1 GREAT PLACE TO WORK",
    description:
      "Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute...",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 2",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description: "We are committed to financial excellence and providing reliable services for our customers.",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 3",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description: "With a legacy of trust and innovation, we empower individuals and businesses alike.",
    href: "/",
  },
];

export default function LifeIndelSlider({ lifeAtIndel }) {
  return (
    <Swiper
      key={"lifeSlide"}
      modules={[Pagination, Autoplay]}
      loop={false}
      slidesPerView={1}
      spaceBetween={20}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      className="lifeSlide"
    >
      {lifeAtIndel?.map((item, index) => (
        <SwiperSlide key={index}>
          <Link href={item.href ? item.href : "/"} className="w-full h-full block rounded-[24px] bg-[#E6EDF7] overflow-hidden p-[20px] pl-[25px]">
            <div className="w-full flex flex-wrap sm:flex-row flex-col-reverse">
              <div className="3xl:w-[calc(100%-200px)] xl:w-[calc(100%-150px)] lg:w-[calc(100%-100px)] sm:w-[calc(100%-100px)] w-full 3xl:pr-[30px] sm:pr-[20px] sm:pt-0 pt-[20px]">
                <h5
                  className="text-[14px] sm:text-[16px] xl:text-[18px] 3xl:text-[24px] text-[#1e1e1e] font-normal mb-[5px] xl:mb-[10px] 3xl:mb-[15px] [&>span]:text-base2 [&>span]:uppercase [&>span]:font-bold"
                  dangerouslySetInnerHTML={{ __html: item.title ? item.title : "" }}
                />
                <div className="w-full mb-[10px] xl:mb-[15px] 3xl:mb-[20px] text-sm1 line-clamp-4">{item.description}</div>
              </div>
              <div className="3xl:w-[200px] xl:w-[150px] lg:w-[100px] w-[100px]">
                <div className="group w-full h-auto xl:h-full rounded-[24px] overflow-hidden">
                  <Image
                    src={item.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/images/awards-img-1.jpg"}
                    alt={item?.alt ? item?.alt : item?.image_alt}
                    width={200}
                    height={250}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.05]"
                  />
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
