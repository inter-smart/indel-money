"use client";

import React, { useState, useRef, useEffect, memo, useCallback, useMemo } from "react";
import { toSentenceCase } from "@/lib/utils/toSentenceCase";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const MarkerClusterGroup = dynamic(
  () => import("react-leaflet-markercluster").then((mod) => mod.default),
  { ssr: false }
);

// Import leaflet.markercluster CSS
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";


// Custom popup content component
const CustomPopup = memo(({ branch }) => (
  <div className="popup-content w-[260px] lg:w-[320px] 2xl:w-[376px]">
    <h3 className="text-[14px] lg:text-[16px] 2xl:text-[18px] font-bold line-clamp-1 text-[#1B1B1B] mb-[10px] lg:mb-[15px] 2xl:mb-[20px]">
      {toSentenceCase(branch?.name)}
    </h3>
    <div className="flex items-start mb-[5px] lg:mb-[10px] 2xl:mb-[15px] flex-wrap">
      <Image
        src="/icons/location.svg"
        alt="location"
        width={10}
        height={10}
        className="w-[10px] lg:w-[14px] 2xl:w-[16px] h-auto aspect-square"
      />
      <span className="w-[calc(100%-16px)] pl-[10px] text-[13px] lg:text-[14px] 2xl:text-[16px] font-normal text-[#1B1B1B] m-0">
        {`${branch?.address_1} ${branch?.address_2} ${branch?.address_3}`}
      </span>
    </div>
    {branch?.phone_no && (
      <div className="flex items-center mb-[5px] lg:mb-[10px] 2xl:mb-[15px] flex-wrap">
        <Image
          src="/icons/mobile.svg"
          alt="mobile"
          width={10}
          height={10}
          className="w-[10px] lg:w-[14px] 2xl:w-[16px] h-auto aspect-square"
        />
        <span className="w-[calc(100%-16px)] pl-[10px] text-[13px] lg:text-[14px] 2xl:text-[16px] font-normal text-[#1B1B1B]">
          {branch.phone_no}
        </span>
      </div>
    )}
    {branch?.email && (
      <div className="flex items-center mb-[5px] lg:mb-[10px] 2xl:mb-[15px] flex-wrap">
        <Image
          src="/icons/mail.svg"
          alt="email"
          width={10}
          height={10}
          className="w-[10px] lg:w-[14px] 2xl:w-[16px] h-auto aspect-square"
        />
        <span className="w-[calc(100%-16px)] pl-[10px] text-[13px] lg:text-[14px] 2xl:text-[16px] font-normal text-[#1B1B1B]">
          {branch.email}
        </span>
      </div>
    )}
    {branch?.mobile_no && (
      <div className="flex items-center flex-wrap">
        <Image
          src="/icons/phone.svg"
          alt="phone"
          width={10}
          height={10}
          className="w-[10px] lg:w-[14px] 2xl:w-[16px] h-auto aspect-square"
        />
        <span className="w-[calc(100%-16px)] pl-[10px] text-[12px] lg:text-[14px] 2xl:text-[16px] font-normal text-[#1B1B1B]">
          {branch?.mobile_no}
        </span>
      </div>
    )}
    <div className="lg:mt-[15px] 2xl:mt-[20px] pt-[5px] lg:pt-[10px] 2xl:pt-[15px] border-t-[1px] border-[#E5E5E5] border-dashed">
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${branch?.latitude},${branch?.longitude}`}
        target="_blank"
        className="block text-center bg-base1 px-3 py-2 rounded hover:bg-[#F30000] transition-colors"
      >
        <div className="flex items-center justify-center">
          <Image
            src="/icons/direction.svg"
            alt="arrow-right"
            width={10}
            height={10}
            className="w-[10px] lg:w-[14px] 2xl:w-[16px] h-auto aspect-square mr-2"
          />
          <span className="text-white">Get Directions</span>
        </div>
      </a>
    </div>
  </div>
));

// MapController component
const MapController = memo(
  ({
    selectedBranch,
    allBranchLocations,
    userLocation,
    selectedDistance,
  }) => {
    const map = useMap();
    const markerRefs = useRef({});
    const markerCallbacksRef = useRef({});
    const popupMoveCleanupRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);

    const selectedBranchRef = useRef(selectedBranch);
    useEffect(() => {
      selectedBranchRef.current = selectedBranch;
    }, [selectedBranch]);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Clear marker refs when allBranchLocations changes (due to filtering)
    useEffect(() => {
      markerRefs.current = {};
      markerCallbacksRef.current = {};
    }, [allBranchLocations]);

    // Cached per branch id so the ref/eventHandlers passed to each <Marker>
    // keep a stable identity across re-renders (e.g. every time selectedBranch
    // changes) instead of being recreated inline on every render - a fresh
    // identity makes react-leaflet detach and reattach every marker's
    // listeners on every render, which visibly stalls the UI once there are
    // more than a handful of branches.
    const getMarkerCallbacks = useCallback((branchId) => {
      if (!markerCallbacksRef.current[branchId]) {
        markerCallbacksRef.current[branchId] = {
          ref: (ref) => {
            if (ref) markerRefs.current[branchId] = ref;
          },
          eventHandlers: {
            add: () => {
              setTimeout(() => {
                if (selectedBranchRef.current?.id === branchId) {
                  const marker = markerRefs.current[branchId];
                  if (marker) {
                    map.closePopup();
                    marker.openPopup();
                  }
                }
              }, 50);
            },
          },
        };
      }
      return markerCallbacksRef.current[branchId];
    }, [map]);

    useEffect(() => {
      if (!isMounted || !map) return;

      if (userLocation) {
        map.setView([userLocation.latitude, userLocation.longitude], 11);
      } else if (selectedBranch?.latitude && selectedBranch?.longitude) {
        map.setView([selectedBranch.latitude, selectedBranch.longitude], 11);
      } else {
        // Default to Chennai if no user location or selected branch
        map.setView([13.0827, 80.2707], 11);
      }
    }, [userLocation, map, isMounted]);

    // Separate useEffect for handling popup opening
    useEffect(() => {
      if (!isMounted || !map || !selectedBranch) return;

      // Add a small delay to ensure marker is rendered
      const timer = setTimeout(() => {
        const findMarker = () =>
          markerRefs.current[selectedBranch.id] ||
          Object.values(markerRefs.current).find((marker) => {
            if (marker && marker.getLatLng) {
              const markerLatLng = marker.getLatLng();
              return (
                Math.abs(markerLatLng.lat - selectedBranch.latitude) < 0.0001 &&
                Math.abs(markerLatLng.lng - selectedBranch.longitude) < 0.0001
              );
            }
            return false;
          });

        // Pan/zoom to the branch FIRST, then open its popup once the move
        // settles. MarkerClusterGroup merges nearby markers into a cluster
        // bubble and only shows one individually once the map is close
        // enough to it - opening the popup before panning can silently do
        // nothing if the marker is still clustered/out of view at that point.
        map.closePopup();
        map.setView([selectedBranch.latitude, selectedBranch.longitude], 13);

        let opened = false;
        const openPopup = () => {
          if (opened) return;
          opened = true;
          const marker = findMarker();
          if (marker) marker.openPopup();
        };

        map.once("moveend", openPopup);
        // Fallback in case the map was already centered there (moveend won't fire)
        const fallback = setTimeout(openPopup, 350);

        popupMoveCleanupRef.current = () => {
          map.off("moveend", openPopup);
          clearTimeout(fallback);
        };
      }, 150); // Increased delay to allow for marker cluster re-rendering

      return () => {
        clearTimeout(timer);
        popupMoveCleanupRef.current?.();
        popupMoveCleanupRef.current = null;
      };
    }, [selectedBranch, map, isMounted, allBranchLocations]);

    useEffect(() => {
      if (!isMounted) return;

      const style = document.createElement("style");
      style.innerHTML = `
      .leaflet-popup-content-wrapper {
          border-radius: 24px;
          padding: 0;
          overflow: hidden;
      }
      .leaflet-popup-content {
          margin: 0;
          padding: 20px;
          width: auto !important;
      }
      .leaflet-popup-tip {
          background-color: white;
      }
      .marker-cluster-small {
          background-color: rgba(243, 0, 0, 0.6);
      }
      .marker-cluster-small div {
          background-color: rgba(243, 0, 0, 0.8);
          color: white;
      }
      .marker-cluster-medium {
          background-color: rgba(243, 0, 0, 0.6);
      }
      .marker-cluster-medium div {
          background-color: rgba(243, 0, 0, 0.8);
          color: white;
      }
      .marker-cluster-large {
          background-color: rgba(243, 0, 0, 0.6);
      }
      .marker-cluster-large div {
          background-color: rgba(243, 0, 0, 0.8);
          color: white;
      }
    `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }, [isMounted]);

    const mapPinIcon = useMemo(
      () =>
        L.icon({
          iconUrl: "/images/map-pin.png",
          iconSize: [27, 36],
          iconAnchor: [13, 36],
        }),
      [],
    );

    if (!isMounted || !L) return null;

    return (
      <>
        {userLocation && (
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={selectedDistance * 1000} // Convert km to meters
            pathOptions={{
              color: "#F30000",
              fillColor: "#F30000",
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        )}
        <MarkerClusterGroup
          showCoverageOnHover={true}
          spiderfyOnMaxZoom={true}
          removeOutsideVisibleBounds={true}
          maxClusterRadius={50}
        >
          {allBranchLocations?.map((branch) => {
            const { ref, eventHandlers } = getMarkerCallbacks(branch.id);
            return (
              <Marker
                key={`marker-${branch.id}`}
                position={[branch.latitude, branch.longitude]}
                icon={mapPinIcon}
                ref={ref}
                eventHandlers={eventHandlers}
              >
                <Popup closeButton={false}>
                  <CustomPopup branch={branch} />
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </>
    );
  }
);

// BranchLocationsInfo component
const BranchLocationsInfo = memo(({ item, type, selectedBranch, branch }) => {
  const icons = {
    address: (
      <Image
        src="/icons/location.svg"
        alt="location"
        className={`w-[12px] lg:w-[14px] 2xl:w-[16px] aspect-square mt-[1px] 2xl:mt-[2px] ${
          selectedBranch === branch ? "filter-white" : "filter-red"
        }`}
        width={12}
        height={16}
      />
    ),
    phone: (
      <Image
        src="/icons/mobile.svg"
        alt="mobile"
        className={`w-[12px] lg:w-[14px] 2xl:w-[16px] aspect-square mt-[1px] 2xl:mt-[2px] ${
          selectedBranch === branch ? "filter-white" : "filter-red"
        }`}
        width={12}
        height={16}
      />
    ),
    email: (
      <Image
        src="/icons/mail.svg"
        alt="email"
        className={`w-[12px] lg:w-[14px] 2xl:w-[16px] aspect-square mt-[1px] 2xl:mt-[2px] ${
          selectedBranch === branch ? "filter-white" : "filter-red"
        }`}
        width={12}
        height={16}
      />
    ),
    contactNumber: (
      <Image
        src="/icons/phone.svg"
        alt="phone"
        className={`w-[12px] lg:w-[14px] 2xl:w-[16px] aspect-square mt-[1px] 2xl:mt-[2px] ${
          selectedBranch === branch ? "filter-white" : "filter-red"
        }`}
        width={20}
        height={20}
      />
    ),
  };

  return (
    <div className="flex flex-wrap items-start mb-[8px] lg:mb-[10px] 2xl:mb-[15px]">
      {icons[type] || icons.address}
      <span className="text-[13px] lg:text-[12px] 2xl:text-[14px] 3xl:text-[16px] leading-[1.4] font-normal text-white w-[calc(100%-12px)] lg:w-[calc(100%-14px)] 2xl:w-[calc(100%-16px)] pl-[10px] lg:pl-[12px]">
        {item}
      </span>
    </div>
  );
});

export default function BranchLocationMap({
  allBranchLocations,
  nearbyBranchLocations,
  selectedBranch,
  setSelectedBranch,
  userLocation,
  selectedDistance,
  hasActiveFilters,
  loadingBranches = false,
}) {
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]); // Default: Chennai
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude]);
    } else if (selectedBranch?.latitude && selectedBranch?.longitude) {
      setMapCenter([selectedBranch.latitude, selectedBranch.longitude]);
    }
  }, [userLocation, selectedBranch]);

  const handleBranchClick = useCallback(
    (branch) => {
      setSelectedBranch(branch);
      if (branch?.latitude && branch?.longitude) {
        setMapCenter([branch.latitude, branch.longitude]);
      }
    },
    [setSelectedBranch]
  );

  if (!isMounted) return <div>Loading map...</div>;


  return (
    <div className="w-full sm:h-[510px] 2xl:h-[670px] relative z-1 flex flex-wrap rounded-[10px] sm:rounded-[16px] overflow-hidden">
      <div className="w-full sm:w-[calc(100%-220px)] lg:w-[calc(100%-260px)] xl:w-[calc(100%-320px)] 2xl:w-[calc(100%-420px)] max-sm:h-[376px] h-full relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={12}
          className="absolute z-0 inset-0"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <MapController
            selectedBranch={selectedBranch}
            allBranchLocations={allBranchLocations}
            userLocation={userLocation}
            selectedDistance={selectedDistance}
          />
        </MapContainer>
      </div>
      <div className="w-full sm:w-[220px] lg:w-[260px] xl:w-[320px] 2xl:w-[420px] sm:h-full bg-base1 relative z-0 max-sm:shadow-[0_0_25px_0_rgba(238,56,36,0.20)] before:absolute before:inset-0 before:top-auto before:z-2 before:block before:bg-gradient-to-t before:to-transparent before:from-base1 before:w-full before:h-[20px] lg:before:h-[30px] before:pointer-events-none">
        <h3 className="text-[16px] lg:text-[18px] 2xl:text-[22px] text-white font-bold p-[20px] sm:p-[5px_10px] lg:p-[10px_15px] 2xl:p-[15px_30px] border-b-[1px] border-solid border-white/80">
          {loadingBranches ? (
            "Loading..."
          ) : (
            <>
              {nearbyBranchLocations?.length}{" "}
              {hasActiveFilters ? "Branches" : "Branches Near You"}
            </>
          )}
        </h3>
        <div className="max-sm:p-[20px] overflow-y-auto max-h-[280px] sm:max-h-[calc(100%-49px)] lg:max-h-[calc(100%-49px)] 2xl:max-h-[calc(100%-65px)]">
          {loadingBranches && (
            <div className="flex items-center justify-center gap-2 py-[30px] text-white text-[13px] 2xl:text-[16px]">
              <svg className="animate-spin size-5 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
              </svg>
              <span>Loading branches...</span>
            </div>
          )}
          {!loadingBranches && nearbyBranchLocations?.map((branch) => (
            <div
              key={branch.id}
              className={`max-sm:bg-[#7E94BC]/50 max-sm:rounded-[10px] max-sm:mb-[12px] last:mb-0 p-[15px_10px] sm:p-[10px_10px] lg:p-[20px_15px] 2xl:p-[20px_30px] cursor-pointer sm:border-b-[1px] border-solid border-white/10 loclist ${
                selectedBranch?.id === branch.id
                  ? "bg-[#f30000] max-sm:bg-[#f30000] active"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => {handleBranchClick(branch)
              }}
            >
              <div className="flex items-center justify-between mb-[15px] 2xl:mb-[20px] 3xl:mb-[30px]">
                <h4 className="text-[14px] lg:text-[16px] 2xl:text-[18px] leading-none line-clamp-1 text-white font-bold">
                  {toSentenceCase(branch?.name)}
                </h4>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${branch?.latitude},${branch?.longitude}`}
                  target="_blank"
                  className="text-[13px] lg:text-[12px] 2xl:text-[14px] 3xl:text-[16px] text-white bg-none transition-colors flex items-center gap-[4px] 2xl:gap-[6px]"
                >
                  <span>Get Direction</span>
                  <Image
                    src="/icons/direction_ext.svg"
                    alt="direction"
                    width={14}
                    height={14}
                    className={`w-[12px] lg:w-[14px] 2xl:w-[16px] aspect-square transition ${
                      selectedBranch?.id === branch.id
                        ? "filter-white"
                        : "filter-red"
                    }`}
                  />
                </a>
              </div>
              {branch?.address_1 && (
                <BranchLocationsInfo
                  type="address"
                  item={`${branch?.address_1} ${branch?.address_2} ${branch?.address_3}`}
                  selectedBranch={selectedBranch?.id}
                  branch={branch.id}
                />
              )}
              {branch.phone_no && (
                <BranchLocationsInfo
                  type="phone"
                  item={branch.phone_no}
                  selectedBranch={selectedBranch?.id}
                  branch={branch.id}
                />
              )}
              {branch.email && (
                <BranchLocationsInfo
                  type="email"
                  item={branch.email}
                  selectedBranch={selectedBranch?.id}
                  branch={branch.id}
                />
              )}
              {branch.mobile_no && (
                <BranchLocationsInfo
                  type="contactNumber"
                  item={branch.mobile_no}
                  selectedBranch={selectedBranch?.id}
                  branch={branch.id}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
