"use client";

import { useEffect, useState } from "react";
import BranchForm from "../../common/BranchForm";
import api from "../../../lib/api/axios";
import { renderHtml } from "@/lib/utils/htmlParser";

export default function MobBranchLocator({ pageContent }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [loadingStates, setLoadingStates] = useState(true); // fetchStates runs on mount
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const { data } = await api.get("/career/jobs/dropdowns");
      if (data.success) {
        setStates(data.data.states || []);
      } else {
        console.error("Failed to fetch states:", data.message);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchDistricts = async (state_id) => {
    if (!state_id) {
      setDistricts([]);
      return;
    }
    setLoadingDistricts(true);
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/career/districts/by_state/${state_id}`,
      );
      if (data.success) {
        setDistricts(data.data);
      } else {
        console.error("Failed to fetch districts:", data.message);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchLocations = async (state_id, district_id) => {
    if (!state_id || !district_id) {
      setLocations([]);
      return;
    }
    setLoadingLocations(true);
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/career/locations/by_district_state`,
        { params: { state_id, district_id } },
      );
      if (data.success) {
        setLocations(data.data);
      } else {
        console.error("Failed to fetch locations:", data.message);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoadingLocations(false);
    }
  };

  // The mobile section only renders <BranchForm>, which navigates to /branch-locator on submit,
  // so the branch list itself (~250 KB) is not fetched here.
  const handleDistanceOpen = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {},
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  };

  const handleBranchFormChange = (field, value) => {
    if (field === "state") {
      setSelectedState(value);
      setSelectedDistrict("");
      setSelectedLocation("");
      fetchDistricts(value);
    } else if (field === "district") {
      setSelectedDistrict(value);
      setSelectedLocation("");
      fetchLocations(selectedState, value);
    } else if (field === "location") {
      setSelectedLocation(value);
    } else if (field === "distance") {
      setSelectedDistance(value);
    } else if (field === "clear") {
      setSelectedState("");
      setSelectedDistrict("");
      setSelectedLocation("");
      setSelectedDistance("");
      setUserLocation(null);
      setDistricts([]);
      setLocations([]);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <section className="w-full py-[30px_15px] mb-[30px] bg-white shadow-[0_0_150px_0_rgba(0,0,0,0.25)] rounded-[10px_10px_0_0]">
      <div className="container">
        <h2 className="text-title1 mb-[10px] 2xl:mb-[15px] [&>span]:text-base2 [&>span]:font-bold">
          {pageContent?.title ? renderHtml(pageContent?.title) : "Find Your Nearest Branch"}
        </h2>
        <BranchForm
          states={states || []}
          districts={districts || []}
          locations={locations || []}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedLocation={selectedLocation}
          selectedDistance={selectedDistance}
          onValueChange={handleBranchFormChange}
          onOpenChange={handleDistanceOpen}
          isMobile={true}
          loadingStates={loadingStates}
          loadingDistricts={loadingDistricts}
          loadingLocations={loadingLocations}
        />
      </div>
    </section>
  );
}
