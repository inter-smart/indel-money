const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const PAGE_LIMIT = 50;
const REVALIDATE_SECONDS = 3600;

async function fetchJson(url) {
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

// Loops a paginated list endpoint until every page has been collected.
// `fetchPage(page)` must resolve to { items, totalPages }.
async function paginateAll(fetchPage) {
  const items = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await fetchPage(page);
    items.push(...result.items);
    totalPages = result.totalPages || 1;
    page += 1;
  } while (page <= totalPages);

  return items;
}

async function safeCollect(label, collector) {
  try {
    return await collector();
  } catch (error) {
    console.error(`[sitemap] Failed to load ${label} entries:`, error.message);
    return [];
  }
}

export async function getBlogEntries() {
  return safeCollect("blog", async () => {
    const items = await paginateAll(async (page) => {
      const result = await fetchJson(`${backendUrl}/api/web/blogs?page=${page}&limit=${PAGE_LIMIT}`);
      const { blogs = [], pagination } = result.data || {};
      return { items: blogs, totalPages: pagination?.totalPages };
    });

    return items.map((blog) => ({
      url: `/blog/${blog.slug}`,
      lastModified: blog.createdAt ? new Date(blog.createdAt) : undefined,
    }));
  });
}

export async function getNewsEntries() {
  return safeCollect("news", async () => {
    const items = await paginateAll(async (page) => {
      const result = await fetchJson(`${backendUrl}/api/web/news?page=${page}&limit=${PAGE_LIMIT}`);
      const { news = [], pagination } = result.data || {};
      return { items: news, totalPages: pagination?.totalPages };
    });

    return items.map((item) => ({
      url: `/news/${item.slug}`,
      lastModified: item.createdAt ? new Date(item.createdAt) : undefined,
    }));
  });
}

export async function getCsrEntries() {
  return safeCollect("csr", async () => {
    const items = await paginateAll(async (page) => {
      const result = await fetchJson(`${backendUrl}/api/web/csr?page=${page}&limit=${PAGE_LIMIT}`);
      const { csr = [], pagination } = result.data || {};
      return { items: csr, totalPages: pagination?.totalPages };
    });

    return items.map((item) => ({
      url: `/csr/${item.slug}`,
      lastModified: item.createdAt ? new Date(item.createdAt) : undefined,
    }));
  });
}

export async function getIndelCaresEntries() {
  return safeCollect("indel-money-cares", async () => {
    const items = await paginateAll(async (page) => {
      const result = await fetchJson(`${backendUrl}/api/web/indel-cares?page=${page}&limit=${PAGE_LIMIT}`);
      const { slideItems = [], nonSlideItems = [], pagination } = result.data || {};
      return { items: [...slideItems, ...nonSlideItems], totalPages: pagination?.totalPages };
    });

    const seen = new Set();
    return items
      .filter((item) => item.slug && !seen.has(item.slug) && seen.add(item.slug))
      .map((item) => ({
        url: `/indel-money-cares/${item.slug}`,
        lastModified: item.createdAt ? new Date(item.createdAt) : undefined,
      }));
  });
}

export async function getGalleryEntries() {
  return safeCollect("gallery", async () => {
    const result = await fetchJson(`${backendUrl}/api/web/event-gallery`);
    const galleryItems = result.data?.galleryItems || [];

    return galleryItems
      .filter((item) => item.slug)
      .map((item) => ({
        url: `/gallery/${item.slug}`,
        lastModified: item.createdAt ? new Date(item.createdAt) : undefined,
      }));
  });
}

export async function getCelebrationsEntries() {
  return safeCollect("celebrations", async () => {
    // celebrationsApiPath() strips the "categories" segment entirely, so the public
    // route is /api/web/celebrations (list), /api/web/celebrations/:slug (subcategories), etc.
    // See src/components/features/celebrations/celebrationConstants.js.
    const categories = await paginateAll(async (page) => {
      const result = await fetchJson(`${backendUrl}/api/web/celebrations?page=${page}&limit=${PAGE_LIMIT}`);
      const { categories = [], pagination } = result.data || {};
      return { items: categories, totalPages: pagination?.totalPages };
    });

    const categoryEntries = categories.map((category) => ({
      url: `/celebrations/${category.slug}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : undefined,
    }));

    const subcategoryEntryLists = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await paginateAll(async (page) => {
          const result = await fetchJson(
            `${backendUrl}/api/web/celebrations/${encodeURIComponent(category.slug)}?page=${page}&limit=${PAGE_LIMIT}`
          );
          const { subcategories = [], pagination } = result.data || {};
          return { items: subcategories, totalPages: pagination?.totalPages };
        });

        return subcategories.map((subcategory) => ({
          url: `/celebrations/${category.slug}/${subcategory.slug}`,
          lastModified: subcategory.updatedAt ? new Date(subcategory.updatedAt) : undefined,
        }));
      })
    );

    return [...categoryEntries, ...subcategoryEntryLists.flat()];
  });
}
