"use client";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    image: "/images/icon-goldloan-4.svg",
    alt: "item",
    title: "Loan Against Property",
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
    link: "/career/#makemove",
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
  // {
  //   title: "foreign exchange",
  //   link: "https://indelremit.com",
  //   target: "_blank",
  // },
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

const Arrow = ({ isOpen }) => {
  return (
    <svg
      width="11"
      height="6"
      viewBox="0 0 11 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`size-2 ml-0.5 transition duration-300 ${isOpen ? "rotate-180" : ""}`}
    >
      <path d="M5.5 6L10.2631 0.75H0.73686L5.5 6Z" fill="#2A2A2A" />
    </svg>
  );
};

function DropdownMenu({ items }) {
  const pathname = usePathname();
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  return (
    <ul className="flex flex-col p-[5px] 3xl:p-[10px] w-[180px] lg:w-[200px] 2xl:w-[240px]">
      {items?.map((item, index) => (
        <li
          key={index}
          onMouseEnter={() => item.hasSubmenu && setExpandedAccordion(index)}
          onMouseLeave={() => item.hasSubmenu && setExpandedAccordion(null)}
        >
          {item.hasSubmenu ? (
            <>
              <MenubarItem className="w-full">
                <div className="text-header1 hover:text-base2 uppercase cursor-pointer transition-colors duration-300 flex items-center justify-between w-full">
                  <span>{item.title}</span>
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`size-2 ml-auto flex-shrink-0 transition-transform duration-300 ${expandedAccordion === index ? "rotate-180" : ""}`}
                  >
                    <path d="M5.5 6L10.2631 0.75H0.73686L5.5 6Z" fill="currentColor" />
                  </svg>
                </div>
              </MenubarItem>
              {expandedAccordion === index && (
                <ul className="pl-[10px] flex flex-col">
                  {item.submenu?.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link href={subItem.link} passHref>
                        <MenubarItem className="w-full">
                          <div
                            className={`${
                              pathname === subItem.link ? "text-base2" : ""
                            } text-header1 hover:text-base2 uppercase cursor-pointer transition-colors duration-300 w-full text-sm`}
                          >
                            {subItem.title}
                          </div>
                        </MenubarItem>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Link href={item.link} passHref>
              <MenubarItem className="w-full">
                <div
                  className={`${
                    pathname === item.link ? "text-base2" : ""
                  } text-header1 hover:text-base2 uppercase cursor-pointer transition-colors duration-300 w-full`}
                >
                  {item.title}
                </div>
              </MenubarItem>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

function MegaMenu({ items }) {
  const pathname = usePathname();
  return (
    <ul className="grid md:grid-cols-2 p-[10px] 3xl:p-[15px] w-[360px] lg:w-[420px] 2xl:w-[576px] 3xl:w-[600px]">
      {items?.map((item, index) => (
        <li key={index}>
          <Link href={item.link} passHref>
            <MenubarItem className="p-0">
              <div className="group flex flex-row items-center p-[10px] 3xl:p-[10px] cursor-pointer">
                {/* <div className="w-[40px] h-[40px] bg-gradient-to-r from-base1 to-base2 rounded-full flex items-center justify-center 3xl:w-[60px] 3xl:h-[60px] transition-transform duration-300 group-hover:scale-95"> */}
                <div className="w-[40px] h-[40px] bg-[#17479e] rounded-full flex items-center justify-center 3xl:w-[60px] 3xl:h-[60px] transition-transform duration-300 group-hover:scale-95">
                  <Image src={item.image} width={28} height={28} alt={item?.alt} className="w-full h-full block max-w-2/4 object-contain" />
                </div>
                <div
                  className={`${
                    pathname === item.link ? "text-base2" : ""
                  } w-[calc(100%-40px)] 3xl:w-[calc(100%-60px)] text-header1 uppercase pl-[5px] lg:pl-[8px] 3xl:pl-[10px] group-hover:text-base2! transition-color duration-300`}
                >
                  {item.title}
                </div>
              </div>
            </MenubarItem>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const tabStyle =
  "text-header1 uppercase hover:text-base2! transition-color duration-300 group p-0 cursor-pointer data-[state=open]:text-base2! group hover:[&*svg:rotate-45] whitespace-nowrap";

const stripPath = (path) => path?.split("#")[0]?.split("?")[0];

const isSectionActive = (pathname, paths) => paths.some((path) => stripPath(path) === pathname);

export default function NavMenu() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleMouseEnter = (menu) => setOpenDropdown(menu);
  const handleMouseLeave = () => setOpenDropdown(null);

  const pathname = usePathname();

  const activeStyle = (active) => (active ? "text-base2!" : "");

  const isGoldLoanActive = isSectionActive(pathname, ["/gold-loan", ...GoldLoans.map((i) => i.link)]);
  const isOtherLoanActive = isSectionActive(
    pathname,
    OtherLoans.map((i) => i.link).filter((link) => link !== "/gold-loan")
  );
  const isCareersActive = isSectionActive(pathname, ["/career", ...Careers.map((i) => i.link)]);
  const isAboutActive = isSectionActive(pathname, [
    "/about-indel-money",
    ...Abouts.flatMap((i) => (i.hasSubmenu ? i.submenu.map((s) => s.link) : [i.link])),
  ]);
  const isInvestorsActive = isSectionActive(pathname, Investors.map((i) => i.link));

  return (
    <Menubar
      onMouseLeave={handleMouseLeave}
      className="flex gap-[8px] xl:gap-[10px] 2xl:gap-[12px] 3xl:gap-[15px] h-[var(--header-y)] lg:px-[10px] 2xl:px-[15px] 3xl:px-[20px] border-none shadow-none"
    >
      <MenubarMenu open={openDropdown === "goldloan"} onOpenChange={(open) => setOpenDropdown(open ? "goldloan" : null)}>
        <div onMouseEnter={() => handleMouseEnter("goldloan")} className="relative">
          <div className="flex">
            <MenubarTrigger className={`${tabStyle} ${activeStyle(isGoldLoanActive)}`}>
              <Link href={"/gold-loan"} className={`${tabStyle} ${activeStyle(isGoldLoanActive)}`}>
                Gold Loan
              </Link>
              <Arrow isOpen={openDropdown === "goldloan"} />
            </MenubarTrigger>
          </div>
          <MenubarContent className="border-[#e4e4e4] bg-white p-0">
            <MegaMenu items={GoldLoans} />
          </MenubarContent>
        </div>
      </MenubarMenu>

      <MenubarMenu>
        <a
          href={"https://indelremit.com"}
          target="_blank"
          className={`${pathname === "#" ? "" : ""} text-header1 uppercase hover:text-base2! transition-color duration-300 p-0 cursor-pointer block whitespace-nowrap`}
        >
          FOREIGN EXCHANGE
        </a>
      </MenubarMenu>

      <MenubarMenu open={openDropdown === "otherloan"} onOpenChange={(open) => setOpenDropdown(open ? "otherloan" : null)}>
        <div onMouseEnter={() => handleMouseEnter("otherloan")} className="relative">
          <MenubarTrigger className={`${tabStyle} ${activeStyle(isOtherLoanActive)}`}>
            <span>other loans</span>
            <Arrow isOpen={openDropdown === "otherloan"} />
          </MenubarTrigger>
          <MenubarContent className="border-[#e4e4e4] bg-white p-0">
            <MegaMenu items={OtherLoans} />
          </MenubarContent>
        </div>
      </MenubarMenu>

      <MenubarMenu open={openDropdown === "careers"} onOpenChange={(open) => setOpenDropdown(open ? "careers" : null)}>
        <div onMouseEnter={() => handleMouseEnter("careers")} className="relative">
          <div className="flex">
            <MenubarTrigger className={`${tabStyle} ${activeStyle(isCareersActive)}`}>
              <Link href={"/career"} className={`${tabStyle} ${activeStyle(isCareersActive)}`}>
                careers
              </Link>
              <Arrow isOpen={openDropdown === "careers"} />
            </MenubarTrigger>
          </div>
          <MenubarContent className="border-[#e4e4e4] bg-white p-0">
            <DropdownMenu items={Careers} />
          </MenubarContent>
        </div>
      </MenubarMenu>

      <MenubarMenu open={openDropdown === "about"} onOpenChange={(open) => setOpenDropdown(open ? "about" : null)}>
        <div onMouseEnter={() => handleMouseEnter("about")} className="relative">
          <div className="flex">
            <MenubarTrigger className={`${tabStyle} ${activeStyle(isAboutActive)}`}>
              <Link href={"/about-indel-money"} className={`${tabStyle} ${activeStyle(isAboutActive)}`}>
                about
              </Link>
              <Arrow isOpen={openDropdown === "about"} />
            </MenubarTrigger>
          </div>
          <MenubarContent className="border-[#e4e4e4] bg-white p-0">
            <DropdownMenu items={Abouts} />
          </MenubarContent>
        </div>
      </MenubarMenu>

      <MenubarMenu open={openDropdown === "investors"} onOpenChange={(open) => setOpenDropdown(open ? "investors" : null)}>
        <div onMouseEnter={() => handleMouseEnter("investors")} className="relative">
          <div className="flex">
            <MenubarTrigger className={`${tabStyle} ${activeStyle(isInvestorsActive)}`}>
              <span>Investors</span>
              <Arrow isOpen={openDropdown === "investors"} />
            </MenubarTrigger>
          </div>
          <MenubarContent className="border-[#e4e4e4] bg-white p-0">
            <DropdownMenu items={Investors} />
          </MenubarContent>
        </div>
      </MenubarMenu>
    </Menubar>
  );
}
