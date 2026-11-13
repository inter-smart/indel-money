import Image from "next/image";
import CssMarquee from "../../common/CssMarquee";

export default function MobHomeMarquee({ announcementText, goldRateLabel, goldRateIcon, goldRate }) {
  return (
    <div className="w-full absolute z-1 bottom-0 left-0 right-0">
      <div className="container">
        <h2 className="relative inline-flex items-center gap-[6px] text-sm1 leading-none text-white mb-[10px]">
          <div
            aria-hidden="true"
            className="absolute -inset-x-3 -inset-y-[6px] -z-1 rounded-full bg-black/45 backdrop-blur-[2px] pointer-events-none"
          />
          <Image
            src={"/images/mob-marquee-1.svg"}
            alt={"coin"}
            width={19}
            height={16}
            className="w-[18px] @sm:w-[15px] object-contain"
          />
          {/* Gold rate */}
          {goldRateLabel}
          {goldRate ? (
            <span className="font-medium text-black p-[6px_10px] bg-[#e8c002] rounded-[20px]">&#8377; {goldRate}</span>
          ) : null}
        </h2>
      </div>
      <div className="w-full h-[var(--marquee-y)] bg-base1 flex items-center">
        <div className="w-full max-w-[calc(100%-((100%-var(--container-x))/2))] pr-0 mr-0 ml-auto pl-[var(--container-padding)]">
          <CssMarquee speed={80} pauseOnHover={true} className="text-sm1 text-white">
            {announcementText}
          </CssMarquee>
        </div>
      </div>
    </div>
  );
}
