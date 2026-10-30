"use client";
import * as React from "react";
import { SearchableSelect } from "../ui/searchable-select";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toSentenceCase } from "@/lib/utils/toSentenceCase";

export default function BranchForm({
  states,
  districts,
  locations,
  selectedState,
  selectedDistrict,
  selectedLocation,
  selectedDistance,
  onValueChange,
  onOpenChange,
  isMobile,
  useQueryParams = true,
  loadingStates = false,
  loadingDistricts = false,
  loadingLocations = false,
}) {
  const router = useRouter();
  const [errors, setErrors] = React.useState({});

  const stateOptions = (states || []).map((state) => ({
    value: state?.value?.toString(),
    label: toSentenceCase(state?.label),
  }));
  const districtOptions = (districts || []).map((district) => ({
    value: district?.id?.toString(),
    label: toSentenceCase(district?.district_name),
  }));
  const locationOptions = (locations || []).map((location) => ({
    value: location?.id?.toString(),
    label: toSentenceCase(location?.location_name),
  }));
  const distanceOptions = ["20", "40", "60", "80", "100"].map((km) => ({
    value: km,
    label: `${km}km`,
  }));

  // Block opening a dropdown until the previous one is selected
  const blockDistrict = () => {
    if (selectedState) return false;
    setErrors((prev) => ({ ...prev, district: "Please select a state first" }));
    return true;
  };

  const blockLocation = () => {
    const message = !selectedState
      ? "Please select a state first"
      : !selectedDistrict
        ? "Please select a district first"
        : "";
    if (!message) return false;
    setErrors((prev) => ({ ...prev, location: message }));
    return true;
  };

  const handleStateChange = (value) => {
    setErrors({});
    onValueChange("state", value);
  };

  const handleDistrictChange = (value) => {
    setErrors((prev) => ({ ...prev, district: undefined, location: undefined }));
    onValueChange("district", value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isMobile && useQueryParams) {
      const queryParams = new URLSearchParams({
        ...(selectedState && { state: selectedState }),
        ...(selectedDistrict && { district: selectedDistrict }),
        ...(selectedLocation && { location: selectedLocation }),
        ...(selectedDistance && { distance: selectedDistance }),
      }).toString();
      router.push(`/branch-locator?${queryParams}`);
    }
  };

  const handleClearFilter = (e) => {
    e.preventDefault();
    setErrors({});
    // The parent owns URL reset (drops all query params).
    onValueChange("clear", true);
  };

  return (
    <form
      className="flex flex-wrap -mx-[10px] sm:-mx-[10px] 2xl:-mx-[15px]"
      onSubmit={handleSubmit}
    >
      {/* State */}
      <div className="w-1/2 md:w-1/5 p-[6px_10px] sm:p-[10px] 2xl:p-[15px]">
        <SearchableSelect
          value={selectedState}
          onValueChange={handleStateChange}
          options={stateOptions}
          placeholder="Select State"
          emptyText="No state found"
          loading={loadingStates}
          className="bg-[#e7eff9] border-[#e7eff9]"
          contentClassName="bg-[#e7eff9] border-[#e7eff9]"
        />
      </div>

      {/* District */}
      <div className="w-1/2 md:w-1/5 p-[6px_10px] sm:p-[10px] 2xl:p-[15px]">
        <SearchableSelect
          value={selectedDistrict}
          onValueChange={handleDistrictChange}
          options={districtOptions}
          placeholder="Select District"
          emptyText="No district found"
          loading={loadingDistricts}
          onBlockedOpen={blockDistrict}
          invalid={!!errors.district}
          className="bg-[#e7eff9] border-[#e7eff9]"
          contentClassName="bg-[#e7eff9] border-[#e7eff9]"
        />
        {errors.district && <p className="mt-1 text-[11px] text-red-600">{errors.district}</p>}
      </div>

      {/* Location */}
      <div className="w-1/2 md:w-1/5 p-[6px_10px] sm:p-[10px] 2xl:p-[15px]">
        <SearchableSelect
          value={selectedLocation}
          onValueChange={(value) => {
            setErrors((prev) => ({ ...prev, location: undefined }));
            onValueChange("location", value);
          }}
          options={locationOptions}
          placeholder="Select Location"
          emptyText="No location found"
          loading={loadingLocations}
          onBlockedOpen={blockLocation}
          invalid={!!errors.location}
          className="bg-[#e7eff9] border-[#e7eff9]"
          contentClassName="bg-[#e7eff9] border-[#e7eff9]"
        />
        {errors.location && <p className="mt-1 text-[11px] text-red-600">{errors.location}</p>}
      </div>

      {/* Distance */}
      <div className="w-1/2 md:w-1/5 p-[6px_10px] sm:p-[10px] 2xl:p-[15px]">
        <SearchableSelect
          value={selectedDistance}
          onOpenChange={onOpenChange}
          onValueChange={(value) => onValueChange("distance", value)}
          options={distanceOptions}
          placeholder="Select Distance"
          emptyText="No distance found"
          className="bg-[#e7eff9] border-[#e7eff9]"
          contentClassName="bg-[#e7eff9] border-[#e7eff9]"
        />
      </div>

      {/* Buttons */}
      <div className="w-full md:w-1/5 p-[6px_10px] sm:p-[10px] 2xl:p-[15px] flex items-center justify-center md:justify-end gap-2">
        {isMobile && useQueryParams && (
          <Button
            type="submit"
            className="btn btn-base2 max-w-[140px] lg:max-w-[160px] xl:max-w-[180px] 3xl:max-w-[220px]"
          >
            SEARCH
          </Button>
        )}
        <Button
          type="button"
          onClick={handleClearFilter}
          className="btn btn-base2 max-w-[140px] lg:max-w-[160px] xl:max-w-[180px] 3xl:max-w-[220px]"
        >
          CLEAR FILTER
        </Button>
      </div>
    </form>
  );
}
