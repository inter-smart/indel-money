"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
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
      "Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 2",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 3",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 3",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    href: "/",
  },
  {
    image: "/images/awards-img-1.jpg",
    alt: "Life at Indel Image 3",
    title: "Indel Money Limited is bestowed as",
    title2: "GREAT PLACE TO WORK",
    description:
      "Every year, more than 10,000 organizations from over 60 countries partner with Great Place to Work® Institute for assessment, benchmarking, and planning actions to strengthen their workplace culture. There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    href: "/",
  },
];

export default function AwardHighlightBox({
  variant = "default",
  items = slides,
}) {
  return (
    <div className="relative z-0 w-full h-full block rounded-[35px] sm:bg-[#B7D0FF] bg-[#fff] sm:shadow-none  shadow-[0_0_15px_0_rgba(0,0,0,0.10)] p-[15px_20px] sm:p-[30px_30px] lg:p-[30px] 2xl:p-[40px_30px_40px_40px] 3xl:p-[80px_50px_50px_70px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className={"awardSlide"}
      >
        {items?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="w-full flex flex-col-reverse sm:flex-row sm:items-start">
                {/* Text – 50% */}
                <div className="w-full sm:w-1/2 sm:pr-[20px] md:pr-[20px] xl:pr-[40px] 2xl:pr-[60px]">
                  {variant === "employeeTestimonials" && (
                    <div className="text-title1 font-bold leading-none mb-[5px] lg:mb-[10px] text-[#f30000]">
                      Awards
                    </div>
                  )}
                  <h5 className="sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] 2xl:text-[32px] 3xl:text-[40px] text-black font-normal mb-[10px] lg:mb-[15px] 2xl:mb-[20px] 3xl:mb-[30px] [&>span]:text-[#EB0208] [&>span]:uppercase [&>span]:font-bold">
                    {item.title ? renderHtml(item.title) : ""}
                  </h5>

                  <div className="w-full mb-[20px] lg:mb-[40px] 2xl:mb-[60px] text-[12px] lg:text-[13px] xl:text-[14px] 2xl:text-[16px] 3xl:text-[18px] line-clamp-8">
                    {item.description}
                  </div>
                </div>

                {/* Image – 50% */}
                <div className="w-full sm:w-1/2 shrink-0 mb-[15px] sm:mb-0">
                  <div className="group relative w-full h-[220px] sm:h-[240px] lg:h-[280px] xl:h-[300px] 2xl:h-[380px] rounded-[24px] overflow-hidden">
                    <Image
                      src={
                        item.image
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`
                          : "/images/blog/1.jpg"
                      }
                      alt={item.image_alt ? item.image_alt : item?.alt}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-600 group-hover:scale-[1.05]"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="absolute z-1 left-0 bottom-0 w-[20%] h-full pointer-events-none">
        <Image
          src={"/images/award-highlightbox-bg.png"}
          alt={"bg"}
          width={360}
          height={460}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.05]"
        />
      </div>
    </div>
  );
}
