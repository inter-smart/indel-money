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

const GROUP_SIZE = 3;

function MediaTile({ item }) {
  const isVideo = item.type === "video";
  const src = mediaUrl(isVideo ? item.thumbnail : item.image);
  return (
    <a
      className="celebration-tile group relative z-0 block h-full w-full cursor-pointer overflow-hidden rounded-[8px] bg-[#e9eef7] sm:rounded-[15px]"
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
}

// One LightGallery instance over the whole grid. `galleryKey` re-initialises it after a page / tab change.
// Tiles are grouped in 3s (one big + two small, alternating sides) to match the gallery page's masonry layout;
// they all stay descendants of this single LightGallery so the lightbox still swipes next/prev across every tile.
export default function CelebrationMediaGrid({ items, galleryKey }) {
  const groups = Array.from({ length: Math.ceil(items.length / GROUP_SIZE) }, (_, i) => items.slice(i * GROUP_SIZE, i * GROUP_SIZE + GROUP_SIZE));

  return (
    <LightGallery
      key={galleryKey}
      selector=".celebration-tile"
      plugins={[lgThumbnail, lgZoom, lgVideo]}
      speed={300}
      download={false}
      elementClassNames="mx-auto flex flex-wrap"
    >
      {groups.map((group, index) => {
        const reversed = index % 2 === 1;
        return (
          <div
            key={`media-group-${index}`}
            className={`${reversed ? "flex-col-reverse" : "flex-col"} w-full lg:w-1/2 mb-2 h-[400px] md:h-[468px] xl:h-[545px] 2xl:h-[640px] 3xl:h-[815px] flex flex-wrap`}
          >
            <div className="flex flex-wrap w-full p-2 h-[40%] md:h-[50%] xl:h-[42%]">
              {group.slice(0, 1).map((item) => (
                <div key={item.id} className="w-full mb-4 h-full">
                  <MediaTile item={item} />
                </div>
              ))}
            </div>
            <div className="flex flex-wrap w-full h-[60%] md:h-[50%] xl:h-[58%]">
              {group.slice(1, 3).map((item) => (
                <div key={item.id} className="w-1/2 p-2 h-full">
                  <MediaTile item={item} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </LightGallery>
  );
}
