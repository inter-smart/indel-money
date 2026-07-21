//export const dynamic = "force-dynamic";
import React from "react";
import Policies from "../../components/features/investors/Policies";

async function fetchPolicyData(page = 1, limit = 10) {
  try {
    const catResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/policy_categories`,
      {
        // cache: "no-store", // or 'force-cache' depending on your needs
        cache: "force-cache",
        next: { revalidate: 600 },
      }
    );
    const catResult = await catResponse.json();
    const categories = catResult.policy_categories || [];
    const firstCategoryId = categories.length > 0 ? categories[0].id : null;

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/investors/policies?page=${page}&limit=${limit}`;
    if (firstCategoryId) {
      url += `&category_id=${firstCategoryId}`;
    }

    const response = await fetch(
      url,
      {
        // cache: "no-store", // or 'force-cache' depending on your needs
        cache: "force-cache",
        next: { revalidate: 600 },
      }
    );

    const result = await response.json();
    const policyData = result?.data;
    const pagination = result?.data?.pagination;

    if (result.status === "success") {
      return {
        content: policyData?.content,
        policies: policyData?.policies,
        categories: categories,
        totalPages: pagination?.totalPages,
        currentPage: pagination?.currentPage,
        limit: pagination?.limit,
        error: null,
      };
    }
    return {
      content: null,
      policies: null,
      categories: null,
      totalPages: null,
      currentPage: null,
      limit: null,
      error: result.message,
    };
  } catch (error) {
    return {
      content: null,
      policies: null,
      categories: null,
      totalPages: null,
      currentPage: null,
      limit: null,
      error: "Failed to fetch policy data",
    };
  }
}

export default async function Policy({ searchParams }) {
  const page = (await searchParams?.page) || 1;

  const { content, policies, categories, totalPages, currentPage, limit, error } = await fetchPolicyData(page);

  if (!content && !policies && !totalPages && !currentPage && !limit) {
    return <div>Failed to fetch policy data</div>;
  }

  return (
    <>
      <Policies policies={policies} initialCategories={categories} content={content} currentPage={currentPage} totalPages={totalPages} limit={limit} />
    </>
  );
}
