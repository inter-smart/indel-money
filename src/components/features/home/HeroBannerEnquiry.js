"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import EnquiryForm from "../../common/EnquiryForm";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";

export default function HeroBannerEnquiry() {
  const [open, setOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);

const postEnquiryData = async (enquiryData) => {
  try {
    const payload = {
      name: enquiryData.yourName,
      phone: enquiryData.contactNumber,
      email: enquiryData.emailAddress,
      service_types: enquiryData.serviceType,
      enquiry_type: "general",
      enquiry_type_details: {},
    };

    const { data } = await api.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-enquiries/service-enquiries`,
      payload
    );

    

    if (data?.status === "success" || data?.success) {
      toast.success("Enquiry submitted successfully!");
    } else {
      toast.error(data?.message || "Failed to submit enquiry.");
    }
  } catch (error) {
    console.error("Enquiry Error:", error);
    toast.error("Something went wrong.");
  }
};

  const fetchServiceTypes = async () => {
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-enquiries/service-types`
      );
      if (data.success) {
        setServiceTypes(data.data);
      } else {
        toast.error("Failed to fetch service types!");
        return [];
      }
    } catch (error) {
      toast.error("service fetching failed!");
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const formattedServiceTypes = useMemo(() => {
    if (serviceTypes?.length > 0) {
      return serviceTypes?.map((type) => ({
        label: type.type_name,
        value: type.id,
      }));
    }
    return [];
  }, [serviceTypes]);

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0 }}
      animate={{
        x: "[calc(((100vw-var(--container-x))/2)+var(--container-padding))]",
        opacity: 1,
      }}
      className={`${
        open
          ? "right-[calc(((100vw-var(--container-x))/2)+var(--container-padding))]"
          : "right-0 translate-x-full"
      } w-full max-w-[calc(var(--container-x)-2rem)] sm:max-w-[276px] lg:max-w-[320px] 2xl:max-w-[420px] 3xl:max-w-[476px] h-auto absolute z-1 top-0 bottom-[calc(150px+var(--marquee-y))] sm:bottom-[var(--marquee-y)] my-auto flex items-center transition-transform duration-300`}
    >
      <div
        className={`${
          open ? "max-sm:rounded-tl-[10px]" : "rounded-tl-0"
        } w-full h-auto relative bg-[#c0dbff] rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px] rounded-tl-0 p-[30px_20px_20px] 4xs:p-[40px_30px_30px] sm:p-[10px_15px] lg:p-[20px_20px] 3xl:p-[20px_35px]`}
      >
        <h2 className="text-[20px] sm:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] 3xl:text-[24px] leading-[1.2] font-medium text-black mb-[15px] 4xs:mb-[30px] sm:mb-2 xl:mb-3 3xl:mb-4">
          Select the type of service you are looking for?
        </h2>

        <div
          className={`${
            open ? "max-sm:opacity-0" : "max-sm:opacity-100"
          } text-sm1 leading-none [writing-mode:vertical-lr] rotate-[180deg] w-[30px] h-[80px] 3xl:w-[36px] 3xl:h-[120px] bg-[#c0dbff] cursor-pointer absolute top-0 right-full flex justify-center items-center rounded-br-[10px] rounded-tr-[10px] transition-opacity duration-300 hover:opacity-95`}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Open"}
          <Image
            src={"/images/enquiry-delmt.svg"}
            alt="enquiry"
            width={40}
            height={38}
            className="absolute -z-1 left-0 top-[-12px] rotate-180"
          />
        </div>

        <div
          className="sm:hidden w-[12px] h-auto aspect-square cursor-pointer absolute top-[16px] right-[16px] block transition-opacity duration-300 hover:opacity-95"
          onClick={() => setOpen(!open)}
        >
          <Image
            src={"/images/icon-close.svg"}
            alt="close"
            width={12}
            height={12}
            className="aspect-square"
          />
        </div>
        <EnquiryForm
          handleSubmit={postEnquiryData}
          serviceTypes={formattedServiceTypes}
        />
      </div>
    </motion.div>
  );
}
