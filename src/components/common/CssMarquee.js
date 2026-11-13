"use client";
import { useEffect, useRef, useState } from "react";

export default function CssMarquee({ children, speed = 80, pauseOnHover = true, className = "" }) {
  const contentRef = useRef(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const width = contentRef.current?.offsetWidth;
    if (width) {
      setDuration(width / speed);
    }
  }, [speed, children]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`inline-flex w-max ${duration ? "animate-marquee" : ""} ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        <span ref={contentRef} className="inline-block pr-8">
          {children}
        </span>
        <span aria-hidden="true" className="inline-block pr-8">
          {children}
        </span>
      </div>
    </div>
  );
}
