"use client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobNavMenu from "./MobNavMenu";
import { serverMediaPath } from "@/constants/constants";

const socialmedias = [
  {
    href: "/",
    src: "/images/mob-icon-fb.svg",
    alt: "fb",
  },
  {
    href: "/",
    src: "/images/mob-icon-youtube.svg",
    alt: "youtube",
  },
  {
    href: "/",
    src: "/images/mob-icon-insta.svg",
    alt: "insta",
  },
  {
    href: "/",
    src: "/images/mob-icon-linkedin.svg",
    alt: "linkedin",
  },
  {
    href: "/",
    src: "/images/mob-icon-x.svg",
    alt: "x",
  },
];

const quickactions = [
  {
    href: "tel:18004253990 ",
    src: "/images/mob-icon-call.svg",
    alt: "call",
  },
  {
    href: "/",
    src: "/images/mob-icon-location.svg",
    alt: "location",
  },
  {
    href: "/",
    src: "/images/mob-icon-appstore.svg",
    alt: "appstore",
  },
  {
    href: "/",
    src: "/images/mob-icon-playstore.svg",
    alt: "playstore",
  },
];

export default function MobHeader({ socialLinks, links, logo, title, modes }) {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;

      // Show header at the top of the page or when scrolling up
      setIsVisible(currentScrollPos < 10 || !isScrollingDown);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-white border-base1/10 border-b-1 fixed z-10 top-0 left-0 right-0 shadow-[0_0_10px_rgba(0,0,0,0.20)]"
        style={{ height: "var(--header-y)" }}
      >
        <div className="w-full h-[30px] @sm:h-[40px] bg-gradient-to-l from-[#DB0619] to-[#4E2DAD] relative z-0 flex items-center">
          <Image src="/images/mob-header-bg.png" alt="mob-header-bg" fill className="object-cover -z-1" />
          <div className="container flex justify-between items-center">
            <div className="flex flex-wrap items-center gap-x-[15px] @sm:gap-x-[20px]">
              {socialLinks?.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[15px] h-auto aspect-square block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={item.icon ? `${serverMediaPath}${item.icon}` : "/images/mob-icon-insta.svg"}
                      alt={item?.title}
                      width={18}
                      height={36}
                      className="w-full h-full aspect-square object-contain"
                    />
                  </a>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-[15px] @sm:gap-x-[20px]">
              {links?.map((item, index) => (
                <div key={index}>
                  <a
                    href={item.link ? item.link : "/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[15px] h-auto aspect-square block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={item.icon ? `${serverMediaPath}${item.icon}` : "/images/mob-icon-call.svg"}
                      alt="call"
                      width={18}
                      height={36}
                      className="w-full h-full aspect-square object-contain"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100%-30px)] @sm:h-[calc(100%-40px)] flex items-center">
          <div className="container">
            <div className="flex items-center">
              <div className="w-[60px] @sm:w-[80px]">
                <Link href="/" className="block transition-transform duration-300 hover:scale-105">
                  <Image src={logo ? `${serverMediaPath}${logo}` : "/icons/logo_sm.svg"} alt="Indel Logo" width={145} height={75} />
                </Link>
              </div>
              <div className="w-[calc(100%-60px)] @sm:w-[calc(100%-80px)]">
                <div className="flex items-center justify-end gap-x-[15px] @sm:gap-x-[20px]">
                  {/* <div>
                    <Link href="/" className="block transition-transform duration-300 hover:scale-105">
                      <Image src="/images/mob-icon-search.svg" alt="search" width={18} height={18} />
                    </Link>
                  </div>
                  <div>
                    <Link href="/" className="block transition-transform duration-300 hover:scale-105">
                      <Image src="/images/mob-icon-money.svg" alt="money" width={18} height={18} />
                    </Link>
                  </div>
                  <div>
                    <Link href="/" className="block transition-transform duration-300 hover:scale-105">
                      <Image src="/images/mob-icon-saving.svg" alt="saving" width={18} height={18} />
                    </Link>
                  </div> */}
                  {/* <a
                    href={"https://asba.indelmoney.com/asbaform"}
                    target="_blank"
                    className="btn btn-base2 max-w-[150px] "
                  >
                    Apply for NCD
                  </a> */}
                  <div>
                    <MobNavMenu logo={logo} serverMediaPath={serverMediaPath} title={title} modes={modes} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  );
}
