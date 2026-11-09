"use client";

import { useEffect, useRef, useState } from "react";

// Generous rootMargin so sections start mounting slightly before they
// scroll into view, reducing perceived pop-in on scroll.
const DEFAULT_ROOT_MARGIN = "300px 0px 300px 0px";

/**
 * Minimal IntersectionObserver-based "is this element near the viewport"
 * hook. SSR-safe: `isInView` starts false and only flips inside an effect,
 * which never runs on the server, so server and first-client-render output
 * always match (no hydration mismatch).
 *
 * Trigger-once by default: once the element has entered view, the observer
 * disconnects and the element is never reported as "out of view" again.
 * This matters for sections that fire one-time data fetches on mount.
 */
export default function useInView({ rootMargin = DEFAULT_ROOT_MARGIN, threshold = 0, triggerOnce = true } = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isInView) return;

    if (typeof IntersectionObserver === "undefined") {
      // Extremely old browser without IntersectionObserver support:
      // fail open rather than permanently hiding content.
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, isInView]);

  return [ref, isInView];
}
