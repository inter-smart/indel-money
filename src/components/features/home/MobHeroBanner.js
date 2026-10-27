"use client";
import HeroBannerEnquiry from "./HeroBannerEnquiry";
import { useCallback, useRef } from "react";
import Image from "next/image";
import MobHomeMarquee from "../../features/home/MobHomeMarquee";
import { renderHtml } from "@/lib/utils/htmlParser";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Link from "next/link";

import "./Home.css";

// export const heroBanner = [
//   {
//     media_type: "image",
//     title: "Experience <span>Luxury</span> on Wheels",
//     button_link: "/luxury-cars",
//     image_mobile: "/images/aboutImg.webp",
//   },
//   {
//     media_type: "video",
//     title: "Drive the <span>Future</span> Today",
//     button_link: "/electric-cars",
//     video_mobile: "/images/bannervid.mp4",
//   },
//   {
//     media_type: "image",
//     title: "Power Meets <span>Performance</span>",
//     button_link: "/sports-cars",
//     image_mobile: "/images/aboutImg.webp",
//   },
// ];

export default function MobHeroBanner({ heroBanner, initialData, announcement, goldRate }) {
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
        videoElement.play()?.catch(() => {});
      } else if (videoElement) {
        // Non-first videos don't autoplay (to keep ~10 MB off the initial load), so
        // metadata may not be there yet; start playback and let onLoadedMetadata set the delay.
        videoElement.play()?.catch(() => {});
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
    <section className="w-full block relative z-0 overflow-hidden">
      <Swiper
        effect={"fade"}
        modules={[EffectFade, Pagination, Autoplay]}
        navigation={false}
        pagination={false}
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
        className="heroSlide h-[calc(95vh-(var(--header-y)))] sm:h-[calc(100vh-(var(--header-y)))]"
      >
        {heroBanner?.map((item, index) => (
          <SwiperSlide
            key={index}
            // className="relative z-0 flex! items-end before:absolute before:inset-0 before:-z-1 before:block before:bg-gradient-to-t before:from-black before:to-transparent before:w-full before:h-full py-[calc(var(--marquee-y)+50px)]"
            className="relative z-0 flex! items-end"
          >
            {item?.media_type === "video" ? (
              <Link
                href={item?.video_link || "https://www.youtube.com/watch?v=rdge4-9jtiI"}
                aria-label={item?.image_alt_text || `Slide ${index + 1}`}
              >
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  autoPlay={index === 0}
                  muted
                  playsInline
                  poster={item?.thumbnail ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.thumbnail}` : undefined}
                  preload={index === 0 ? "auto" : "metadata"}
                  onLoadedMetadata={() => handleVideoLoadedMetadata(index, swiperRef.current)}
                  className="absolute inset-0 w-full h-full -z-2 object-cover"
                  aria-label={item.image_alt_text}
                >
                  <source src={item?.video_mobile ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.video_mobile}` : ""} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </Link>
            ) : (
              <Link href={item?.button_link || "#"} aria-label={item?.image_alt_text || `Slide ${index + 1}`}>
                <Image
                  src={item?.image_mobile ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image_mobile}` : ""}
                  alt={item.image_alt_text}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="-z-2 object-cover"
                />
              </Link>
            )}
            <div className="container">
              <div className="max-w-full">
                <h2 className="text-[28px] leading-[1.2] capitalize font-medium text-white mb-[10px] 4xs:mb-[15px] [&>span]:text-base2 [&>span]:font-bold">
                  {item?.title ? renderHtml(item.title) : ""}
                </h2>
                {/* <Link href={item?.button_link} className="btn btn-base2 max-w-[130px]">
                  {item?.button_text}
                </Link> */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <MobHomeMarquee
        announcementText={announcement}
        goldRateLabel={initialData?.pageContent?.gold_rate_label}
        goldRateIcon={initialData?.pageContent?.gold_rate_icon}
        goldRate={goldRate}
      />
      <HeroBannerEnquiry />
    </section>
  );
}
