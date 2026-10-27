import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const PREVIEW_LENGTH = 320;

// Variant style mappings for better performance
const VARIANT_STYLES = {
  whoDoServe1: "bg-linear-to-br from-base1/20 to-base2/20",
  whoDoServe2: "bg-linear-to-br from-base2/20 to-base1/20",
  whoDoServeMob: "bg-[#e5ecf5]",
  default: "sm:bg-none sm:hover:bg-[#F8FBFF]",
};

const BASE_STYLES =
  "group w-full h-full min-w-0 flex flex-col overflow-hidden rounded-[20px] sm:rounded-[30px] 3xl:rounded-[36px] p-[12px] sm:p-[15px] xl:p-[20px] 3xl:p-[30px] sm:pb-[40px] pb-[25px] transition-all duration-300 sm:hover:shadow-[0_0_15px_0_rgba(0,0,0,0.15)]";

export default function LoanCardBx({ item = {}, variant = "default" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Memoize computed values to prevent recalculation on each render
  const { shouldTruncate, truncatedDescription, imageUrl, imageAlt } = useMemo(() => {
    const desc = item.description || "";
    const shouldTrunc = desc.length > PREVIEW_LENGTH;
    const truncDesc = shouldTrunc ? `${desc.substring(0, PREVIEW_LENGTH)}...` : desc;

    return {
      shouldTruncate: shouldTrunc,
      truncatedDescription: truncDesc,
      imageUrl: item.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/default-image.jpg",
      imageAlt: item.image_alt || "Loan image",
    };
  }, [item.description, item.image, item.image_alt]);

  // Memoize className to prevent string concatenation on each render
  const containerClassName = useMemo(() => `${VARIANT_STYLES[variant] || VARIANT_STYLES.default} ${BASE_STYLES}`, [variant]);

  // Use useCallback to prevent unnecessary re-renders
  const handleToggleExpand = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  }, []);

  // Early return if no item
  if (!item) return null;

  const TitleComponent = variant !== "default" ? "h4" : "h3";

  return (
    <Link href={item.href || "#"} className={containerClassName}>
      <div className="w-full flex flex-col flex-1">
        {/* Image Section */}
        <div className="w-full h-auto shrink-0 rounded-[15px] sm:rounded-[24px] overflow-hidden mb-[15px] xl:mb-[25px] 3xl:mb-[30px] aspect-300/190 sm:aspect-465/295">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={465}
            height={295}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            priority={false}
            loading="lazy"
          />
        </div>

        {/* Content Section */}
        <div className="w-full sm:pt-0 flex flex-col flex-1">
          <TitleComponent className="text-[16px] sm:text-[18px] xl:text-[20px] 2xl:text-[22px] 3xl:text-[30px] text-base1 font-bold mb-[10px] sm:mb-[2px] line-clamp-1">
            {item.title || "Default Title"}
          </TitleComponent>

          {/* Conditional subtitle sections */}
          {(item.title2 || item.sub_title) && (
            <div className="text-[12px] sm:text-[14px] xl:text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-[#1E1E1E] font-normal mb-[15px] line-clamp-1">
              {item.title2 || item.sub_title}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="w-full sm:mb-[5px] 3xl:mb-[10px] text-sm1">{isExpanded ? item.description : truncatedDescription}</div>
          )}

          {/* Read More/Less — sits directly below the description */}
          {item.description && shouldTruncate && (
            <div className="w-full pt-2">
              <button
                type="button"
                onClick={handleToggleExpand}
                className="text-[12px] sm:text-[13px] 2xl:text-[14px] 3xl:text-[16px] text-blue-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Show less description" : "Show more description"}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// import Image from "next/image";
// import Link from "next/link";

// export default function LoanCardBx({ item, variant = "default" }) {
//   return (
//     <Link
//       href={item?.href || "#"}
//       className={`${
//         variant === "whoDoServe1"
//           ? "bg-linear-to-br from-base1/20 to-base2/20"
//           : variant === "whoDoServe2"
//           ? "bg-linear-to-br from-base2/20 to-base1/20"
//           : variant === "whoDoServeMob"
//           ? "bg-[#e5ecf5]"
//           : "sm:bg-none sm:hover:bg-[#F8FBFF]"
//       } group w-full h-full block overflow-hidden rounded-[20px] sm:rounded-[30px] 3xl:rounded-[36px] p-[12px] sm:p-[15px] xl:p-[20px] 3xl:p-[30px] sm:pb-[40px] pb-[25px] transition-all duration-300  sm:hover:shadow-[0_0_15px_0_rgba(0,0,0,0.15)]`}
//     >
//       <div className="w-full flex flex-wrap sm:flex-row">
//         <div className="w-full h-auto xl:h-full rounded-[15px] sm:rounded-[24px] overflow-hidden mb-[15px] xl:mb-[25px] 3xl:mb-[30px] aspect-300/190 sm:aspect-465/295">
//           <Image
//             src={item?.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}` : "/default-image.jpg"}
//             alt={item?.image_alt ? item?.image_alt : "Loan image"}
//             width={465}
//             height={295}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
//           />
//         </div>
//         <div className="w-full sm:pt-0">
//           {
//             variant !== "default" ?
//                  <h4 className="text-[16px] sm:text-[18px] xl:text-[20px] 2xl:text-[22px] 3xl:text-[30px] text-base1 font-bold mb-[10px] sm:mb-[2px] line-clamp-1">
//             {item?.title || "Default Title"}
//           </h4>:     <h3 className="text-[16px] sm:text-[18px] xl:text-[20px] 2xl:text-[22px] 3xl:text-[30px] text-base1 font-bold mb-[10px] sm:mb-[2px] line-clamp-1">
//             {item?.title || "Default Title"}
//           </h3>
//           }

//           {item?.title2 && (
//             <div className="text-[12px] sm:text-[14px] xl:text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-[#1E1E1E] font-normal mb-[15px] line-clamp-1">
//               {item.title2}
//             </div>
//           )}
//           {item?.sub_title && (
//             <div className="text-[12px] sm:text-[14px] xl:text-[14px] 2xl:text-[16px] 3xl:text-[20px] text-[#1E1E1E] font-normal mb-[15px] line-clamp-1">
//               {item.sub_title}
//             </div>
//           )}
//           <div className="w-full sm:mb-[5px] 3xl:mb-[10px] text-sm1 line-clamp-4">{item?.description || "No description available."}</div>
//         </div>
//       </div>
//     </Link>
//   );
// }
