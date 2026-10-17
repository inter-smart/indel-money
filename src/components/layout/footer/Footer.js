import PlaceholdersAndVanishInputDemo from "../footer/SubscribeForm";
import Image from "next/image";
import Link from "next/link";
import "./Footer.css";

const navigations = [
  {
    title: "About",
    links: [
      { linkname: "About Indel Money", href: "/about-indel-money" },
      { linkname: "Board of Directors", href: "/board-of-directors" },
      { linkname: "Life at Indel Money", href: "/career#life" },
      { linkname: "Employee Testimonials", href: "/emptestimonial" },
      {
        linkname: "Different Shades of Indel",
        href: "/different-shades-of-indelmoney",
      },
    ],
  },
  {
    title: "Investors",
    links: [
      { linkname: "Investors Reports", href: "/annual-reports" },
      { linkname: "Ombudsman Scheme", href: "/ombudsman" },
    ],
  },
  {
    title: "Product & Services",
    links: [
      { linkname: "MSME Loan", href: "/msme-loan" },
      {
        linkname: "Consumer Durable Loans",
        href: "/consumer-durable-loans",
      },
      { linkname: "Services", href: "/services" },
      // { linkname: "Loan Against Property", href: "/loan-against-property" },
      { linkname: "Gold Loan Schemes", href: "/gold-loan#scheme" },
      { linkname: "E-Connect", href: "https://econnect.indelmoney.com/payments/web-app/terms" },
    ],
  },
  {
    title: "Media",
    links: [
      { linkname: "News", href: "/news" },
      { linkname: "Blog", href: "/blog" },
      { linkname: "Image Gallery", href: "/gallery" },
      { linkname: "Video Gallery", href: "/gallery?type=video&page=1" },
    ],
  },
  {
    title: "Policies",
    links: [
      { linkname: "Privacy Policy", href: "/privacy-policy" },
      { linkname: "Disclaimer", href: "/disclaimer" },
      { linkname: "Mobile App Policy", href: "/mobile-app-privacy-policy-indel-money-private-limited" },
      { linkname: "Fair Practice Code", href: "/fair-practices-code" },
      { linkname: "Terms & Conditions", href: "/gold-loan-terms-and-conditions" },
      { linkname: "KYC Policy", href: "/kyc-policy" },
      { linkname: "Methodology and Valuation of Gold Collateral", href: "/methodology-and-valuation-of-gold-collateral" },
      { linkname: "Contest T&C", href: "/contest" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { linkname: "Contact Us", href: "/contact" },
      { linkname: "Careers", href: "/career" },
      { linkname: "CSR", href: "/indel-money-cares" },
      { linkname: "EMI Calculator", href: "/#calculator" },
      { linkname: "NCD Issues", href: "/ncd-issue" },
    ],
  },
];

function ContactBox({ href, src, title, alt }) {
  return (
    <a href={href} rel="noopener noreferrer" className="group flex items-center gap-[10px] 3xl:gap-[15px]">
      <span>
        <Image src={src} width={36} height={36} alt={alt} className="w-[15px] 4xs:w-[20px] sm:w-[20px] xl:w-[25px] 3xl:w-[30px] h-[auto] block" />
      </span>
      <span className="text-[16px] lg:text-[18px] xl:text-[22px] 2xl:text-[25px] 3xl:text-[34px] font-medium group-hover:text-base2 transition-color duration-300">
        {title}
      </span>
    </a>
  );
}

function ExternalLinkBtn({ btn1, btn1_link, btn2, btn2_link }) {
  return (
    <div className="flex flex-wrap flex-col sm:flex-row gap-[10px] sm:gap-[10px] 2xl:gap-[15px] 3xl:gap-[20px]">
      <div>
        <a href={btn1_link ? btn1_link : "/"} target="_blank" className="btn btn-base1 w-[120px] sm:w-[100px] xl:w-[110px] 3xl:w-[160px]">
          {btn1 ? btn1 : "E Connect"}
        </a>
      </div>
      <div>
        <a href={btn2_link ? btn2_link : "/"} target="_blank" className="btn btn-base2 w-[120px] sm:w-[100px] xl:w-[110px] 3xl:w-[160px]">
          {btn2 ? btn2 : "Indel Remit"}
        </a>
      </div>
    </div>
  );
}

export default function Footer({ content, icons }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full h-auto block bg-[#e6edf7] pt-[30px] lg:pt-[40px] xl:pt-[60px] 3xl:pt-[80px] pb-[15px] lg:pb-[20px] xl:pb-[30px] 3xl:pb-[40px]">
      <div className="container">
        <div className="flex flex-wrap mx-0 lg:-mx-[20px] xl:-mx-[30px] 3xl:-mx-[35px] mb-[10px] lg:mb-[30px] xl:mb-[40px] 3xl:mb-[60px]">
          <div className="w-full lg:w-3/10 py-[10px] lg:py-0 lg:px-[20px] xl:px-[30px] 3xl:px-[35px]">
            <div className="w-full h-auto block mb-4 xl:mb-6">
              <Image
                src={content?.logo ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.logo}` : "/images/logo-ft.svg"}
                alt="logo"
                width={360}
                height={60}
                className="max-w-[200px] 4xs:max-w-[240px] sm:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px] 3xl:max-w-[320px] aspect-360/60"
              />
            </div>
            <div className="w-full h-auto block mb-[10px] xl:mb-[15px]">
              <div className="text-footer1 mb-[10px] 2xl:mb-[15px]">{content?.title}</div>
              <div className="text-footer2 leading-[1.3] mb-[10px] sm:mb-[15px]">
                {content?.address
                  ? content?.address
                  : "Indel Money Limited Office No. 301, Floor No. 3, Sai Arcade, N S Road, Mulund, West Mumbai - 400 080"}
              </div>
            </div>
            <div className="w-full h-auto block mb-[10px] xl:mb-[15px]">
              <div className="text-footer1 mb-[10px] 2xl:mb-[15px]">{content?.address_title_2}</div>
              <div className="text-footer2 leading-[1.3] mb-[10px] sm:mb-[15px]">
                {content?.address_second
                  ? content?.address_second
                  : "Indel Money Limited Office No. 301, Floor No. 3, Sai Arcade, N S Road, Mulund, West Mumbai - 400 080"}
              </div>
            </div>
            <div className="w-full h-auto block mb-[15px] xl:mb-[15px]">
              <div className="text-[14px] lg:text-[16px] 3xl:text-[20px] font-medium text-[#1b1b1b] flex gap-[10px] lg:gap-[15px] 3xl:gap-[20px] my-[10px] 3xl:my-[15px]">
                <Image src={"/images/icon-ft-call.svg"} alt="call" width={16} height={16} className="w-[16px] h-auto aspect-1/1" />
                <Link
                  href={content?.toll_free_num ? `tel:${content?.toll_free_num}` : "tel:18004253990"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-base2 transition-color duration-300"
                >
                  {content?.toll_free_num ? content?.toll_free_num : "1800 4253 990"}
                </Link>
              </div>
              <div className="text-[14px] lg:text-[16px] 3xl:text-[20px] font-medium text-[#1b1b1b] flex gap-[10px] lg:gap-[15px] 3xl:gap-[20px] my-[10px] 3xl:my-[15px]">
                <Image src="/images/icon-ft-email.svg" alt="mail" width={16} height={16} className="w-[16px] h-auto aspect-1/1" />
                <Link
                  href={content?.email ? `mailto:${content?.email}` : "mailto:care@indelmoney.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-base2 transition-color duration-300"
                >
                  {content?.email ? content?.email : "care@indelmoney.com"}
                </Link>
              </div>
            </div>
            <div className="w-full h-auto block sm:mb-[15px] xl:mb-[20px]">
              <h4 className="text-[14px] lg:text-[16px] 3xl:text-[18px] leading-none font-medium text-black mb-[15px] 3xl:mb-[20px]">
                {content?.news_letter_title ? content?.news_letter_title : "Subscribe to our newsletter"}
              </h4>
              <PlaceholdersAndVanishInputDemo />
            </div>
            <div className="w-full h-auto hidden sm:block">
              <ExternalLinkBtn
                btn1={content?.button_1_text}
                btn1_link={content?.button_1_link}
                btn2={content?.button_2_text}
                btn2_link={content?.button_2_link}
              />
            </div>
          </div>
          <div className="w-full lg:w-7/10 py-[10px] lg:py-0 lg:px-[20px] xl:px-[30px] 3xl:px-[35px]">
            <div className="w-full h-auto columns-2 sm:columns-5">
              {navigations?.map((item, index) => (
                <div
                  key={index}
                  className={`${item.title === "Policies" && "max-sm:hidden"} break-inside-avoid-column [display:table] w-full h-auto mb-3 xl:mb-6`}
                >
                  <div className="text-footer1 mb-[10px] 2xl:mb-[20px]">{item.title}</div>
                  <div className="w-100% max-w-[80px] lg:max-w-[100px] 3xl:max-w-[120px] flex h-auto mb-[15px] 2xl:mb-[20px]">
                    <span className="w-4/10 h-[4px] bg-base1"></span>
                    <span className="w-6/10 h-[4px] bg-base2"></span>
                  </div>
                  {item.links?.map((link, linkIndex) => (
                    <div key={linkIndex} className="w-full mb-[10px] 2xl:mb-[15px]">
                      <Link href={link.href} className="text-footer2 block transition-color duration-300 hover:text-base2">
                        {link.linkname}
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
              <div className="w-full h-auto block sm:hidden">
                <ExternalLinkBtn
                  btn1={content?.button_1_text}
                  btn1_link={content?.button_1_link}
                  btn2={content?.button_2_text}
                  btn2_link={content?.button_2_link}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="w-full h-auto bg-[#c0dbff] rounded-[20px] sm:rounded-[15px] 3xl:rounded-[20px] p-[15px] 4xs:p-[20px] xs:p-[25px_25px]
         sm:p-[15px_20px] xl:p-[20px_40px] 2xl:px-[30px_60px] border-[1px] border-solid border-base1/10 flex items-center justify-center mb-[20px] 
         lg:mb-[30px] xl:mb-[40px] 2xl:mb-[60px]"
        >
          <div className="w-full h-auto flex flex-wrap items-center justify-between gap-[15px]">
            <div className="flex flex-wrap items-center max-sm:w-full gap-y-[10px] gap-x-[10px] 4xs:gap-x-[20px] sm:gap-x-[15px] 2xl:gap-x-[20px] 3xl:gap-x-[30px]">
              <div>
                <div className="text-[16px] sm:text-[16px] lg:text-[20px] 3xl:text-[24px] font-medium text-black">
                  {content?.social_media_text ? content?.social_media_text : "Follow Us on:"}
                </div>
              </div>
              {icons?.map((item, index) => (
                <div key={index}>
                  <a
                    href={item?.link ? item?.link : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[15px] 4xs:w-[20px] sm:w-[15px] 2xl:w-[20px] 3xl:w-[25px] h-auto aspect-square relative z-0 block transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={item.icon ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.icon}` : "/images/goldIcon1.svg"}
                      alt={item?.title ? item?.title : "icon"}
                      // fill
                      width={15}
                      height={15}
                      className="aspect-square object-contain m-auto"
                    />
                  </a>
                </div>
              ))}
            </div>
            <div>
              <ContactBox
                href={content?.branch_locator_link ? content?.branch_locator_link : "/branch-locator"}
                src={
                  content?.branch_locator_icon_web
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.branch_locator_icon_web}`
                    : "/images/icon-map.svg"
                }
                title={content?.branch_locator ? content?.branch_locator : "Branch Locator"}
                alt="location"
              />
            </div>
            <div>
              <ContactBox
                href={content?.toll_free_num ? `tel:${content?.toll_free_num}` : "tel:18004253990"}
                src={content?.toll_free_icon_web ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.toll_free_icon_web}` : "/images/icon-call.svg"}
                title={content?.toll_free_num ? content?.toll_free_num : "1800 425 39 90"}
                alt="call"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-auto pb-[15px] mb-[15px] border-b-[1px] border-solid border-black/20 flex flex-wrap sm:hidden">
          {navigations
            .find((item) => item.title === "Policies")
            .links?.map((link, linkIndex) => (
              <div key={linkIndex} className="flex items-center mb-[10px] 2xl:mb-[15px]">
                <Link href={link.href} className="text-footer2 block transition-color duration-300 hover:text-base2">
                  {link.linkname}
                </Link>
                <span className="mx-[15px] w-[1px] h-[25px] bg-base1/20 rotate-[25deg]"></span>
              </div>
            ))}
        </div>
        <div className="w-full h-auto flex items-center justify-between">
          <div className="text-footer2">
            © {currentYear} Indel Money.
            <br className="block sm:hidden" /> All Rights Reserved
          </div>
          <div className="text-footer2 hidden md:block">CIN: U65990MH1986PLC040897</div>
          <div className="text-footer2 flex whitespace-nowrap gap-1">
            Designed By:
            <Link href={"https://www.intersmartsolution.com/"} target="_blank" rel="noopener noreferrer" className="">
              <Image src={"/images/intersmart.svg"} alt={"intersmart"} width={104} height={16} className="aspect-104/16 inline" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
