"use client";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../../lib/api/axios";
import parse from "html-react-parser";

export default function FAQ({ pageContents, type = "home", faqs: initialFaqs }) {
  const [openIndex, setOpenIndex] = useState(null);
  // `initialFaqs` is the same HomeFaq query already returned by /web/home, so skip the extra round trip + loading flash.
  const hasInitialFaqs = Array.isArray(initialFaqs) && initialFaqs.length > 0;
  const [faqs, setFaqs] = useState(hasInitialFaqs ? initialFaqs : []);
  const [loading, setLoading] = useState(!hasInitialFaqs);

  // Fetch FAQs based on type
  useEffect(() => {
    if (hasInitialFaqs) return;
    const fetchFaqs = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/web/faq?type=${type}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.data;

        if (result?.status === "success") {
          setFaqs(result.faqs || []);
        } else {
          throw new Error("Failed to fetch FAQs");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [type]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Loading state
  if (loading) {
    return (
      <section className="w-full 2xl:pt-[100px] 2xl:pb-[100px] md:pt-[60px] md:pb-[60px] pt-[40px] pb-[40px]">
        <div className="container">
          <div className="flex flex-wrap">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-[320px] xl:w-[340px] 2xl:w-[520px] 3xl:w-[550px] max-lg:mb-5"
            >
              <div className="w-full overflow-hidden rounded-[35px]">
                <Image
                  src={
                    pageContents?.faq_section_image
                      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${pageContents?.faq_section_image}`
                      : "/images/faqImg.webp"
                  }
                  alt="aboutImg"
                  width={550}
                  height={610}
                  className="w-full h-full object-cover duration-450 transition-all group hover:scale-[1.1] "
                />
              </div>
            </motion.div>
            <div className="w-full lg:w-[calc(100%-320px)] xl:w-[calc(100%-340px)] 2xl:w-[calc(100%-520px)] 3xl:w-[calc(100%-550px)] lg:pl-[30px] xl:pl-[50px] 3xl:pl-[70px]">
              <div className="contentBx w-full">
                <h3 className="font-bold text-black mb-1 xl:text-[20px] lg:text-[18px] text-[16px] uppercase">
                  {pageContents?.faq_section_super_title}
                </h3>
                <div className="flex items-center justify-between mb-2 pb-[30px] border-b-1 border-[rgba(0,0,0,0.68)]">
                  <div className="text-black text-title1 [&>span]:text-base2 [&>span]:font-bold">
                    {parse(pageContents?.faq_section_title)}
                  </div>
                </div>
                <div className="text-center py-8">
                  <div className="text-gray-600">Loading FAQs...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full 2xl:pt-[100px] 2xl:pb-[100px] md:pt-[60px] md:pb-[60px] pt-[40px] pb-[40px]">
      <div className="container">
        <div className="flex flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-[320px] xl:w-[340px] 2xl:w-[520px] 3xl:w-[550px] max-lg:mb-5"
          >
            <div className="w-full overflow-hidden rounded-[35px]">
              <Image
                src={
                  pageContents?.faq_section_image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${pageContents?.faq_section_image}`
                    : "/images/faqImg.webp"
                }
                alt="aboutImg"
                width={550}
                height={610}
                className="w-full h-full object-cover duration-450 transition-all group hover:scale-[1.1] "
              />
            </div>
          </motion.div>
          <div className="w-full lg:w-[calc(100%-320px)] xl:w-[calc(100%-340px)] 2xl:w-[calc(100%-520px)] 3xl:w-[calc(100%-550px)] lg:pl-[30px] xl:pl-[50px] 3xl:pl-[70px]">
            <div className="contentBx w-full">
              <div className="font-bold text-black mb-1 xl:text-[20px] lg:text-[18px] text-[16px] uppercase">
                {pageContents?.faq_section_super_title}
              </div>
              <div className="flex items-center justify-between mb-2 pb-[30px] border-b-1 border-[rgba(0,0,0,0.68)]">
                <div className="text-black text-title1">{pageContents?.faq_section_title}</div>
              </div>

              {faqs?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">No FAQs available for this section.</div>
                </div>
              ) : (
                faqs?.map((faq, index) => (
                  <div
                    key={faq.id || index}
                    className="border-b last:border-none pt-[10px] pb-[5px] 2xl:pb-[10px] 2xl:pt-[15px] 3xl:pb-[15px] 3xl:pt-[20px]"
                  >
                    <button
                      className="flex justify-between w-full items-center font-medium text-left text-black 2xl:text-[1.25rem] xl:text[1rem] text-[0.8rem] cursor-pointer hover:no-underline  transition-all duration-300 pb-[10px]"
                      onClick={() => toggleAccordion(index)}
                    >
                      <div className="2xl:w-[calc(100% -33px )] w-[calc(100%-25px)] pr-2">{faq.question}</div>
                      {openIndex === index ? (
                        <Minus
                          className="text-white bg-base2 rounded-full  2xl:w-[33px] 2xl:h-[33px] w-[25px] h-[25px] p-[3px] transition-all duration-300"
                          size={17}
                        />
                      ) : (
                        <Plus
                          className="text-white bg-base2 rounded-full  2xl:w-[33px]  2xl:h-[33px] w-[25px] h-[25px]   p-[3px] transition-all duration-300"
                          size={17}
                        />
                      )}
                    </button>
                    {openIndex === index && <div className="text-sm1 pb-[10px] transition-all duration-300">{faq.answer}</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { Plus, Minus } from "lucide-react";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import api from "../../../lib/api/axios";

// export default function FAQ({ faqs, pageContents, type }) {
//   const [openIndex, setOpenIndex] = useState(null);

//   useEffect(() => {
//     const fetchFaqs = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await api.get(`/web/faqs?type=${type}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();

//         if (result.status === "success") {
//           setFaqs(result.data.faqs || []);
//         } else {
//           throw new Error("Failed to fetch FAQs");
//         }
//       } catch (err) {
//         console.error("Error fetching FAQs:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFaqs();
//   }, [type]);

//   const toggleAccordion = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (
//     <section className="w-full 2xl:pt-[100px] 2xl:pb-[100px] md:pt-[60px] md:pb-[60px] pt-[40px] pb-[40px]">
//       <div className="container">
//         <div className="flex flex-wrap">
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="w-full lg:w-[320px] xl:w-[340px] 2xl:w-[520px] 3xl:w-[550px] max-lg:mb-5"
//           >
//             <div className="w-full overflow-hidden rounded-[35px]">
//               <Image
//                 // src={"/images/faqImg.webp"}
//                 src={
//                   pageContents?.faq_section_image
//                     ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${pageContents?.faq_section_image}`
//                     : "/images/faqImg.webp"
//                 }
//                 alt="aboutImg"
//                 width={550}
//                 height={610}
//                 className="w-full h-full object-cover duration-450 transition-all group hover:scale-[1.1] "
//               />
//             </div>
//           </motion.div>
//           <div className="w-full lg:w-[calc(100%-320px)] xl:w-[calc(100%-340px)] 2xl:w-[calc(100%-520px)] 3xl:w-[calc(100%-550px)] lg:pl-[30px] xl:pl-[50px] 3xl:pl-[70px]">
//             <div className="contentBx w-full">
//               <div className="font-bold text-black mb-1 xl:text-[20px] lg:text-[18px] text-[16px] uppercase">
//                 {pageContents?.faq_section_super_title}
//               </div>
//               <div className="flex items-center justify-between mb-2 pb-[30px] border-b-1 border-[rgba(0,0,0,0.68)]">
//                 <div className="text-black text-title1">{pageContents?.faq_section_title}</div>
//                 {/* <Link
//                   href="/"
//                   className="btn btn-base2 max-w-[100px] lg:max-w-[90px] xl:max-w-[100px] 2xl:max-w-[120px] 3xl:max-w-[140px]"
//                 >
//                   <span>VIEW ALL</span>
//                 </Link> */}
//               </div>
//               {faqs?.map((faq, index) => (
//                 <div
//                   key={index}
//                   className="border-b last:border-none pt-[10px] pb-[5px] 2xl:pb-[10px] 2xl:pt-[15px] 3xl:pb-[15px] 3xl:pt-[20px]"
//                 >
//                   <button
//                     className="flex justify-between w-full items-center font-medium text-left text-black 2xl:text-[1.25rem] xl:text[1rem] text-[0.8rem] cursor-pointer hover:no-underline  transition-all duration-300 pb-[10px]"
//                     onClick={() => toggleAccordion(index)}
//                   >
//                     <div className="2xl:w-[calc(100% -33px )] w-[calc(100%-25px)] pr-2">{faq.question}</div>
//                     {openIndex === index ? (
//                       <Minus
//                         className="text-white bg-base2 rounded-full  2xl:w-[33px] 2xl:h-[33px] w-[25px] h-[25px] p-[3px] transition-all duration-300"
//                         size={17}
//                       />
//                     ) : (
//                       <Plus
//                         className="text-white bg-base2 rounded-full  2xl:w-[33px]  2xl:h-[33px] w-[25px] h-[25px]   p-[3px] transition-all duration-300"
//                         size={17}
//                       />
//                     )}
//                   </button>
//                   {openIndex === index && <div className="text-sm1 pb-[10px] transition-all duration-300">{faq.answer}</div>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
