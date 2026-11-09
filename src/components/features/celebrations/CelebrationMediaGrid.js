"use client";
import Image from "next/image";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import { mediaUrl } from "./celebrationConstants";

const isYouTube = (url) => /youtube\.com|youtu\.be/i.test(url || "");

// Lightbox attributes for one tile, so next/prev swipes across the photos and videos on the page.
function lightboxProps(item) {
  if (item.type !== "video") {
    return { href: mediaUrl(item.image), "data-src": mediaUrl(item.image) };
  }

  const poster = mediaUrl(item.thumbnail);
  if (isYouTube(item.video)) {
    return { href: item.video, "data-src": item.video, "data-poster": poster, "data-thumb": poster };
  }
  // No href / data-src here: lightGallery only treats a slide as a video from `data-video` when it has no
  // src of its own (an mp4 src that is not YouTube/Vimeo/Wistia would be loaded as an image and never play).
  return {
    "data-lg-size": "1280-720",
    "data-video": JSON.stringify({
      source: [{ src: mediaUrl(item.video), type: "video/mp4" }],
      attributes: { preload: false, controls: true },
    }),
    "data-poster": poster,
    "data-thumb": poster,
  };
}

// One LightGallery instance over the whole grid. `galleryKey` re-initialises it after a page / tab change.
export default function CelebrationMediaGrid({ items, galleryKey }) {
  return (
    <LightGallery
      key={galleryKey}
      selector=".celebration-tile"
      plugins={[lgThumbnail, lgZoom, lgVideo]}
      speed={300}
      download={false}
      elementClassNames="grid grid-cols-2 gap-[8px] sm:gap-[15px] lg:grid-cols-3 2xl:gap-[20px]"
    >
      {items.map((item) => {
        const isVideo = item.type === "video";
        const src = mediaUrl(isVideo ? item.thumbnail : item.image);
        return (
          <a
            key={item.id}
            className="celebration-tile group relative z-0 block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-[8px] bg-[#e9eef7] sm:rounded-[15px]"
            aria-label={isVideo ? `Play video: ${item.alt}` : `View photo: ${item.alt}`}
            {...lightboxProps(item)}
          >
            <Image
              src={src}
              alt={item.alt || "Celebration"}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {isVideo && (
              <div className="pointer-events-none absolute inset-0 z-10 m-auto aspect-square w-[30px] lg:w-[35px] 2xl:w-[48px]" role="img" aria-label="Video">
                <Image src="/images/icon-play.svg" alt="" fill sizes="48px" />
              </div>
            )}
          </a>
        );
      })}
    </LightGallery>
  );
}
