import Image from "next/image";
import styles from "@/components/features/blog/Blog.module.css";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { formatPostDate } from "@/lib/utils";
import { renderHtml } from "@/lib/utils/htmlParser";

const PostDateDisplay = ({ date = "24 NOVEMBER 2024", authorImage, authorName }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-1 sm:border-b border-b-[rgb(0,0,0,18%)] pb-[10px] sm:pb-[15px] md:pb-[20px] 2xl:mb-[30px] md:mb-[20px] sm:mb-[15px] mb-[10px]">
      {authorImage && authorName && (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-[32px] h-[32px] sm:w-[40px] sm:h-[40px] rounded-full overflow-hidden">
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${authorImage}`}
              alt={authorName}
              width={40}
              height={40}
              className="w-full h-full object-cover m-0! float-none! max-w-full! rounded-0!"
            />
          </div>
          <div className="flex-1">
            <div className="text-[10px] sm:text-sm font-medium text-black//60">
              <span className="font-light uppercase">By: {""}</span>
              {authorName}
            </div>
          </div>
        </div>
      )}

      <div className="text-[10px] sm:text-sm font-medium text-black/60 flex items-center gap-2">
        <span className="font-light uppercase">Posted On:</span>
        {formatPostDate(date)}
      </div>
    </div>
  );
};

const BlogDetail = ({ data }) => {
  return (
    <section className="w-full block py-[20px] lg:p-[30px_0_25px] 2xl:p-[50px_0_35px] relative z-0 before:content-[''] before:absolute before:-z-1 before:top-0 before:bottom-0 before:block before:w-full before:h-[50%] before:bg-gradient-to-r before:from-[rgba(243,0,0,0.00)] before:to-[rgba(235,2,8,0.10)] before:my-auto before:pointer-events-none sm:before:block before:hidden">
      <div className="container">
        <div className="2xl:mb-[55px] md:mb-[20px] sm:mb-[10px] mb-[15px] sm:block hidden">
          <PageBreadcrumb />
        </div>
        <div className={`${styles.ckCntWrap} border-b border-b-[rgb(0,0,0,18%)] 2xl:pb-[35px] xl:pb-[20px] md:pb-[20px] sm:pb-[10px] pb-[15px]`}>
          <div className="w-full sm:hidden block">
            <h1>{data?.title}</h1>
            <PostDateDisplay date={data?.createdAt} authorImage={data?.author_image} authorName={data?.author_name} />
          </div>
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.image}`}
            alt={"bg"}
            width={360}
            height={460}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.05]"
          />
          <div className="sm:block hidden">
            <p className={styles.visualHeading}>{data?.title}</p>
            <PostDateDisplay date={data?.createdAt} authorImage={data?.author_image} authorName={data?.author_name} />
          </div>
          {data?.image_description ? renderHtml(data?.image_description) : ""}
          <br />
          {/* <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.second_image}`}
            alt={"bg"}
            width={360}
            height={460}
            className="w-full mt-4 h-full object-cover transition-transform duration-600 group-hover:scale-[1.05] sm:block hidden"
          />
          <br /> */}
          {data?.second_image_description ? renderHtml(data?.second_image_description) : ""}
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
