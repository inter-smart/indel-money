import FloatButton from "../../components/floatButtons/FloatButton";

async function fetchGoldCaratTypes() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-enquiries/gold-carat-types`, {
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    const result = await response.json();
    if (result.success) {
      return { data: result.data, error: null }; // Return consistent structure
    } else {
      return { data: [], error: result.message }; // Fix: return instead of assigning to undefined 'data'
    }
  } catch (error) {
    return { data: [], error: "Failed to fetch gold carat types" }; // Fix: return something
  }
}

async function fetchData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/float-buttons`, {
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    const result = await response.json();
    if (result.status === "success") {
      return { buttons: result.data.buttons, error: null };
    }
    return { buttons: [], error: result.message }; // Return empty array instead of null
  } catch (error) {
    return { buttons: [], error: "Failed to fetch header data" };
  }
}

async function fetchGoldTypeData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/service-enquiries/gold-types`, {
      cache: "force-cache",
      next: { revalidate: 60 },
    });
    const result = await response.json();
    if (result.success) {
      return { data: result.data, error: null };
    }
    return { data: [], error: result.message }; // Return empty array instead of null
  } catch (error) {
    return { data: [], error: "Failed to fetch header data" };
  }
}

export default async function FloatingButton() {
  const { buttons, error: buttonsError } = await fetchData();
  const { data: goldTypes, error: goldTypesError } = await fetchGoldTypeData();
  const { data: formattedGoldCaratTypes, error: goldCaratError } = await fetchGoldCaratTypes();

  // Handle errors more gracefully
  if (buttonsError || goldTypesError || goldCaratError) {
    console.error("Fetch errors:", { buttonsError, goldTypesError, goldCaratError });
    // You can still render the component with empty data or return an error message
  }

  return <FloatButton buttons={buttons} formattedGoldTypes={goldTypes} formattedGoldCaratTypes={formattedGoldCaratTypes} />;
}
