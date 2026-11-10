"use client";
import Image from "next/image";
import parse from "html-react-parser";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const STEP_INTERVAL = 1200;
const HOLD_MS = 900;
const PAUSE_MS = 500;

export default function MobStepGoldLoan({ title, className, loanSteps }) {
  const prefersReducedMotion = useReducedMotion();

  const [activeUpTo, setActiveUpTo] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion || !loanSteps?.length) return;

    const total = loanSteps.length;
    let timer;

    function runCycle(current) {
      if (current < total - 1) {
        timer = setTimeout(() => {
          setActiveUpTo(current + 1);
          runCycle(current + 1);
        }, STEP_INTERVAL);
      } else {
        timer = setTimeout(() => {
          setActiveUpTo(-1); // all off
          timer = setTimeout(() => {
            setActiveUpTo(0); // restart from step 1
            runCycle(0);
          }, PAUSE_MS);
        }, HOLD_MS);
      }
    }

    setActiveUpTo(0);
    runCycle(0);

    return () => clearTimeout(timer);
  }, [loanSteps?.length, prefersReducedMotion]);

  return (
    <section className={`${className} w-full py-[20px_0] bg-[#FEFBF6]`}>
      <div className="container">
        <h2 className="text-title1 text-center mb-[35px] [&>span]:text-base2 [&>span]:font-bold">
          {title ? parse(title) : ""}
        </h2>
        <ol className="m-0 list-none p-0">
          {loanSteps?.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === loanSteps.length - 1;
            const isActive = prefersReducedMotion
              ? true
              : activeUpTo >= 0 && index <= activeUpTo;

            return (
              <li
                key={index}
                className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-x-5"
              >
                {/* ── LEFT COLUMN ── */}
                <div className="relative flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-1 text-[20px] font-semibold leading-none"
                    style={{
                      backgroundColor: isActive ? "#EE3824" : "#ffffff",
                      borderColor: isActive ? "#EE3824" : "#2F2F2F",
                      color: isActive ? "#ffffff" : "#EE3824",
                      transition:
                        "background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease",
                    }}
                    aria-label={`Step ${index + 1}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* ── TOP line segment: circle-bottom + 6px gap → above arrow ── */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute w-px bg-[#c8b560]"
                      style={{
                        top: "54px" /* circle bottom 48px + 6px gap */,
                        bottom:
                          "calc(50% - 4px)" /* stops just above arrow centre */,
                        left: "50%",
                        marginLeft: "-0.5px",
                        zIndex: 2,
                      }}
                    />
                  )}

                  {/* ── BOTTOM line segment: below arrow → 6px above next circle ── */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute w-px bg-[#c8b560]"
                      style={{
                        top: "calc(50% + 28px)" /* starts just below arrow         */,
                        bottom: "6px" /* 6px gap before the next circle  */,
                        left: "50%",
                        marginLeft: "-0.5px",
                        zIndex: 2,
                      }}
                    />
                  )}

                  {/* Arrow connector — absolutely fills space below circle, flex-centres chevron */}
                  {!isLast && (
                    <div
                      aria-hidden="true"
                      className="absolute flex items-center justify-center"
                      style={{
                        top: "20%",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 6,
                      }}
                    >
                      {/* White pill masks both line segments behind the arrow */}
                      <span
                        style={{
                          position: "absolute",
                          width: "20px",
                          height: "25px",
                          backgroundColor: "#ffffff",
                          zIndex: 5,
                        }}
                      />

                      {/* Smaller bouncing chevron — centred by parent flexbox */}
                      <motion.span
                        style={{
                          position: "relative",
                          zIndex: 10,
                          color: "#444444",
                          display: "flex",
                        }}
                        animate={
                          prefersReducedMotion ? { y: 0 } : { y: [-2, 2, -2] }
                        }
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <svg
                          viewBox="0 0 20 24"
                          width="14"
                          height="17"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                        >
                          <path d="M4 4 L10 10 L16 4" />
                          <path d="M4 12 L10 18 L16 12" />
                        </svg>
                      </motion.span>
                    </div>
                  )}
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div
                  className={`relative grid min-h-[120px] grid-cols-[minmax(0,1fr)_minmax(96px,42%)] gap-2 ${
                    isFirst ? "pt-0 pb-3.75" : "py-3.75"
                  } sm:grid-cols-[minmax(0,1fr)_minmax(150px,42%)] sm:gap-4 ${
                    !isLast ? "border-b border-black/10" : ""
                  }`}
                >
                  <div className="z-10">
                    <h3 className="mb-2 text-[18px] font-semibold leading-tight text-[#002362] sm:mb-3">
                      {item?.title ? parse(item.title) : ""}
                    </h3>
                    <p className="m-0 text-[14px] font-medium leading-snug text-[#526685]">
                      {item?.description}
                    </p>
                  </div>
                  <div className="relative h-[120px] w-full">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.icon_url}`}
                      alt={item?.title || "Gold loan step"}
                      fill
                      sizes="(max-width: 640px) 42vw, 260px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
