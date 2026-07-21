// import GalleryDetail from "@/components/features/gallery/gallerydetail";
//export const dynamic = "force-dynamic";
import GalleryDetail from "@/components/features/gallery/GalleryDetail";
import GallerySlider from "../../../components/features/gallery/GallerySlider";

async function fetchMoreGalleryItems(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/more-events?slug=${slug}`, {
      // cache: "no-store", // Ensure fresh data
      cache: "force-cache",
      next: { revalidate: 600 },
    });

    const result = await response.json();
    const galleryData = result.data;

    if (result.status === "success") {
      return {
        galleryItems: galleryData?.galleryItems,
        description: galleryData?.description,
        error: null,
      };
    }

    return {
      galleryItems: null,
      description: null,
      error: result.message,
    };
  } catch (error) {
    return {
      galleryItems: null,
      description: null,
      error: "Failed to fetch gallery data",
    };
  }
}

export default async function GalleryDetailPage({ params, searchParams }) {
  const { slug } = await params;
  const { galleryItems, description, error: moreError } = await fetchMoreGalleryItems(slug);

  return (
    <>
      <GalleryDetail slug={slug} description={description} />
      <GallerySlider galleryItems={galleryItems} />
    </>
  );
}
