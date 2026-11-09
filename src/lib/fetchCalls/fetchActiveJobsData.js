import { notFound } from "next/navigation";

export async function fetchData() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/career-active-jobs`, {
            cache: "no-store", // Ensure fresh data
        });

        // Check if the response is ok (status 200-299)
        if (!response.ok) {
            if (response.status === 404) {
                // This will trigger the not-found.js page
                notFound();
            }
            // This will trigger the error.js page
            throw new Error(`HTTP ${response.status}: Failed to fetch career data`);
        }

        const result = await response.json();
        const jobsData = result.data;

        

        if (result.status === "success") {
            return {
                jobs: jobsData?.jobs,
                error: null
            };
        }

        return {
            jobs: null,
            error: result.message
        };



    } catch (error) {
        // Re-throw the error to be caught by error.js
        if (error.message?.includes('notFound')) {
            // Let notFound() handle this
            throw error;
        }
        throw new Error(`Failed to fetch career data: ${error.message}`);
    }


}