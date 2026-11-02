"use client";

import { useEffect, useState } from "react";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

const INTERACTION_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];

// Loads GTM/GA once the page has finished loading and gone quiet (or the
// visitor first interacts), keeping ~450 KiB of third-party JS off the critical
// rendering path. Events pushed to window.dataLayer before then are queued.
export default function DeferredAnalytics({ gtmId, gaId }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timer;
    const start = () => {
      cleanup();
      setReady(true);
    };
    const onLoad = () => {
      timer = setTimeout(start, 3000);
    };
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, start));
    };

    INTERACTION_EVENTS.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return cleanup;
  }, []);

  if (!ready) return null;
  return (
    <>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}
