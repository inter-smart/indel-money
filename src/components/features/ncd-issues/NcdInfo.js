"use client";

import { renderHtml } from "@/lib/utils/htmlParser";
import Image from "next/image";
import ContactForm from "./NcdForm";

export default function NcdInfo({ content }) {
  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Mobile Layout - Stacked vertically */}
        <div className="flex flex-col lg:hidden w-full">
          {/* Contact Form - Mobile */}
          <ContactForm isMobile={true} />

          {/* Section 1 - Top Banner */}
          <div className="flex-shrink-0">
            <Image
              src={
                content?.banner_image
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.banner_image}`
                  : "/images/employeeTestimonialsVideo-2.jpg"
              }
              alt={content?.banner_image_alt}
              width={640}
              height={300}
              className="w-full max-h-auto object-cover"
            />
          </div>

          {/* Section 2 - Scrollable Description */}
          <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[350px] bg-white overflow-hidden">
            <div className="h-full bg-white bg-opacity-90 p-3 sm:p-4 md:p-6 rounded-lg overflow-y-auto">
              <p className="text-gray-800 text-xs sm:text-sm leading-relaxed py-2 sm:py-4">
                {renderHtml(content?.content)}
              </p>
            </div>
          </div>

          {/* Section 3 - Bottom Banner */}
          <div className="min-h-[150px] sm:min-h-[250px] md:min-h-[300px] bg-black bg-opacity-90 relative overflow-hidden">
            <Image
              src={
                content?.second_banner_image
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.second_banner_image}`
                  : "/images/employeeTestimonialsVideo-2.jpg"
              }
              alt={content?.second_banner_image_alt}
              width={640}
              height={300}
              className="w-full max-h-auto object-cover"
            />
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:flex lg:flex-row w-full min-h-screen">
          {/* Left Side - 3 Sections */}
          <div className="flex-1 flex lg:w-[60%] flex-col">
            {/* Section 1 - Top Banner */}
            <div className="flex-1 h-full bg-gradient-to-br">
              <Image
                src={
                  content?.banner_image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.banner_image}`
                    : "/images/employeeTestimonialsVideo-2.jpg"
                }
                alt={content?.banner_image_alt}
                width={640}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Section 2 - Scrollable Description */}
            <div className="flex-1 min-h-[375px] lg:max-h-[300px] bg-white overflow-hidden">
              <div className="h-full bg-white bg-opacity-90 p-6 rounded-lg overflow-y-auto">
                <p className="text-gray-800 text-sm leading-relaxed py-4">
                  {renderHtml(content?.content)}
                </p>
              </div>
            </div>

            {/* Section 3 - Bottom Banner */}
            <div className="flex-1 h-auto bg-black bg-opacity-90 relative overflow-hidden">
              <Image
                src={
                  content?.second_banner_image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${content?.second_banner_image}`
                    : "/images/employeeTestimonialsVideo-2.jpg"
                }
                alt={content?.second_banner_image_alt}
                width={640}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Side - Contact Form Desktop */}
          <ContactForm isMobile={false} />
        </div>
      </div>
    </>
  );
}
