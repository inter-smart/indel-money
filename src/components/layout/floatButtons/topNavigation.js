'use client'

import { memo, useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

// A 1px sentinel at the top of the document is watched with an
// IntersectionObserver: no scroll listener, and state only changes
// (so React only re-renders) when the page enters or leaves the top.
function TopNavigation() {
    const sentinelRef = useRef(null)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(
            ([entry]) => setIsScrolled(!entry.isIntersecting)
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <>
            <div
              ref={sentinelRef}
              aria-hidden="true"
              className="absolute top-0 left-0 h-px w-px pointer-events-none"
            />
            <button
              type="button"
              aria-label="Scroll to top"
              tabIndex={isScrolled ? 0 : -1}
              onClick={scrollToTop}
              className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 sm:right-4 z-50 p-1.5 sm:p-2 rounded-full bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-[opacity,background-color] duration-300 ${
                isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <ArrowUp className="size-5 sm:size-6" />
            </button>
        </>
    )
}

export default memo(TopNavigation)
