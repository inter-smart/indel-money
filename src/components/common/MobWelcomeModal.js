"use client";
import Image from "next/image";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../ui/custom-alert-dialog";

import { useState, useEffect } from "react";

// Default slides - can be used as fallback if serviceBanner.services is not available
const slides = [
  {
    src: "/images/welcome-1.jpg",
    alt: "welcome-1",
    title: "Gold Loans",
    description: "Need quick financing? Get the best rates with our secure gold loans.",
    link: "/",
    linkname: "Get a Gold Loan Today",
  },
  {
    src: "/images/welcome-2.jpg",
    alt: "welcome-1",
    title: "Other Services",
    description: "We offer a range of services tailored to your needs. Let us guide you.",
    link: "/",
    linkname: "Explore Our Services",
  },
  {
    src: "/images/welcome-3.jpg",
    alt: "welcome-1",
    title: "Career Opportunities",
    description: "Looking for a new opportunity? Explore our open positions and start your journey with us.",
    link: "/",
    linkname: "FIND YOUR DREAM JOB",
  },
  {
    src: "/images/welcome-4.jpg",
    alt: "welcome-1",
    title: "Quick pay",
    description: "efficient payment solution designed to make transactions faster and easier.",
    link: "/",
    linkname: "Make your payment",
  },
];

function WelcomeBox({ item, index }) {
  return (
    <div className="w-full h-auto rounded-[10px] p-[10px] relative z-0 flex flex-wrap bg-[#dceafb] transition-all duration-300">
      <div className="group w-[100px] height-[115px] overflow-hidden rounded-[10px] relative z-0">
        <Image
          src={item?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.image}` : item?.src || "/images/welcome-4.jpg"}
          alt={item?.image_alt || item?.alt || "welcome"}
          fill
          sizes="100px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="w-[calc(100%-100px)] pl-[10px]">
        <div className="text-[14px] leading-none line-clamp-1 font-bold text-base1 mb-[5px] transition-all duration-300">
          {item?.title || "Quick pay"}
        </div>
        <div className="text-[13px] leading-[1.3] line-clamp-3 font-normal text-black mb-[20px] transition-all duration-300">
          {item?.description || "efficient payment solution designed to make transactions faster and easier."}
        </div>
        <Link
          href={item?.button_link || item?.link || "/"}
          className="group text-[12px] uppercase text-normal text-white w-full h-[27px] bg-base1 border-base1 flex items-center justify-center gap-[4px] rounded-[5px] border mt-auto transition-all duration-300"
        >
          {item?.button_text || item?.linkname || "Get Started"}
          <svg
            width="5"
            height="9"
            viewBox="0 0 7 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 group-hover:translate-x-[2px]"
          >
            <path d="M6.5 6.5L0.125 12.9952V0.00480938L6.5 6.5Z" fill="#EE3824" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function MobWelcomeModal({ banner, serviceBanner }) {
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

  // Handle closing the modal and mark it as seen
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcomeModal", "true");
  };

  // Esc / overlay dismissal must also mark the modal as seen, otherwise the timer re-opens it.
  const handleOpenChange = (open) => {
    if (!open) localStorage.setItem("hasSeenWelcomeModal", "true");
    setIsOpen(open);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-24px)] max-w-[380px]">
        <div className="w-full max-h-[85vh] overflow-y-auto mx-auto bg-white rounded-[15px] p-[25px_20px]">
          <AlertDialogCancel
            onClick={handleClose}
            aria-label="Close"
            className="focus:outline-0 flex gap-[4px] absolute z-0 top-[22px] right-[12px] p-[8px] transition-color cursor-pointer items-center"
          >
            <Image src="/images/icon-close.svg" alt="icon-close" width={10} height={10} />
          </AlertDialogCancel>

          <div className="flex flex-wrap gap-[30px] mb-[20px]">
            <div className="w-full max-w-[80px] h-auto inline-block">
              <Image
                src={
                  banner?.logo
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${banner?.logo}`
                    : serviceBanner?.logo
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${serviceBanner?.logo}`
                    : "/icons/logo_sm.svg"
                }
                alt={banner?.image_alt ? banner?.image_alt : "logo"}
                width={86}
                height={44}
                inert
              />
            </div>
            <div>
              <AlertDialogTitle className="text-[20px] text-base2 leading-none font-bold mt-[2px] mb-[4px]">
                {banner?.title ? banner?.title : serviceBanner?.title ? serviceBanner?.title : "Welcome!"}
              </AlertDialogTitle>
              <div className="text-[14px] leading-none font-normal text-[#1e1e1e]">
                {banner?.sub_title ? banner?.sub_title : serviceBanner?.sub_title ? serviceBanner?.sub_title : "What Brings You Here Today?"}
              </div>
            </div>
          </div>

          {/* Show banner image if banner exists */}
          {banner && (
            <div className="mb-[20px]">
              <Link href={banner?.image_link ? banner?.image_link : "/"} className="w-full block">
                <Image
                  src={banner?.banner_popup_image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${banner?.banner_popup_image}` : "/icons/logo_sm.svg"}
                  width={380}
                  height={200}
                  alt={banner?.image_alt ? banner?.image_alt : "banner"}
                  className="w-full h-auto object-cover rounded-[10px]"
                />
              </Link>
            </div>
          )}

          {/* Show service boxes if serviceBanner exists */}
          {serviceBanner && (
            <div className="flex flex-wrap -mx-[4px]">
              {serviceBanner?.services?.map((item, index) => (
                <div key={index} className="w-full p-[4px]">
                  <WelcomeBox item={item} index={index} />
                </div>
              ))}
            </div>
          )}

          {/* Fallback to default slides if neither banner nor serviceBanner exists */}
          {/* {!banner && !serviceBanner && (
            <div className="flex flex-wrap -mx-[4px]">
              {slides?.map((item, index) => (
                <div key={index} className="w-full p-[4px]">
                  <WelcomeBox item={item} index={index} />
                </div>
              ))}
            </div>
          )} */}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
