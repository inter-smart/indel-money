"use client";

import useInView from "@/hooks/useInView";

/**
 * Defers mounting `children` until the wrapper scrolls near the viewport.
 * Renders an `animate-pulse` skeleton placeholder until then (same visual
 * convention as src/components/common/LatestUpdatesSlide.js's BlogCard/
 * EventCard dynamic() loading fallbacks).
 *
 * Pass `placeholderClassName` with responsive `min-h-[...]` utility classes
 * sized to roughly match the real section's height, to minimize layout
 * shift when the real content swaps in.
 */
export default function LazySection({ children, className = "", placeholderClassName = "min-h-[300px]", rootMargin }) {
  const [ref, isInView] = useInView(rootMargin ? { rootMargin } : undefined);

  return (
    <div ref={ref} className={className}>
      {isInView ? children : <div className={`w-full bg-gray-200 animate-pulse rounded-[15px] ${placeholderClassName}`} aria-hidden="true" />}
    </div>
  );
}
