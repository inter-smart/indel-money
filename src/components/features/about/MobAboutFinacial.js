"use client";
import Image from "next/image";
import CountUp from "react-countup";
import { renderHtml } from "@/lib/utils/htmlParser";

function MobCountBox({ count, title }) {
  return (
    <div className="">
      <div className="text-[22px] font-bold leading-none line-clamp-1 text-white mb-[6px]">
        <span className="relative z-0">
          <span className="text-transparent">{count}</span>
          <CountUp
            className="absolute z-1 inset-0 top-[2px] m-auto"
            end={count}
            duration={2}
            separator=""
          />
        </span>
        +
      </div>
      <div className="text-[12px]  font-medium  text-white max-w-100% bg-base1 rounded-[32px] p-[10px_15px]">
        <span className="w-[10px] h-[10px] rounded-full bg-base2 mr-[4px] 4xs:mr-[8px] inline-block"></span>
        {title}
      </div>
    </div>
  );
}

export default function MobAboutFinacial({
  super_title,
  title,
  statsData,
  sub_title,
  description,
}) {
  return (
    <section className="w-full py-[30px_25px]">
      <div className="container">
        <div className="w-full">
          <h2 className="text-[20px] leading-[1.2] font-normal text-[#1e1e1e] max-w-[300px] mb-[20px]">
            {super_title ? (
              <>
                <span className="text-base2 font-bold">{super_title}</span> :{" "}
                {title}
              </>
            ) : (
              "Indel"
            )}
          </h2>
          <div className="w-full h-auto p-[10px_5px] rounded-[15px] bg-linear-to-tl from-base2 to-base1 flex flex-wrap [&>*]:p-[5px] 4sx:[&>*]:p-[10px] relative z-0">
            <div className="w-67.5 h-auto aspect-square flex items-center justify-center absolute -z-1 inset-[15%_10%_auto_auto] m-auto">
              <Image
                src="/images/about-indel-logo.svg"
                alt="Indel Logo"
                width={270}
                height={270}
                className="size-full object-contain"
              />
            </div>
            <div className="w-1/2">
              <div className="w-full h-[170px] 4xs:h-[175px] overflow-hidden rounded-[24px] relative z-0">
                <Image
                  src="/images/mob-about-1.jpg"
                  alt="mob"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-1/2">
              <div className="w-full h-[170px] 4xs:h-[175px] overflow-hidden rounded-[24px] bg-white p-[18px_12px]">
                <div className="text-[22px] 4sx:text-[26px] font-bold leading-none line-clamp-1 text-black mb-[10px]">
                  <span className="relative z-0">
                    <span className="text-transparent">{1}</span>
                    <CountUp
                      className="absolute z-1 inset-0 top-[2px] m-auto"
                      end={1}
                      duration={2}
                      separator=""
                    />
                  </span>
                  Million+
                </div>
                <div className="w-full mb-[10px]">
                  <Image
                    src="/images/gropImg.png"
                    alt="Group Image"
                    width={110}
                    height={36}
                  />
                </div>
                <p className="text-[12px] leading-[1.3] line-clamp-4 font-medium text-black">
                  Trusted by million of satisfied users, our financial services
                  have made a real impact on people ss lives.
                </p>
              </div>
            </div>
            {statsData?.length > 0 ? (
              <div className="w-full h-auto grid grid-cols-2 gap-5 py-5!">
                {statsData.map((item, index) => (
                  <MobCountBox
                    key={index}
                    count={item.value}
                    title={item.description}
                  />
                ))}
              </div>
            ) : (
              <span>No data</span>
            )}

            <div className="">
              <div className="w-full h-auto overflow-hidden rounded-[10px] bg-white p-[18px]">
                <h5 className="text-[16px] leading-[1.2] font-bold text-base1 mb-[8px]">
                  {sub_title ? sub_title : ""}
                </h5>
                {description ? renderHtml(description) : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
