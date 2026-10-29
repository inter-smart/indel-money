"use client";
import Image from "next/image";
import Link from "next/link";
import LifeIndelSlider from "../../features/home/LifeIndelSlider";
import { motion } from "framer-motion";


function ImageBox({ item, className }) {
  return (
    <div className={`${className} w-full p-1 sm:p-2`}>
      <div className={`${className} group w-full h-full xl:rounded-[35px] md:rounded-[28px] rounded-[20px] overflow-hidden`}>
        <Image
          src={item ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item}` : "/images/life-1.jpg"}
          width={276}
          height={276}
          alt={item?.alt ? item?.alt : ""}
          className="w-full h-full object-cover transition-transform duration-300  group-hover:scale-105"
        />
      </div>
    </div>
  );
}

export default function LifeAtIndel({ pageContent, lifeAtIndel, image1, image2, image3 }) {
  const images = [image1, image2, image3];
  return (
    <section className="w-full pt-[20px] pb-[20px] md:pt-[70px] md:pb-[70px] sm:pt-[30px] sm:pb-[30px] lg:pb-[60px] overflow-hidden">
      <div className="container">
        <div className="flex flex-wrap items-center lg:-mx-[15px] xl:-mx-[20px] 3xl:-mx-[35px]">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full mb-[15px] lg:mb-0 lg:w-1/2 lg:px-[15px] xl:px-[20px] 3xl:px-[35px]"
          >
            <div className="flex flex-wrap">
              <div className="w-4/10">
                {images.slice(0, 2)?.map((item, index) => (
                  <ImageBox key={index} item={item} className="h-1/2" />
                ))}
              </div>
              <div className="w-6/10">
                {images.slice(2, 3)?.map((item, index) => (
                  <ImageBox key={index} item={item} className="h-full" />
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 lg:px-[15px] xl:px-[20px] 3xl:px-[35px]"
          >
            {pageContent?.life_section_title && (
              <h2
                className="text-title1 [&>span]:text-base2 [&>span]:font-bold"
                dangerouslySetInnerHTML={{ __html: pageContent.life_section_title }}
              />
            )}

            <div className="text-sm1 mb-[10px] lg:mb-[15px] 2xl:mb-[20px]">
              {pageContent?.life_section_description}
            </div>
            <div className="mb-[10px] lg:mb-[15px] 2xl:mb-[20px]">
              {/* <LifeIndelSlider lifeAtIndel={lifeAtIndel} /> */}
            </div>
            <div className="flex flex-wrap gap-[10px] lg:gap-[15px] 3xl:gap-[20px]">
              <div>
                <Link
                  // href="/"
                  href={pageContent?.life_section_button_link_1 || "#"}
                  className="btn btn-base2 min-w-[200px] lg:min-w-[180px] xl:min-w-[220px] 3xl:min-w-[280px]"
                >
                  {/* TAKE ME TO CAREERS PAGE */}
                  {pageContent?.life_section_button_name_1}
                </Link>
              </div>
              <div>
                <Link
                  // href="/"
                  href={pageContent?.life_section_button_link_2 || "#"}
                  className="btn btn-base2 min-w-[120px] lg:min-w-[120px] xl:min-w-[140px] 3xl:min-w-[180px]"
                >
                  {/* VISIT GALLERY */}
                  {pageContent?.life_section_button_name_2}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
