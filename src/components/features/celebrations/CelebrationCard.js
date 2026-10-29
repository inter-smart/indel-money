import Image from "next/image";
import Link from "next/link";
import { mediaUrl } from "./celebrationConstants";

// Image card used for both categories (page 1) and subcategories (page 2).
// `badges` are small chips under the title, e.g. ["5 Albums"] or ["42 Photos", "6 Videos"].
export default function CelebrationCard({ href, title, image, alt, badges = [], priority = false }) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#e9eef7]"
      aria-label={title}
    >
      <Image
        src={mediaUrl(image)}
        alt={alt || title}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105 lg:grayscale lg:group-hover:grayscale-0"
      />
      <div className="absolute inset-x-0 bottom-0 z-[1] flex h-[70%] items-end bg-gradient-to-b from-transparent via-[#80000080] to-[#0047AB] px-[20px] py-[25px] 2xl:px-[25px] 2xl:py-[35px] lg:translate-y-1/3 lg:opacity-0 lg:transition-all lg:duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
        <div className="w-full">
          <h2 className="relative mb-[8px] pb-[8px] text-[17px] font-semibold uppercase leading-[1.1] text-white after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-[23%] after:bg-white after:content-[''] 2xl:mb-[12px] 2xl:pb-[12px] 2xl:text-[20px] 3xl:text-[25px]">
            {title}
          </h2>
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-[8px]">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full bg-white/20 px-[10px] py-[2px] text-[12px] text-white 2xl:text-[14px]">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
