// Plain module (no "use client") so server pages and client components can both import it.
export const CATEGORY_PAGE_SIZE = 9;
export const SUBCATEGORY_PAGE_SIZE = 12;
export const MEDIA_PAGE_SIZE = 12;

export const MEDIA_FILTERS = [
  { value: "all", label: "All Gallery", countKey: "all", empty: "No photos or videos in this album yet." },
  { value: "image", label: "Photo Gallery", countKey: "image", empty: "No photos in this album yet." },
  { value: "video", label: "Video Gallery", countKey: "video", empty: "No videos in this album yet." },
];

// "categories", "categories/<slug>", ... -> "/celebrations", "/celebrations/<slug>", ... (the public /api/web route)
export const celebrationsApiPath = (path) => `celebrations${path.replace(/^categories/, "")}`;

export const FALLBACK_IMAGE = "/images/gall04.jpg";

// Stored paths are relative to the backend ("/uploads/..."); full URLs (e.g. YouTube) pass through.
export const mediaUrl = (path) => {
  if (!path) return FALLBACK_IMAGE;
  return /^https?:\/\//i.test(path) ? path : `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
};
