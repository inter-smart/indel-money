"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../ui/custom-alert-dialog";

import { useState, useEffect } from "react";

function WelcomeBox({ item, index }) {
  const isActive = index === 0;
  return (
    <div
      className={`
                ${
                  isActive ? "bg-[#dceafb]" : "bg-[#e7eff9]"
                } w-full h-full rounded-[10px] lg:rounded-[15px] 2xl:rounded-[24px] p-[10px] lg:p-[10px] 2xl:p-[15px] 3xl:p-[20px] relative z-0 transition-all duration-300 flex flex-col
                `}
    >
      {isActive ? (
        <Image
          src={"/images/welcomebx-bg.png"}
          alt={"welcomeBg"}
          width={200}
          height={200}
          className="max-w-[100px] lg:max-w-[140px] xl:max-w-[160px] 2xl:max-w-[180px] 3xl:max-w-[200px] opacity-75 absolute -z-1 bottom-[10px] lg:bottom-[15px] 2xl:bottom-[20px] left-0 right-0 m-auto transition-opacity duration-300"
        />
      ) : (
        ""
      )}
      <div
        className={`${
          isActive ? "aspect-[386/254]" : "aspect-[300/230]"
        } group w-full overflow-hidden rounded-[10px] lg:rounded-[15px] 2xl:rounded-[24px] mb-[15px] lg:mb-[20px] 3xl:mb-[30px] relative`}
      >
        <Image
          src={item?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image}` : "/images/welcome-4.jpg"}
          alt={item?.image_alt ? item?.image_alt : "welcome-4"}
          fill
          sizes="386px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="w-full flex flex-col flex-grow">
        <div
          className={`${
            isActive
              ? "text-[14px] lg:text-[18px] xl:text-[19px] 2xl:text-[24px] 3xl:text-[30px]"
              : "text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[17px] 2xl:text-[20px] 3xl:text-[22px]"
          } font-bold text-base1 line-clamp-1 leading-none mb-[5px] lg:mb-[10px] 3xl:mb-[15px] transition-all duration-300`}
        >
          {item?.title ? item?.title : "Quick pay"}
        </div>

        <div
          className={`${
            isActive
              ? "text-[12px] lg:text-[14px] xl:text-[15px] 2xl:text-[18px] 3xl:text-[22px] text-black leading-[1.1]"
              : "text-[12px] lg:text-[12px] xl:text-[13px] 2xl:text-[16px] 3xl:text-[18px] leading-[1.3]"
          } font-normal text-[#323232] line-clamp-3 mb-[10px] lg:mb-[15px] 2xl:mb-[20px] transition-all duration-300`}
        >
          {item?.description ? item?.description : "efficient payment solution designed to make transactions faster and easier."}
        </div>

        <Link
          href={item?.button_link ? item?.button_link : "/"}
          className={`${
            isActive ? "border-base1 bg-base1 text-white" : "bg-white border-black/25 text-black"
          } group flex items-center justify-center gap-[4px] lg:gap-[6px] 2xl:gap-[8px] w-full h-[30px] lg:h-[35px] 2xl:h-[42px] text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[14px] 3xl:text-[16px] uppercase text-normal rounded-full border mt-auto transition-all duration-300 hover:bg-base1/80 hover:text-white
                    `}
        >
          {item?.button_text ? item?.button_text : "Get Started"}
          <svg
            width="7"
            height="13"
            viewBox="0 0 7 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[5px] 2xl:w-[6px] h-auto block transition-transform duration-300 group-hover:translate-x-[2px]"
          >
            <path d="M6.5 6.5L0.125 12.9952V0.00480938L6.5 6.5Z" fill="#EE3824" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function WelcomeModal({ banner, serviceBanner }) {
  const appear_in = banner?.banner_popup_appearence_time || serviceBanner?.banner_popup_appearence_time;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenWelcomeModal");

    if (!hasSeenModal) {
      // Get appearance time from banner props (convert to milliseconds)
      const appearanceTime = (appear_in || 5) * 1000;

      // Show modal after appearance time (initial delay)
      const initialTimer = setTimeout(() => {
        setIsOpen(true);
      }, appearanceTime);

      // Set up appearance time interval to reappear
      const intervalTimer = setInterval(() => {
        // Check again if user has manually closed it during the interval
        const currentStatus = localStorage.getItem("hasSeenWelcomeModal");
        if (!currentStatus) {
          setIsOpen(true);
        }
      }, appearanceTime);

      // Cleanup timers on component unmount
      return () => {
        clearTimeout(initialTimer);
        clearInterval(intervalTimer);
      };
    }
  }, [banner?.banner_popup_appearence_time, serviceBanner?.banner_popup_appearence_time]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcomeModal", "true");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <div className="w-full sm:min-w-[608px] md:min-w-[736px] lg:min-w-[864px] xl:min-w-[1088px] 2xl:min-w-[1312px] 3xl:min-w-[1664px] mx-auto bg-white rounded-[15px] lg:rounded-[36px] py-[20px] lg:py-[30px] xl:py-[40px] 2xl:py-[60px] 3xl:py-[70px] px-[15px] lg:px-[40px] xl:px-[45px] 2xl:px-[50px] 3xl:px-[60px] relative z-0">
          <AlertDialogCancel
            onClick={handleClose}
            className="group text-[12px] 2xl:text-[14px] 3xl:text-[16px] leading-none focus:outline-0 flex gap-[4px] lg:gap-[6px] 2xl:gap-[10px] absolute z-0 top-[15px] lg:top-[40px] xl:top-[45px] 2xl:top-[50px] 3xl:top-[60px] right-[15px] lg:right-[40px] xl:right-[45px] 2xl:right-[50px] 3xl:right-[60px] transition-color cursor-pointer hover:text-base2 items-center"
          >
            Close
            <Image
              src="/images/modal-cancel.svg"
              alt="modal-cancel"
              width={24}
              height={24}
              className="group-hover:scale-90 transition-all duration-300"
            />
          </AlertDialogCancel>
          <div className="flex flex-wrap gap-[15px] lg:gap-[20px] xl:gap-[30px] 2xl:gap-[40px] 3xl:gap-[50px] mb-[10px] sm:mb-[15px] lg:mb-[20px] 2xl:mb-[30px] 3xl:mb-[40px]">
            <div className="w-full max-w-[80px] sm:max-w-[90px] md:max-w-[100px] lg:max-w-[120px] xl:max-w-[140px] 2xl:max-w-[180px] 3xl:max-w-[280px] h-auto inline-block">
              <Image
                src={
                  banner?.logo
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${banner?.logo}`
                    : serviceBanner?.logo
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${serviceBanner?.logo}`
                    : "/icons/logo_sm.svg"
                }
                alt={banner?.image_alt ? banner?.image_alt : "alt"}
                width={218}
                height={112}
                inert
              />
            </div>
            <div>
              <AlertDialogTitle className="text-[18px] sm:text-[24px] md:text-[30px] lg:text-[38px] xl:text-[44px] 2xl:text-[56px] 3xl:text-[64px] text-base2 leading-none font-bold mt-[2px] 2xl:mt-[4px] mb-[4px] 2xl:mb-[6px]">
                {banner?.title ? banner?.title : serviceBanner?.title ? serviceBanner?.title : "Welcome!"}
              </AlertDialogTitle>
              <div className="text-[14px] sm:text-[16px] md:text-[20px] lg:text-[22px] xl:text-[24px] 2xl:text-[32px] 3xl:text-[36px] text-[#1e1e1e] leading-none font-normal">
                {banner?.sub_title ? banner?.sub_title : serviceBanner?.sub_title ? serviceBanner?.sub_title : "What Brings You Here Today?"}
              </div>
            </div>
          </div>
          {/* Banner image - if banner exists */}
          {banner && (
            <div className="w-full mb-[20px] sm:mb-0">
              <Link
                href={banner?.image_link ? banner?.image_link : "/"}
                className="block w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] 2xl:h-[450px] 3xl:h-[500px] relative overflow-hidden rounded-[10px] lg:rounded-[15px] 2xl:rounded-[20px] group"
              >
                <Image
                  src={banner?.banner_popup_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${banner?.banner_popup_image}` : "/icons/logo_sm.svg"}
                  fill
                  sizes="(max-width: 640px) 350px, (max-width: 768px) 608px, (max-width: 1024px) 736px, (max-width: 1280px) 864px, (max-width: 1536px) 1088px, (max-width: 1920px) 1312px, 1664px"
                  alt={banner?.image_alt ? banner?.image_alt : "banner image"}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          )}
          {serviceBanner && (
            <div className="-mx-[4px] lg:-mx-[6px] 2xl:-mx-[10px] relative z-0 before:absolute before:inset-0 before:left-auto before:z-2 before:block before:bg-gradient-to-r before:to-white before:from-transparent before:w-[20px] before:h-full before:pointer-events-none before:xl:hidden">
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={0}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                className="welcomeSlide"
              >
                {serviceBanner?.services?.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    className={`${
                      index === 0
                        ? "max-w-[220px] sm:max-w-[240px] lg:max-w-[260px] xl:max-w-[290px] 2xl:max-w-[360px] 3xl:max-w-[450px]"
                        : "max-w-[200px] sm:max-w-[220px] lg:max-w-[240px] xl:max-w-[calc((100%-290px)/3)] 2xl:max-w-[calc((100%-360px)/3)] 3xl:max-w-[calc((100%-450px)/3)]"
                    } h-auto! p-[4px] lg:p-[6px] 2xl:p-[10px] transition-all duration-300 `}
                  >
                    <WelcomeBox item={item} index={index} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
