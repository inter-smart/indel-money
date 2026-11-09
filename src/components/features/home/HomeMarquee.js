import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function HomeMarquee({
  announcementText,
  goldRateLabel,
  goldRateIcon,
  goldRate,
}) {
  return (
    <div className="w-full h-[var(--marquee-y)] flex flex-wrap items-center bg-[#b7d0ff]">
      <h2 className="w-[240px] lg:w-[220px] 2xl:w-[300px] 3xl:w-[340px] h-[var(--marquee-y)] flex items-center justify-center text-sm1 text-white font-medium bg-gradient-to-r from-base1 to-base2">
        <Image
          src={"/images/marquee-1.png"}
          width={25}
          height={25}
          alt={"coin"}
          className="w-5 h-5 3xl:w-6 3xl:h-6 mr-2 3xl:mr-3 object-contain"
          priority={true}
        />
        {goldRate ? `${goldRateLabel} - ${goldRate} Rs /-` : goldRateLabel}
      </h2>
      <div className="w-[calc(100%-240px)] lg:w-[calc(100%-220px)] 2xl:w-[calc(100%-300px)] 3xl:w-[calc(100%-340px)]">
        <Marquee speed={80} pauseOnHover={true} className="text-sm1">
          {/* Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
          specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining
          essentially unchanged. */}
          {announcementText}
        </Marquee>
      </div>
    </div>
  );
}
