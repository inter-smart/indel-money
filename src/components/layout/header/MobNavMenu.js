"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/custom-sheet";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const GoldLoans = [
  {
    image: "/images/icon-goldloan-1.svg",
    alt: "item",
    title: "Gold Loan Steps",
    link: "/gold-loan#gold-loan-steps",
  },
  {
    image: "/images/icon-goldloan-2.svg",
    alt: "item",
    title: "Instant & hassle free Gold Loan",
    link: "/gold-loan#hassle-free",
  },
  {
    image: "/images/icon-goldloan-3.svg",
    alt: "item",
    title: "Our Easy Step Gold Loan",
    link: "/gold-loan#easy-step",
  },
  {
    image: "/images/icon-goldloan-4.svg",
    alt: "item",
    title: "Gold Loan Scheme",
    link: "/gold-loan#scheme",
  },
];
const OtherLoans = [
  {
    image: "/images/icon-goldloan-1.svg",
    alt: "item",
    title: "Gold Loan",
    link: "/gold-loan",
  },
  {
    image: "/images/icon-goldloan-2.svg",
    alt: "item",
    title: "MSME Loan",
    link: "/msme-loan",
  },
  {
    image: "/images/icon-goldloan-3.svg",
    alt: "item",
    title: "consumer durable Loan",
    link: "/consumer-durable-loans",
  },
  {
    image: "/images/icon-goldloan-3.svg",
    alt: "item",
    title: "loan against property",
    link: "/loan-against-property",
  },
];
const Careers = [
  {
    title: "life at indel",
    link: "/career#life",
  },
  {
    title: "employee testimonial",
    link: "/emptestimonial",
  },
  {
    title: "current openings",
    link: "/career-list",
  },
  {
    title: "apply now",
    link: "/career-list",
  },
];
const Abouts = [
  {
    title: "indel values",
    link: "/indel-values",
  },
  {
    title: "management team",
    link: "/management-team",
  },
  {
    title: "board of directors",
    link: "/board-of-directors",
  },
  {
    title: "partners",
    link: "/partners",
  },
  {
    title: "history",
    link: "/history-of-indel",
  },
  {
    title: "different shades of indel",
    link: "/different-shades-of-indelmoney",
  },
  {
    title: "media",
    hasSubmenu: true,
    submenu: [
      {
        title: "news",
        link: "/news",
      },
      {
        title: "blog",
        link: "/blog",
      },
      {
        title: "image gallery",
        link: "/gallery",
      },
      {
        title: "video gallery",
        link: "/gallery?type=video&page=1",
      },
    ],
  },
];

const Investors = [
  {
    title: "Investors Report",
    link: "/annual-reports",
  },
  {
    title: "Ombudsman Scheme",
    link: "/ombudsman",
  },
  {
    title: "NCD",
    link: "/ncd",
  },
];

const Arrow = () => {
  return (
    <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-2 ml-0.5">
      <path d="M5.5 6L10.2631 0.75H0.73686L5.5 6Z" fill="#2A2A2A" />
    </svg>
  );
};

function DropdownMenu({ items, handleClose, title, type = "" }) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (index) => {
    setOpenSubmenu((prev) => (prev === index ? null : index));
  };

  return (
    <ul className="flex flex-col py-[5px]">
      {items?.map((item, index) => (
        <li key={index}>
          {item.hasSubmenu ? (
            <div>
              <div
                className="text-[14px] leading-none font-normal hover:text-base2 uppercase cursor-pointer p-[10px_15px] transition-color duration-300 flex justify-between items-center"
                onClick={() => toggleSubmenu(index)}
              >
                <span>{item.title}</span>
                <button
                  className={`${
                    openSubmenu === index ? "rotate-180" : "rotate-0"
                  } focus:outline-none transform-center transition-transform duration-300`}
                  aria-label="Toggle submenu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openSubmenu === index ? "max-h-full" : "max-h-0"
                }`}
              >
                <ul className="flex flex-col">
                  {item.submenu?.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subItem.link} onClick={handleClose}>
                        <div
                          className={`${
                            pathname === subItem.link ? "text-base2" : ""
                          } text-[13px] leading-none font-normal hover:text-base2 uppercase cursor-pointer p-[10px_15px_10px_30px] transition-color duration-300`}
                        >
                          {subItem.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <Link href={item.link} onClick={handleClose}>
              <div
                className={`${
                  pathname === item.link ? "text-base2" : ""
                } text-[14px] leading-none font-normal hover:text-base2 uppercase cursor-pointer p-[10px_15px] transition-color duration-300`}
              >
                {item.title ? item.title : title}
              </div>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

const tabStyle =
  "group text-header1 uppercase hover:text-base2 w-full h-auto flex gap-[5px] justify-between transition-color duration-300 p-[15px] cursor-pointer";

export default function MobNavMenu({ logo, serverMediaPath, title, modes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };
  const handleClose = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="outline-0">
        <div className="w-[30px] @sm:w-[38px] h-[30px] @sm:h-[38px] bg-base2 rounded-[4px] flex items-center justify-center">
          <Image src="/images/mob-navMenuIcon.svg" alt="nav" width={20} height={15} />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only"></SheetTitle>
          <SheetDescription className="sr-only">mobile navigation</SheetDescription>
          <div className="w-full h-[var(--header-y)] bg-white shadow-sm p-[15px] flex justify-between items-center">
            <div className="w-[40px] 4xs:w-[60px]">
              <Link href="/" className="block transition-transform duration-300 hover:scale-105">
                <Image src={logo ? `${serverMediaPath}${logo}` : "/icons/logo_sm.svg"} alt="Logo" width={145} height={75} />
              </Link>
            </div>
          </div>
          <div className="py-[5px]">
            <div>
              <div
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <Link href={"/gold-loan"} onClick={handleClose}>
                  <span className="uppercase">Gold Loan</span>
                </Link>
                <button
                  className={`${openDropdown === "goldLoan" ? "rotate-180" : "rotate-0"} focus:outline-none transform-center`}
                  onClick={() => toggleDropdown("goldLoan")}
                  aria-label="Toggle mobile menu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "goldLoan" ? "max-h-full" : "max-h-0"
                }`}
              >
                <DropdownMenu items={GoldLoans} handleClose={handleClose} />
              </div>
            </div>
            <div>
              <a
                href={"https://indelremit.com/"}
                onClick={handleClose}
                target="_blank"
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <span>foreign exchange</span>
              </a>
            </div>
            <div>
              <div
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <span>other loans</span>
                <button
                  className={`${openDropdown === "otherLoan" ? "rotate-180" : "rotate-0"} focus:outline-none transform-center`}
                  onClick={() => toggleDropdown("otherLoan")}
                  aria-label="Toggle mobile menu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "otherLoan" ? "max-h-full" : "max-h-0"
                }`}
              >
                <DropdownMenu items={OtherLoans} handleClose={handleClose} />
              </div>
            </div>
            <div>
              <div
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <Link href={"/career"} onClick={handleClose}>
                  <span>careers</span>
                </Link>
                <button
                  className={`${openDropdown === "careers" ? "rotate-180" : "rotate-0"} focus:outline-none transform-center`}
                  onClick={() => toggleDropdown("careers")}
                  aria-label="Toggle mobile menu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "careers" ? "max-h-full" : "max-h-0"
                }`}
              >
                <DropdownMenu items={Careers} handleClose={handleClose} />
              </div>
            </div>
            <div>
              <div
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <Link href={"/about-indel-money"} onClick={handleClose}>
                  <span>about</span>
                </Link>
                <button
                  className={`${openDropdown === "abouts" ? "rotate-180" : "rotate-0"} focus:outline-none transform-center`}
                  onClick={() => toggleDropdown("abouts")}
                  aria-label="Toggle mobile menu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "abouts" ? "max-h-full" : "max-h-0"
                }`}
              >
                <DropdownMenu items={Abouts} handleClose={handleClose} />
              </div>
            </div>

            <div>
              <div
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <span>Investors</span>
                <button
                  className={`${openDropdown === "investors" ? "rotate-180" : "rotate-0"} focus:outline-none transform-center`}
                  onClick={() => toggleDropdown("investors")}
                  aria-label="Toggle mobile menu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "investors" ? "max-h-full" : "max-h-0"
                }`}
              >
                <DropdownMenu items={Investors} handleClose={handleClose} />
              </div>
            </div>

            <div>
              <Link
                href={"/contact"}
                onClick={handleClose}
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <span>Contact us</span>
              </Link>
            </div>
            {/* <div>
              <Link
                href={"https://econnect.indelmoney.com/payments/web-app/login"}
                onClick={handleClose}
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <span>{title ? title : "quick pay"}</span>
              </Link>
            </div> */}
            <div>
              <div
                className={`${tabStyle} relative z-0 before:content-[''] before:absolute before:z-0 before:bottom-0 before:left-0 before:right-0 before:w-[calc(100%-30px)] before:h-[1px] before:bg-gray-200 before:block before:mx-auto`}
              >
                <span>{title ? title : "quick pay "}</span>
                <button
                  className={`${openDropdown === "quick" ? "rotate-180" : "rotate-0"} focus:outline-none transform-center`}
                  onClick={() => toggleDropdown("quick")}
                  aria-label="Toggle mobile menu"
                >
                  <Arrow />
                </button>
              </div>
              <div
                className={`w-full bg-base1/10 overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === "quick" ? "max-h-full" : "max-h-0"
                }`}
              >
                <DropdownMenu items={modes} handleClose={handleClose} />
              </div>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
