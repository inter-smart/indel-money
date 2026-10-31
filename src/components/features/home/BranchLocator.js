"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import BranchForm from "@/components/common/BranchForm";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import api from "../../../lib/api/axios";
import { renderHtml } from "@/lib/utils/htmlParser";
import { debounce } from "lodash";

// Dynamically import BranchLocationMap with SSR disabled
const BranchLocationMap = dynamic(() => import("@/components/features/home/BranchLocationMap"), {
  ssr: false,
});

export default function BranchLocator({ variant = "default", pageContent, useQueryParams = true }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [allBranchLocations, setAllBranchLocations] = useState([]); // For map
  const [nearbyBranchLocations, setNearbyBranchLocations] = useState([]); // For list
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingStates, setLoadingStates] = useState(true); // fetchStates runs on mount
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingNearby, setLoadingNearby] = useState(true); // initial list fetch starts on mount

  const fetchStates = useCallback(async () => {
    setLoadingStates(true);
    try {
      const { data } = await api.get(`/career/states`);
      if (data.success) {
        setStates(
          (data.data || [])
            .filter((state) => state.is_active)
            .map((state) => ({ value: state.id, label: state.state_name })),
        );
      } else {
        console.error("Failed to fetch states:", data.message);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const fetchDistricts = useCallback(async (state_id) => {
    setLoadingDistricts(true);
    try {
      const url = state_id ? `/api/career/districts/by_state/${state_id}` : `/api/career/districts`;
      const { data } = await api.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`);
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
  }, []);

  const fetchLocations = useCallback(async (state_id, district_id) => {
    setLoadingLocations(true);
    try {
      const url =
        state_id && district_id
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/career/locations/by_district_state`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/career/locations`;
      const params = state_id && district_id ? { state_id, district_id } : {};
      const { data } = await api.get(url, { params });
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
  }, []);

  const fetchAllBranchLocations = useCallback(async () => {
    try {
      const { data } = await api.get("/branch/branches/active");
      if (data?.success) {
        setAllBranchLocations(data?.data || []);
      } else {
        console.error("Failed to fetch all branch locations:", data?.message);
      }
    } catch (error) {
      console.error("Error fetching all branch locations:", error);
    }
  }, []);

  const selectedBranchRef = useRef(selectedBranch);
  useEffect(() => {
    selectedBranchRef.current = selectedBranch;
  }, [selectedBranch]);

  // Created once so the debounce timer isn't discarded on every selectedBranch
  // change - recreating it per-render (previously deps: [selectedBranch])
  // defeated debouncing, since each recreation dropped any pending call.
  const debouncedNearbyFetch = useCallback(
    debounce(async (queryParams) => {
      try {
        const { data } = await api.get("/branch/branches/filtered_branches", { params: queryParams });
        if (data?.success) {
          setNearbyBranchLocations(data?.data || []);
          // Follow the latest filtered/nearby results on the map, not just
          // the first time a branch gets selected - every new result set
          // (filter change, distance change, clear) should take over.
          setSelectedBranch(data?.data?.[0] || null);
        } else {
          console.error("Failed to fetch nearby branch locations:", data?.message);
        }
      } catch (error) {
        console.error("Error fetching nearby branch locations:", error);
      } finally {
        setLoadingNearby(false);
      }
    }, 300),
    [],
  );

  // Flags loading as soon as a fetch is queued, so the list shows a spinner
  // during the debounce window as well as the request itself.
  const debouncedFetchNearbyBranchLocations = useCallback(
    (queryParams) => {
      setLoadingNearby(true);
      debouncedNearbyFetch(queryParams);
    },
    [debouncedNearbyFetch],
  );

  useEffect(() => {
    return () => debouncedNearbyFetch.cancel();
  }, [debouncedNearbyFetch]);

  const updateQueryParams = useCallback(
    (newParams) => {
      // Only update query params if useQueryParams is true
      if (!useQueryParams) return;

      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, useQueryParams],
  );

  const hasActiveFilters = useCallback(() => {
    return !!selectedState || !!selectedDistrict || !!selectedLocation;
  }, [selectedState, selectedDistrict, selectedLocation]);

  const fetchNearbyBranchesWithLocation = useCallback(
    (
      distance,
      filters = { state: selectedState, district: selectedDistrict, location: selectedLocation },
      { syncUrl = true } = {},
    ) => {
      const activeFilters = !!filters.state || !!filters.district || !!filters.location;
      const queryParams = {
        state: filters.state || undefined,
        district: filters.district || undefined,
        location: filters.location || undefined,
      };

      if (!activeFilters && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            debouncedFetchNearbyBranchLocations({
              ...queryParams,
              distance: distance || selectedDistance || "20",
              lat: latitude,
              long: longitude,
            });
            if (syncUrl) updateQueryParams({ distance: distance || selectedDistance || "20" });
          },
          (error) => {
            debouncedFetchNearbyBranchLocations(queryParams);
          },
        );
      } else {
        debouncedFetchNearbyBranchLocations(queryParams);
        if (syncUrl) {
          if (!activeFilters) {
            updateQueryParams({ distance: distance || selectedDistance || "20" });
          } else {
            updateQueryParams({ state: filters.state, district: filters.district, location: filters.location });
          }
        }
      }
    },
    [selectedState, selectedDistrict, selectedLocation, selectedDistance, debouncedFetchNearbyBranchLocations, updateQueryParams],
  );

  const handleDistanceOpen = useCallback(() => {
    if (hasActiveFilters()) {
      // If filters are active, use existing filters without distance
      debouncedFetchNearbyBranchLocations({
        state: selectedState || undefined,
        district: selectedDistrict || undefined,
        location: selectedLocation || undefined,
      });
    } else if (!userLocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          debouncedFetchNearbyBranchLocations({
            distance: selectedDistance || "20",
            lat: latitude,
            long: longitude,
          });
          updateQueryParams({ distance: selectedDistance || "20" });
        },
        () => {},
      );
    } else if (userLocation) {
      debouncedFetchNearbyBranchLocations({
        distance: selectedDistance || "20",
        lat: userLocation.latitude,
        long: userLocation.longitude,
      });
      updateQueryParams({ distance: selectedDistance || "20" });
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  }, [
    selectedDistance,
    userLocation,
    selectedState,
    selectedDistrict,
    selectedLocation,
    debouncedFetchNearbyBranchLocations,
    updateQueryParams,
    hasActiveFilters,
  ]);

  const handleBranchFormChange = useCallback(
    (field, value) => {
      const newParams = {};

      if (field === "state") {
        setSelectedState(value);
        setSelectedDistrict("");
        setSelectedLocation("");
        fetchDistricts(value);
        newParams.state = value;
        newParams.district = "";
        newParams.location = "";
      } else if (field === "district") {
        setSelectedDistrict(value);
        setSelectedLocation("");
        fetchLocations(selectedState, value);
        newParams.district = value;
        newParams.location = "";
      } else if (field === "location") {
        setSelectedLocation(value);
        newParams.location = value;
      } else if (field === "distance") {
        setSelectedDistance(value);
        newParams.distance = value;
        // Only fetch with distance if no other filters are active
        if (!hasActiveFilters()) {
          fetchNearbyBranchesWithLocation(value);
        } else {
          // Use existing filters without distance
          debouncedFetchNearbyBranchLocations({
            state: selectedState || undefined,
            district: selectedDistrict || undefined,
            location: selectedLocation || undefined,
          });
        }
        return; // Exit early to avoid redundant fetch
      } else if (field === "clear") {
        setSelectedState("");
        setSelectedDistrict("");
        setSelectedLocation("");
        setSelectedDistance("20");
        setDistricts([]);
        setLocations([]);
        setSelectedBranch(null);
        selectedBranchRef.current = null;
        // Reset to default 20km without touching the URL, then drop every query param at once
        fetchNearbyBranchesWithLocation("20", { state: "", district: "", location: "" }, { syncUrl: false });
        if (useQueryParams) router.push(pathname, { scroll: false });
        return;
      }

      // Update URL parameters only if useQueryParams is true
      updateQueryParams(newParams);

      // Trigger filtered fetch for nearby branches
      if (field !== "clear") {
        debouncedFetchNearbyBranchLocations({
          state: field === "state" ? value : selectedState || undefined,
          district: field === "district" ? value : selectedDistrict || undefined,
          location: field === "location" ? value : selectedLocation || undefined,
        });
      }
    },
    [
      selectedState,
      selectedDistrict,
      selectedLocation,
      selectedDistance,
      userLocation,
      fetchDistricts,
      fetchLocations,
      debouncedFetchNearbyBranchLocations,
      fetchNearbyBranchesWithLocation,
      updateQueryParams,
      hasActiveFilters,
      useQueryParams,
      router,
      pathname,
    ],
  );

  useEffect(() => {
    if (!isInitialLoad) return;

    // Only read from query params if useQueryParams is true
    const state = useQueryParams ? searchParams.get("state") || "" : "";
    const district = useQueryParams ? searchParams.get("district") || "" : "";
    const location = useQueryParams ? searchParams.get("location") || "" : "";
    const distance = useQueryParams ? searchParams.get("distance") || "20" : "20"; // Default to 20km

    setSelectedState(state);
    setSelectedDistrict(district);
    setSelectedLocation(location);
    setSelectedDistance(distance);

    fetchStates();
    if (state) fetchDistricts(state);
    if (state && district) fetchLocations(state, district);

    // Always fetch all branches for the map
    fetchAllBranchLocations();

    // Fetch nearby branches for the initial list based on geolocation or filters
    fetchNearbyBranchesWithLocation(distance, { state, district, location });
    setIsInitialLoad(false);
  }, [searchParams, fetchStates, fetchDistricts, fetchLocations, fetchAllBranchLocations, fetchNearbyBranchesWithLocation, useQueryParams]);

  return (
    <section
      className={`${
        variant === "contact"
          ? "sm:bg-[#e6edf7] rounded-t-[10px] py-[20px_0] sm:py-[20px] lg:py-[30px] 2xl:py-[40px] 3xl:py-[50px] max-sm:shadow-[0_0_150px_0_rgba(0,0,0,0.25)]"
          : ""
      }
      ${variant === "branch" ? "pt-[30px] sm:pt-[40px] pb-[0px] 2xl:pt-[30px] 2xl:pb-[90px] 3xl:pt-[50px] 3xl:pb-[120px]" : ""}
      w-full block`}
    >
      <div>
        <div className="container">
          <div
            className={`flex flex-col lg:flex-row items-start xl:items-start justify-between flex-wrap ${
              variant === "contact" ? "mb-[15px] sm:mb-[20px] lg:mb-[30px]" : "mb-[35px]"
            }`}
          >
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-title1 w-full lg:w-[calc(100%-468px)] xl:w-[calc(100%-500px)] 2xl:w-[calc(100%-600px)] 3xl:w-[calc(100%-600px)] xl:pr-[40px] 2xl:pr-[60px] 3xl:pr-[80px] [&>span]:text-base2 [&>span]:font-bold"
            >
              {pageContent?.title ? renderHtml(pageContent?.title) : ""}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden sm:flex w-full lg:w-[468px] xl:w-[500px] 2xl:w-[600px] 3xl:w-[600px] mt-2 xl:mt-[10px] xl:text-right"
            >
              <p className="text-[12px] lg:text-[12px] xl:text-[12px] 2xl:text-[16px] 3xl:text-[18px] text-[#323232]">
                {pageContent?.description || ""}
              </p>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container mx-auto">
          <div className="bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[12px] p-[12px] sm:p-[16px] lg:p-[20px] 2xl:p-[24px] mb-6">
            <BranchForm
              states={states}
              districts={districts}
              locations={locations}
              selectedState={selectedState}
              selectedDistrict={selectedDistrict}
              selectedLocation={selectedLocation}
              selectedDistance={selectedDistance}
              onValueChange={handleBranchFormChange}
              onOpenChange={handleDistanceOpen}
              isMobile={false}
              useQueryParams={useQueryParams}
              loadingStates={loadingStates}
              loadingDistricts={loadingDistricts}
              loadingLocations={loadingLocations}
            />
          </div>
        </motion.div>
      </div>
      <div
        className={`${
          variant === "home"
            ? "sm:pb-[45px] xl:pb-[60px] 2xl:pb-[90px] relative z-0 before:content-[''] before:block before:w-full before:h-[calc(100%-95px)] before:bg-gradient-to-r before:from-[rgba(243,0,0,0)] before:to-[rgba(255,2,2,0.1)] before:absolute before:bottom-0 before:left-0 before:-z-10 before:pointer-events-none before:rotate-180"
            : ""
        }`}
      >
        <div className="max-w-full container mx-auto">
          <BranchLocationMap
            allBranchLocations={allBranchLocations}
            nearbyBranchLocations={nearbyBranchLocations}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
            userLocation={userLocation}
            selectedDistance={selectedDistance}
            hasActiveFilters={hasActiveFilters()}
            loadingBranches={loadingNearby}
          />
        </div>
      </div>
    </section>
  );
}
