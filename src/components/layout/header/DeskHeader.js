"use client";
import Image from "next/image";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useEffect, useState } from "react";
import NavMenu from "./NavMenu";

function ContactBox({ href, src, title, alt }) {
  return (
    <a href={href} className="group flex items-center gap-1">
      <span>
        <Image src={src} width={15} height={15} alt={alt} className="w-[10px] h-[auto] lg:w-[12px] 3xl:w-[14px] block" />
      </span>
      <span className="text-header1 group-hover:text-base2 transition-color duration-300">{title}</span>
    </a>
  );
}

export default function DeskHeader({ headerData }) {
  const header = headerData?.content;
  const common = headerData?.footerContent;
  const modes = headerData?.modes;

  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isQuickPayOpen, setIsQuickPayOpen] = useState(false);

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
        className="w-full flex items-center bg-white border-base1/10 border-b-1 fixed z-10 top-0 left-0 right-0 shadow-[0_0_10px_rgba(0,0,0,0.20)]"
        style={{ height: "var(--header-y)" }}
      >
        <div className="container">
          <div className="flex items-center">
            <div className="w-[60px] xl:w-[90px] 2xl:w-[120px] 3xl:w-[140px]">
              <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
                <Image
                  src={header?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${header?.logo}` : "/icons/logo_sm.svg"}
                  alt="Logo"
                  width={145}
                  height={75}
                />
              </Link>
            </div>
            <nav className="w-[calc(100%-60px)] xl:w-[calc(100%-90px)] 2xl:w-[calc(100%-120px)] 3xl:w-[calc(100%-140px)] flex justify-end">
              <div className="flex items-center gap-[6px] xl:gap-[10px] 2xl:gap-[14px] 3xl:gap-[14px]">
                <div>
                  {/* <NavMenu /> */}
                  <NavMenu />
                </div>
                <div>
                  <ContactBox
                    href={common?.branch_locator_link ? common?.branch_locator_link : "/branch-locator"}
                    src={
                      common?.branch_locator_icon_web
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${common?.branch_locator_icon_web}`
                        : "/images/icon-map.svg"
                    }
                    title={common?.branch_locator ? common?.branch_locator : "Branch Locator"}
                    alt="location"
                  />
                </div>
                {/* <div>
                  <ContactBox
                    href={common?.toll_free_num ? `tel:${common?.toll_free_num}` : "tel:18004253990"}
                    src={
                      common?.toll_free_icon_web
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${common?.toll_free_icon_web}`
                        : "/images/icon-call.svg"
                    }
                    title={common?.toll_free_num ? common?.toll_free_num : "1800 425 39 90"}
                    alt="call"
                  />
                </div> */}
                <div>
                  <a
                    href={header?.apple_dowload_link ? header?.apple_dowload_link : "/"}
                    target="_blank"
                    className="w-[10px] lg:w-[14px] 2xl:w-[18px] h-auto block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={
                        header?.apple_dowload_icon
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${header?.apple_dowload_icon}`
                          : "/images/icon-appStore.svg"
                      }
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                      alt="app"
                    />
                  </a>
                </div>
                <div>
                  <a
                    href={header?.andrioid_download_link ? header?.andrioid_download_link : "/hello"}
                    target="_blank"
                    className="w-[10px] lg:w-[14px] 2xl:w-[18px] h-auto block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={
                        header?.andrioid_download_icon
                          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${header?.andrioid_download_icon}`
                          : "/images/icon-playStore.svg"
                      }
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                      alt="app"
                    />
                  </a>
                </div>
                <div>
                  <DropdownMenu onOpenChange={setIsQuickPayOpen}>
                    <DropdownMenuTrigger className="btn btn-base1 min-w-[80px] lg:min-w-[85px] xl:min-w-[95px] 2xl:min-w-[115px] 3xl:min-w-[140px] cursor-pointer">
                      {header?.button_1_text ? header?.button_1_text : "Quick Pay"}
                      <Image
                        src="/images/icon-dropdown.svg"
                        width={11}
                        height={6}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          transform: isQuickPayOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                        alt="dropdown"
                        className="ml-1"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#d2dff6] border-none">
                      <DropdownMenuLabel>
                        <div className="text-header1">{header?.button_1_inner_title || "Payment Modes"}</div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-black/20" />
                      {!modes || modes.length === 0 ? (
                        <span className="text-header1 px-2 py-1">No modes found</span>
                      ) : (
                        modes.map((mode) => (
                          <DropdownMenuItem key={mode?.id} className="hover:bg-[#c3d5f2] rounded-md">
                            <Link
                              href={mode?.link || "/"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-header1 hover:text-base2 px-2 py-1 block w-full"
                            >
                              {mode?.title}
                            </Link>
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <Link
                    href={header?.button_2_link || "#"}
                    className="btn btn-base2 min-w-[80px] lg:min-w-[85px] xl:min-w-[95px] 2xl:min-w-[115px] 3xl:min-w-[140px]"
                  >
                    {header?.button_2_text ? header?.button_2_text : "Contact Us"}
                  </Link>
                </div>

                {/* <div>
                  <Link
                    href={"https://asba.indelmoney.com/asbaform"}
                    className="btn btn-base2 min-w-[80px] lg:min-w-[85px] xl:min-w-[95px] 2xl:min-w-[115px] 3xl:min-w-[140px] px-2"
                    >
                    {"Apply for NCD"}
                  </Link>
                </div> */}
              </div>
            </nav>
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  );
}
