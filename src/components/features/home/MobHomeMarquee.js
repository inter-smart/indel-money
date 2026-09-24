import Image from "next/image";
import Marquee from "react-fast-marquee";

export default function MobHomeMarquee({ announcementText, goldRateLabel, goldRateIcon, goldRate }) {
  return (
    <div className="w-full absolute z-1 bottom-0 left-0 right-0">
      <div className="container">
        <h2 className="w-full text-sm1 leading-none text-white flex items-center gap-[6px] mb-[10px]">
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
          <Marquee speed={80} pauseOnHover={true} className="text-sm1 text-white">
            {/* Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. */}
            {announcementText}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
