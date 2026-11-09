import Image from "next/image";

function StoreBadge({ href, src, alt }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform duration-300 hover:scale-105"
    >
      <Image
        src={src}
        alt={alt}
        width={180}
        height={60}
        className="w-[120px] lg:w-[140px] 2xl:w-[180px] h-auto aspect-180/60"
      />
    </a>
  );
}

export default function AppDownloadStrip({ pageContent }) {
  return (
    <section className="w-full 2xl:mb-[80px] lg:mb-[50px] my-[30px]">
      <div className="container">
        <div className="rounded-[24px] lg:rounded-[36px] bg-[#CAE5F4] flex flex-col md:flex-row items-center justify-center md:justify-between gap-[15px] lg:gap-[30px] px-[20px] lg:px-[45px] 2xl:px-[85px] py-[25px] lg:py-[30px]">
          <div className="text-center md:text-left 2xl:text-[22px] xl:text-[18px] text-[14px] text-[#323232] font-bold">
            Download our mobile application
          </div>
          <div className="flex flex-wrap justify-center gap-[10px] lg:gap-[16px]">
            <StoreBadge
              href={pageContent?.ios_download_link || "#"}
              src="/images/app-download-1.svg"
              alt="Download on the App Store"
            />
            <StoreBadge
              href={pageContent?.android_download_link || "#"}
              src="/images/app-download-2.svg"
              alt="Get it on Google Play"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
