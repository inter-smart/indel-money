"use client";
import { useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Image from "next/image";
import Link from "next/link";

import "./Home.css";

// export const heroBanner = [
//   {
//     media_type: "image",
//     title: "Welcome to Our <span>Site</span>",
//     button_link: "/explore",
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//     image: "/images/aboutBanner.webp",
//   },
//   {
//     media_type: "video",
//     title: "Discover <span>Amazing</span> Features",
//     button_link: "/features",
//     video: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     media_type: "video",
//     title: "Join Our <span>Community</span>",
//     button_link: "/community",
//     image: "/images/aboutBanner.webp",
//   },
// ];

export default function HomeSlider({ heroBanner }) {
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const IMAGE_DELAY = 4000; // Default delay for images in ms

  const handleSlideChange = useCallback((swiper) => {
    const currentIndex = swiper.realIndex;
    const currentSlide = heroBanner[currentIndex];

    if (currentSlide?.media_type === "video") {
      const videoElement = videoRefs.current[currentIndex];
      if (videoElement && videoElement.duration) {
        // Set autoplay delay to video duration (convert to milliseconds)
        const videoDuration = Math.floor(videoElement.duration * 1000);
        swiper.params.autoplay.delay = videoDuration;

        // Restart video from beginning
        videoElement.currentTime = 0;
        videoElement.play();
      }
    } else {
      // Set autoplay delay to default image delay
      swiper.params.autoplay.delay = IMAGE_DELAY;
    }

    // Update autoplay with new delay
    if (swiper.autoplay.running) {
      swiper.autoplay.stop();
      swiper.autoplay.start();
    }
  }, []);

  const handleVideoLoadedMetadata = useCallback((index, swiper) => {
    // When video metadata is loaded, update delay if it's the current slide
    if (swiper && swiper.realIndex === index) {
      const videoElement = videoRefs.current[index];
      if (videoElement && videoElement.duration) {
        const videoDuration = Math.floor(videoElement.duration * 1000);
        swiper.params.autoplay.delay = videoDuration;

        if (swiper.autoplay.running) {
          swiper.autoplay.stop();
          swiper.autoplay.start();
        }
      }
    }
  }, []);

  return (
    <Swiper
      effect={"fade"}
      modules={[EffectFade, Pagination, Autoplay]}
      navigation={false}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: IMAGE_DELAY,
        disableOnInteraction: false,
      }}
      loop={heroBanner?.length > 1 ? true : true}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        // Set initial delay based on first slide
        handleSlideChange(swiper);
      }}
      onSlideChange={handleSlideChange}
      className="heroSlide h-[calc(100vh-(var(--header-y)+var(--marquee-y)))]"
    >
      {heroBanner?.map((item, index) => (
        <SwiperSlide
          key={index}
          // className="relative z-0 before:absolute before:inset-0 before:block before:bg-gradient-to-r before:from-[rgba(0,0,0,0.6)] before:to-transparent before:w-full before:h-full"
          className="relative z-0"
        >
          {item?.media_type === "video" ? (
            <Link href={item?.video_link || "https://www.youtube.com/watch?v=rdge4-9jtiI"} aria-label={item?.image_alt_text || `Slide ${index + 1}`}>
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                poster={item?.thumbnail ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.thumbnail}` : undefined}
                className="w-full h-full object-cover"
                preload="metadata"
                onLoadedMetadata={() => handleVideoLoadedMetadata(index, swiperRef.current)}
              >
                <source src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.video}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Link>
          ) : (
            <Link href={item?.button_link || "#"} aria-label={item?.image_alt_text || `Slide ${index + 1}`}>
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image}`}
                width={1920}
                height={1080}
                alt={item?.image_alt_text}
                priority={index === 0}
                fetchPriority={index === 0 ? "high" : "auto"}
                className="w-full h-full object-cover"
              />
            </Link>
          )}
          <div className="container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-full max-w-[320px] lg:max-w-[376px] xl:max-w-[400px] 2xl:max-w-[450px] 3xl:max-w-[576px]">
              <h2
                className="text-[28px] sm:text-[30px] lg:text-[28px] xl:text-[32px] 2xl:text-[45px] 3xl:text-[50px] leading-[1.2] capitalize font-medium text-white mb-6 [&>span]:text-base2 [&>span]:font-bold"
                dangerouslySetInnerHTML={{ __html: item.title ? item.title : "" }}
              />

              {/* <Link
                href={item?.button_link}
                className="btn btn-base2 max-w-[130px] lg:max-w-[100px] xl:max-w-[120px] 2xl:max-w-[140px] 3xl:max-w-[160px]"
              >
                {item?.button_text}
              </Link> */}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
