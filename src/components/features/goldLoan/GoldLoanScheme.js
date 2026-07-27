"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { useState } from "react";

export default function Scheme({ goldLoanSchemes, scheme_title }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const schemes = goldLoanSchemes?.goldLoanSchemes || [];
  const schemeDetails = goldLoanSchemes?.goldLoanSchemeDetails || [];

  return (
    <section className="py-[35px] xl:py-[45px] 2xl:py-[65px]">
      {/* Old design start */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center">
          {/* Title */}
          <h2
            className="w-full xl:w-[calc(100%-700px)] 2xl:w-[calc(100%-950px)] 3xl:w-[calc(100%-1020px)] text-black text-title1 font-normal max-xl:mb-[20px] [&>span]:text-base2 [&>span]:font-bold"
            dangerouslySetInnerHTML={{ __html: scheme_title || "" }}
          />

          {/* Thumbnail Slider */}
          <div className="w-full xl:w-[700px] 2xl:w-[950px] 3xl:w-[1020px] flex items-center gap-[8px]">
            <button
              aria-label="Previous scheme"
              className="goldSchemeThumbPrev shrink-0 w-[26px] h-[26px] 2xl:w-[30px] 2xl:h-[30px] flex items-center justify-center rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.25)] cursor-pointer transition-opacity duration-300"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7L7 13" stroke="#08388E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              watchSlidesProgress
              slidesPerView="auto"
              modules={[Thumbs, Navigation]}
              navigation={{
                nextEl: ".goldSchemeThumbNext",
                prevEl: ".goldSchemeThumbPrev",
              }}
              className="w-full min-w-0 flex-1"
              breakpoints={{
                320: { spaceBetween: 5 },
                480: { spaceBetween: 8 },
                768: { spaceBetween: 10 },
                1024: { spaceBetween: 12 },
                1280: { spaceBetween: 15 },
              }}
            >
              {schemes?.map((type, index) => (
                <SwiperSlide key={index} className="!w-auto group">
                  <h4
                    className="w-fit h-[40px] 2xl:h-[50px] 3xl:h-[60px] text-[12px] 2xl:text-[16px] 3xl:text-[18px] px-[10px] font-bold flex items-center justify-center rounded-[100px] cursor-pointer transition-all duration-300 whitespace-nowrap
                                        bg-[#CFDFFE] text-black group-[.swiper-slide-thumb-active]:bg-base1 group-[.swiper-slide-thumb-active]:text-white"
                  >
                    {type}
                  </h4>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              aria-label="Next scheme"
              className="goldSchemeThumbNext shrink-0 w-[26px] h-[26px] 2xl:w-[30px] 2xl:h-[30px] flex items-center justify-center rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.25)] cursor-pointer transition-opacity duration-300"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1L7 7L1 13" stroke="#08388E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Slider */}
        <div className="w-full mt-4">
          <Swiper
            loop={true}
            spaceBetween={10}
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={(swiper) => thumbsSwiper?.slideTo(swiper.realIndex)}
            modules={[Navigation, Thumbs]}
            className="w-full"
          >
            {schemeDetails?.map((detailsArray, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-wrap m-[-8px] 3xl:m-[-12px] py-[15px]">
                  {detailsArray?.length > 0 ? (
                    detailsArray?.map((detail, detailIndex) => (
                      <div
                        className="w-[calc(100%/4)] lg:w-[calc(100%/5)] xl:w-[calc(100%/6)] p-[8px] 3xl:p-[12px]"
                        key={detail.id || detailIndex}
                      >
                        <div className="w-full h-full shadow-[0_0_10px_rgba(0,0,0,0.20)] text-center rounded-[15px] 3xl:rounded-[25px] overflow-hidden">
                          <div className="bg-[#CDE2FF] w-full min-h-[50px] 2xl:min-h-[55px] 3xl:min-h-[73px] flex items-center justify-center text-[12px] 2xl:text-[18px] 3xl:text-[24px] text-[#1F1B1B] font-medium">
                            {detail.title}
                          </div>
                          <div
                            className="text-[#08388E] text-[12px] 2xl:text-[18px] 3xl:text-[24px] font-bold 
                                                      h-[calc(100%-50px)] 2xl:h-[calc(100%-55px)] 3xl:h-[calc(100%-73px)] flex items-center justify-center min-h-[65px] xl:min-h-[80px] 3xl:min-h-[120px] p-[15px]"
                          >
                            {detail.value || "—"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full text-center">
                      <div className="text-[#1F1B1B] text-[18px] 2xl:text-[24px] 3xl:text-[30px] font-bold mt-[20px]">
                        No Data
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Old design end */}
      {/* <div className="container">
        <div
          className="w-full xl:w-[calc(100%-700px)] 2xl:w-[calc(100%-950px)] 3xl:w-[calc(100%-1020px)] text-black text-title1 font-normal mb-[40px] [&>span]:text-base2 [&>span]:font-bold"
          dangerouslySetInnerHTML={{ __html: scheme_title || "" }}
        />
        <div className="overflow-x-auto border-1 border-[#004494] rounded-[24px] pt-[0px] pb-0 px-0">
          <table className="w-full text-sm text-left border border-[#D9E1ED] max-xl:whitespace-nowrap">
            <thead>
              <tr className="text-[#004494] font-bold">
                <th className="border-b border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3 bg-white"></th>
                <th className="border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3">INDEL MINIMAL</th>
                <th className="border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3">INDEL POWER</th>
                <th className="border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3">INDEL FIXED</th>
                <th className="border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3">INDEL EXTRA</th>
                <th className="border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3">INDEL MAX</th>
                <th className="border-t border-l border-r border-t-[#fff] border-l-[#fff] border-r-[#fff] border-[#004494] px-4 py-3">INDEL HNI</th>
              </tr>
            </thead>
            <tbody className="text-[#002B5C]">
              <tr className="bg-white">
                <td className="border border-[#004494] border-l border-l-[#fff] px-4 py-3 font-medium bg-[#DCEBFF]">LTV</td>
                <td className="border border-[#004494] px-4 py-3">50%</td>
                <td className="border border-[#004494] px-4 py-3">75%</td>
                <td className="border border-[#004494] px-4 py-3">75%</td>
                <td className="border border-[#004494] px-4 py-3">75%</td>
                <td className="border border-[#004494] px-4 py-3">75%</td>
                <td className="border border-[#004494] border-r border-r-[#fff] px-4 py-3">75%</td>
              </tr>
              <tr className="bg-[#F8FAFC]">
                <td className="border border-[#004494] border-l border-l-[#fff] px-4 py-3 font-medium bg-[#DCEBFF]">Tenor</td>
                <td className="border border-[#004494] px-4 py-3">365 DAYS</td>
                <td className="border border-[#004494] px-4 py-3">365 DAYS</td>
                <td className="border border-[#004494] px-4 py-3">365 DAYS</td>
                <td className="border border-[#004494] px-4 py-3">365 DAYS</td>
                <td className="border border-[#004494] px-4 py-3">365 DAYS</td>
                <td className="border border-[#004494] border-r border-r-[#fff] px-4 py-3">365 DAYS</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-[#004494] border-l border-l-[#fff] px-4 py-3 font-medium bg-[#DCEBFF]">On Boarding Rate</td>
                <td className="border border-[#004494] px-4 py-3">30.00%</td>
                <td className="border border-[#004494] px-4 py-3">30.00%</td>
                <td className="border border-[#004494] px-4 py-3">30.00%</td>
                <td className="border border-[#004494] px-4 py-3">30.00%</td>
                <td className="border border-[#004494] px-4 py-3">30.00%</td>
                <td className="border border-[#004494] border-r border-r-[#fff] px-4 py-3">30.00%</td>
              </tr>
              <tr className="bg-[#F8FAFC]">
                <td className="border border-[#004494] border-l border-l-[#fff] px-4 py-3 font-medium bg-[#DCEBFF]">Rebate</td>
                <td className="border border-[#004494] border-l border-l-[#fff] px-4 py-3">21.25%</td>
                <td className="border border-[#004494] px-4 py-3">12.00%</td>
                <td className="border border-[#004494] px-4 py-3">11.00%</td>
                <td className="border border-[#004494] px-4 py-3">9.00%</td>
                <td className="border border-[#004494] px-4 py-3">6.00%</td>
                <td className="border border-[#004494] border-r border-r-[#fff] px-4 py-3">19.00%</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-[#004494] border-l border-l-[#fff] px-4 py-3 font-medium bg-[#DCEBFF]">Effective Interest</td>
                <td className="border border-[#004494] px-4 py-3">8.75%</td>
                <td className="border border-[#004494] px-4 py-3">18.00%</td>
                <td className="border border-[#004494] px-4 py-3">19.00%</td>
                <td className="border border-[#004494] px-4 py-3">21.00%</td>
                <td className="border border-[#004494] px-4 py-3">24.00%</td>
                <td className="border border-[#004494] border-r border-r-[#fff] px-4 py-3">11.00%</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-[#004494] border-b border-b-[#fff] border-l border-l-[#fff] px-4 py-5 font-medium bg-[#DCEBFF]">Processing Fee</td>
                <td className="border border-[#004494] border-b border-b-[#fff] px-4 py-5">Up to 50K Nil &gt; 50K to 1L - Rs. 25/- &gt; 1L - Rs. 50/-</td>
                <td className="border border-[#004494] border-b border-b-[#fff] px-4 py-5">Up to 50K Nil &gt; 50K to 1L - Rs. 25/- &gt; 1L - Rs. 50/-</td>
                <td className="border border-[#004494] border-b border-b-[#fff] px-4 py-5">Up to 50K Nil &gt; 50K to 1L - Rs. 25/- &gt; 1L - Rs. 50/-</td>
                <td className="border border-[#004494] border-b border-b-[#fff] px-4 py-5">Up to 50K Nil &gt; 50K to 1L - Rs. 25/- &gt; 1L - Rs. 50/-</td>
                <td className="border border-[#004494] border-b border-b-[#fff] px-4 py-5">Up to 50K Nil &gt; 50K to 1L - Rs. 25/- &gt; 1L - Rs. 50/-</td>
                <td className="border border-[#004494] border-b border-b-[#fff] border-r border-r-[#fff] px-4 py-5">Up to 50K Nil &gt; 50K to 1L - Rs. 25/- &gt; 1L - Rs. 50/- </td>
              </tr>
            </tbody>
          </table>
        </div>


      </div> */}
    </section>
  );
}
