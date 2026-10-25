"use client";

import { useEffect, useState } from "react";
import BranchForm from "../../common/BranchForm";
import api from "../../../lib/api/axios";
import { renderHtml } from "@/lib/utils/htmlParser";

export default function MobBranchLocator({ pageContent }) {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [branchLocationsAPI, setBranchLocationsAPI] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const fetchStates = async () => {
    try {
      const { data } = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/career/states`);
      if (data.success) {
        setStates(data.data);
      } else {
        console.error("Failed to fetch states:", data.message);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchDistricts = async (state_id) => {
    if (!state_id) {
      setDistricts([]);
      return;
    }
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
    }
  };

  const fetchLocations = async (state_id, district_id) => {
    if (!state_id || !district_id) {
      setLocations([]);
      return;
    }
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
    }
  };

  const fetchBranchLocations = async () => {
    try {
      const { data } = await api.get("/branch/branches/active");
      if (data?.success) {
        setBranchLocationsAPI(data?.data || []);
        setSelectedBranch(data?.data?.[0] || null);
      } else {
        console.error("Failed to fetch branch locations:", data?.message);
      }
    } catch (error) {
      console.error("Error fetching branch locations:", error);
    }
  };

  const fetchBranchLocationsFiltered = async () => {
    try {
      const queryParams = {
        state: selectedState || undefined,
        district: selectedDistrict || undefined,
        location: selectedLocation || undefined,
        distance: selectedDistance || undefined,
        lat: (selectedDistance && userLocation?.latitude) || undefined,
        long: (selectedDistance && userLocation?.longitude) || undefined,
      };
      const { data } = await api.get("/branch/branches/filtered_branches", { params: queryParams });
      if (data?.success) {
        setBranchLocationsAPI(data?.data || []);
        setSelectedBranch(data?.data?.[0] || null);
      } else {
        console.error("Failed to fetch filtered branch locations:", data?.message);
      }
    } catch (error) {
      console.error("Error fetching filtered branch locations:", error);
    }
  };

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

  useEffect(() => {
    if (selectedState || selectedDistrict || selectedLocation || selectedDistance) {
      fetchBranchLocationsFiltered();
    } else {
      fetchBranchLocations();
    }
  }, [selectedState, selectedDistrict, selectedLocation, selectedDistance]);

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
        />
      </div>
    </section>
  );
}
