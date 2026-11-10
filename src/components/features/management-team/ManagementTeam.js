"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/custom-alert-dialog";
// import { Button } from "@/components/ui/button";
import Image from "next/image";
import "./Management.css";
import "./management.config.js";
import { renderHtml } from "@/lib/utils/htmlParser";

export default function ManagementTeam({ pageContent, teams }) {
  const slides = [
    {
      id: "0",
      image: "/images/team01.png",
      alt: "team-1",
      title: "Umesh Mohanan",
      post: "Executive Director & CEO",
      desciption:
        "An investment professional with more than 2 decades of rich experience in Managing investment verticals with a proven track record of heading a Middle Eastern multi national multi billion conglomerate at its executive level,spearheading its complete global operations Diversified into portfolios such as Banking investments, infrastructure construction,Oil and Gas, Power stations, Defence supplies, Manufacturing , Trading of minerals, bullion and other commodities across the global. Currently he serves Indel Money as its ED & CEO, at Indel Money his corporate inheritance of skills from the multinational business background is envisaged to grow the business into multifolds.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at An investment professional with more than 2 decades of rich experience in Managing investment verticals with a proven track record of heading a Middle Eastern multi national multi billion conglomerate at its executive level,spearheading its complete global operations Diversified into portfolios such as Banking investments, infrastructure construction,Oil and Gas, Power stations, Defence supplies, Manufacturing , Trading of minerals, bullion and other commodities across the global. Currently he serves Indel Money as its ED & CEO, at Indel Money his corporate inheritance of skills from the multinational business background is envisaged to grow the business into multifolds.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at An investment professional with more than 2 decades of rich experience in Managing investment verticals with a proven track record of heading a Middle Eastern multi national multi billion conglomerate at its executive level,spearheading its complete global operations Diversified into portfolios such as Banking investments, infrastructure construction,Oil and Gas, Power stations, Defence supplies, Manufacturing , Trading of minerals, bullion and other commodities across the global. Currently he serves Indel Money as its ED & CEO, at Indel Money his corporate inheritance of skills from the multinational business background is envisaged to grow the business into multifolds.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at ",
    },
    {
      href: "/",
      image: "/images/team02.png",
      alt: "team-1",
      title: "Jijith Raj Thekkayil",
      post: "Business Head",
    },
    {
      href: "/",
      image: "/images/team03.png",
      alt: "team-1",
      title: "Sudheesh PR",
      post: "Head – Strategy, ",
    },
    {
      href: "/",
      image: "/images/team04.png",
      alt: "team-1",
      title: "A Sreekumar",
      post: "Head Credit & Risk",
    },
    {
      href: "/",
      image: "/images/team05.png",
      alt: "team-1",
      title: "Venugopalan MV",
      post: "Head Internal Audit",
    },
    {
      href: "/",
      image: "/images/team06.png",
      alt: "team-1",
      title: "K.N.C NAIR",
      post: "Chief Information Officer",
    },
    {
      href: "/",
      image: "/images/team07.png",
      alt: "team-1",
      title: "Chandrasekharan Nair Saji",
      post: "Chief Compliance Officer",
    },
    {
      href: "/",
      image: "/images/team08.png",
      alt: "team-1",
      title: "Narayanan Pisharath",
      post: "Head – Finance & Accounts",
    },
    {
      href: "/",
      image: "/images/team09.png",
      alt: "team-1",
      title: "Hanna P Nazir",
      post: "Company Secretary",
    },
    {
      href: "/",
      image: "/images/team010.png",
      alt: "team-1",
      title: "Prasad Chemben",
      post: "Business Head TPBV",
    },
  ];

  return (
    <section className="relative w-full py-[30px] lg:py-[40px] xl:py-[70px]">
      <div className="absolute bottom-[12%] left-0 w-full h-[75%] md:h-[66%] xl:h-[60%] bg-gradient-to-r from-[rgba(243,0,0,0)] to-[rgba(235,2,8,0.10)] z-0 hidden sm:block"></div>
      <div className="container flex flex-wrap">
        <div className="flex flex-wrap mb-[60px]">
          <div className="w-full md:w-[45%] 2xl:w-[40%]">
            <h2 className="text-title1 mb-[15px] 2xl:mb-[20px] [&>span]:text-base2 [&>span]:font-bold">
              {pageContent?.title ? renderHtml(pageContent?.title) : "Management Team"}
            </h2>
          </div>
          <div className="w-full md:w-[55%] 2xl:w-[60%] md:pl-[30px] [&>p]:text-sm1">
            {pageContent?.description ? renderHtml(pageContent?.description) : ""}
          </div>
        </div>
        <div className="flex flex-wrap -mx-[12px] xl:-mx-[15px] 2xl:-mx-[17px] -my-[20px] xl:-my-[25px] 2xl:-my-[30px]">
          {teams?.map((item, index) => (
            <div
              key={item?.id}
              className="w-1/2 md:w-1/3 xl:w-1/4 px-[10px] sm:px-[12px] xl:px-[15px] 2xl:px-[17px] py-[10px] sm:py-[20px] xl:py-[25px] 2xl:py-[30px]"
            >
              <TeamBox item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamBox({ item }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="w-full h-full sm:h-fit cursor-pointer sm:px-0 px-[10px] sm:py-0 py-[20px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.15)] sm:bg-none sm:shadow-none overflow-hidden sm:rounded-0 rounded-[10px]">
          <div className="relative sm:m-0 m-auto group w-[100px] sm:w-full h-[100px] sm:h-full xl:rounded-[20px] md:rounded-[18px] sm:rounded-[15px] rounded-full overflow-hidden aspect-100/100 sm:aspect-380/455 sm:p-0 p-[15px] pb-0">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#EFEFEF_0%,#DBEEF9_100%)] transition-opacity duration-500 group-hover:opacity-0 hidden sm:block"></div>
            <div className="absolute inset-0 sm:bg-[linear-gradient(180deg,#EE3824_0%,#17479E_100%)] bg-[linear-gradient(180deg,#17479E_0%,#EE3824_100%)] opacity-100 sm:opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            <Image
              src={item?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/images/team010.png"}
              alt={item.name}
              width={380}
              height={455}
              className="relative w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.05]"
            />
          </div>
          <div className="mt-[20px]">
            <div className="text-footer-1 mb-1.25 sm:mb-[10px] text-[14px] lg:text-[16px] 2xl:text-[18px] 3xl:text-[22px] leading-none sm:font-medium font-bold sm:text-left text-center">{item.name}</div>
            <div className="text-sm-1 text-[13px] sm:text-[16px] sm:text-left text-center">{item.title}</div>
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-none w-full">
        <AlertDialogHeader>
          <AlertDialogDescription className="relative w-fit m-auto">
            <AlertDialogCancel className="flex items-center absolute z-99 top-[10px] right-[22px] lg:right-[10%] p-2 rounded-full hover:bg-gray-200 transition-colors focus-visible:outline-none">
              <div className="text-[#313131] text-center text-[18px] not-italic font-normal leading-[30px] hidden lg:block">Close</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </AlertDialogCancel>
            <TeamModal item={item} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TeamModal({ item }) {
  return (
    <div className="container">
      <div className="relative z-[1] w-full flex flex-wrap bg-white rounded-[10px] sm:rounded-[36px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] sm:px-[20px] xl:px-[35px] 2xl:px-[55px] 3xl:px-[75px] sm:py-[25px]  pb-[60px] xl:py-[40px] 2xl:py-[60px] 3xl:py-[80px]  p-0">
        <div className="group w-full sm:w-[150px] lg:w-[250px] xl:w-[270px] 2xl:w-[385px] flex sm:justify-center items-end sm:items-center bg-gradient-to-t from-[rgba(238,56,36,0.40)] via-[rgba(23,71,158,0.25)] to-[rgba(23,71,158,0.10)] sm:bg-gradient-to-b sm:from-[#EFEFEF] sm:to-[#AFDBF6] rounded-[10px] sm:rounded-[20px] p-[15px] pb-0 sm:p-0 overflow-hidden">
          <div className="group h-auto sm:w-full w-[135px] flex justify-center items-center">
            <Image
              src={item?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/images/team010.png"}
              alt={item.title}
              layout="responsive"
              width={100}
              height={100}
              className="rounded-lg object-cover transition-transform duration-600 group-hover:scale-[1.05]"
            />
          </div>
          <div className="w-[calc(100%-105px)] xs:w-[calc(100%-135px)] pl-[15px] pb-[15px] block sm:hidden">
            <h2 className="text-[18px] xl:text-[22px] 2xl:text-[28px] 3xl:text-[35px] font-bold flex items-center text-#000">{item.name}</h2>
            <p className="text-gray-600 mt-[5px]">{item.title}</p>
          </div>
        </div>
        <div className="w-full sm:w-[calc(100%-150px)] lg:w-[calc(100%-250px)] xl:w-[calc(100%-270px)] 2xl:w-[calc(100%-385px)] pt-[20px] sm:pt-[0] sm:pl-[20px] lg:pl-[30px] 3xl:pl-[50px]">
          <div className="relative max-w-[450px] bg-gradient-to-r from-[rgba(238,56,36,0.20)] via-[rgba(58,69,138,0.10)] to-[rgba(23,71,158,0.00)] sm:bg-gradient-to-r sm:from-[rgba(238,56,36,0.20)] sm:via-[rgba(58,69,138,0.10)] sm:to-[rgba(23,71,158,0.00)] px-[25px] py-1 hidden sm:block">
            <div className="absolute left-0 bottom-0 w-[7px] h-full rounded-[10px] bg-gradient-to-b from-[#EE3824] to-base1"></div>
            <h2 className="text-[18px] xl:text-[22px] 2xl:text-[28px] 3xl:text-[35px] font-bold flex items-center text-#000">{item.name}</h2>
            <p className="text-gray-600 mt-[5px]">{item.title}</p>
          </div>

          <div
            className="w-full hidden lg:block h-[200px] xl:h-[220px] 2xl:h-[335px] scrollbar-custom overflow-y-auto mt-[20px] 2xl:mt-[35px] [&::-webkit-scrollbar]:w-[4px]
                        [&::-webkit-scrollbar-thumb]:bg-[#EE3824]
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-track]:bg-[rgba(23,71,158,0.60)]
                        [&::-webkit-scrollbar-track]:rounded-full
                        scroll-smooth"
          >
            <div className="text-footer-1 font-normal leading-[150%] text-[#323232] pr-[20px]">{item?.description}</div>
          </div>
        </div>
        <div
          className="w-full lg:hidden h-[340px] sm:h-[220px] overflow-y-auto mt-[20px] sm:p-0 mr-[20px] pt-0 p-[15px]
                    [&::-webkit-scrollbar]:w-[6px]
                    [&::-webkit-scrollbar-thumb]:bg-[#EE3824]
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-[rgba(23,71,158,0.60)]
                    [&::-webkit-scrollbar-track]:rounded-full
                    scroll-smooth"
        >
          <div className="text-footer-1 font-normal leading-[150%] text-[#323232] pr-[20px]">{item?.description}</div>
        </div>
      </div>
    </div>
  );
}
