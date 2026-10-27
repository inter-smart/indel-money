"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api/axios";
import { useEffect, useState, useCallback } from "react";
import { toSentenceCase } from "@/lib/utils/toSentenceCase";

// Schema Validation
const formSchema = z.object({
  state: z.string().optional(),
  district: z.string().optional(),
  location: z.string().optional(),
  role: z.string().optional(),
});

const gridStyle =
  "w-full lg:w-[calc((100%-80px)/5)] xl:w-[calc((100%-140px)/5)] 2xl:w-[calc((100%-160px)/5)] 3xl:w-[calc((100%-220px)/5)] px-[5px] lg:px-[10px] 2xl:px-[15px] mb-[10px] lg:mb-0";

export default function FindJobForm({
  variant = "default",
  handleClearFilters,
  hasActiveFilters,
  button_link,
  button_text,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isDropdownsLoaded, setIsDropdownsLoaded] = useState(false);

  // Fetch all states and roles initially
  const fetchStatesAndRoles = useCallback(async () => {
    try {
      const { data } = await api.get("/career/jobs/dropdowns");
      setStates(data.data.states || []);
      setRoles(data.data.roles || []);
      setIsDropdownsLoaded(true);
    } catch (error) {
      console.error("Error fetching states/roles:", error);
      setIsDropdownsLoaded(true);
    }
  }, []);

  // Fetch districts for a state
  const fetchDistricts = useCallback(async (state_id) => {
    if (!state_id) {
      setDistricts([]);
      setLocations([]);
      return Promise.resolve();
    }
    try {
      const { data } = await api.get(`/career/districts/by_state/${state_id}`);
      setDistricts(data.data || []);
      setLocations([]);
      return Promise.resolve();
    } catch (error) {
      setDistricts([]);
      setLocations([]);
      return Promise.resolve();
    }
  }, []);

  // Fetch locations for a state and district
  const fetchLocations = useCallback(async (state_id, district_id) => {
    if (!state_id || !district_id) {
      setLocations([]);
      return Promise.resolve();
    }
    try {
      const { data } = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/career/locations/by_district_state`,
        {
          params: { state_id, district_id },
        }
      );
      setLocations(data.data || []);
      return Promise.resolve();
    } catch (error) {
      setLocations([]);
      return Promise.resolve();
    }
  }, []);

  // Define form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: "",
      district: "",
      location: "",
      role: "",
    },
  });

  // Initial sync with URL query params
  useEffect(() => {
    if (!isDropdownsLoaded) return;

    const state = searchParams.get("state_id") || "";
    const role = searchParams.get("role_id") || "";

    // Set state and role immediately (they're already loaded)
    form.setValue("state", state);
    form.setValue("role", role);

    // Fetch districts if state is present
    if (state) {
      fetchDistricts(state);
    }
  }, [searchParams, form, isDropdownsLoaded, fetchDistricts]);

  // Set district value when districts are loaded
  useEffect(() => {
    const district = searchParams.get("district_id") || "";
    const state = searchParams.get("state_id") || "";

    if (districts.length > 0 && district && state) {
      form.setValue("district", district);
      // Fetch locations when district is set
      fetchLocations(state, district);
    }
  }, [districts, searchParams, form, fetchLocations]);

  // Set location value when locations are loaded
  useEffect(() => {
    const location = searchParams.get("location_id") || "";

    if (locations.length > 0 && location) {
      form.setValue("location", location);
    }
  }, [locations, searchParams, form]);

  // When state/district changes, fetch children and reset lower fields
  const handleFormChange = useCallback(
    (field, value) => {
      if (field === "state") {
        form.setValue("state", value);
        form.setValue("district", "");
        form.setValue("location", "");
        fetchDistricts(value);
      } else if (field === "district") {
        const state = form.getValues("state");
        form.setValue("district", value);
        form.setValue("location", "");
        fetchLocations(state, value);
      } else if (field === "location") {
        form.setValue("location", value);
      } else if (field === "role") {
        form.setValue("role", value);
      }
    },
    [form, fetchDistricts, fetchLocations]
  );

  // Handle form submission
  function onSubmit(values) {
    const { state, district, location, role } = values;
    const params = {
      state_id: state,
      district_id: district,
      location_id: location,
      role_id: role,
    };
    // Filter out empty values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "")
    );
    const query = new URLSearchParams(filteredParams).toString();
    router.push(query ? `/career-list?${query}` : "/career-list");
  }

  // convert to Sentance Case

  useEffect(() => {
    fetchStatesAndRoles();
  }, [fetchStatesAndRoles]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`${
          variant === "activeJobs" ? "bg-base1 sm:bg-[#cae5f4]" : "bg-base1"
        } w-full flex flex-wrap items-center rounded-[20px] lg:rounded-[30px] 2xl:rounded-[36px] p-[20px_15px] sm:p-[15px_10px] lg:p-[20px_10px] 2xl:p-[25px_10px]`}
      >
        <div className="w-full lg:w-[80px] xl:w-[140px] 2xl:w-[160px] 3xl:w-[220px] px-[5px] lg:px-[10px] 2xl:px-[15px] mb-[10px] lg:mb-0 max-sm:hidden">
        {/* <div className="w-full lg:w-[80px] xl:w-[100px] 2xl:w-[100px] 3xl:w-[100px] px-[5px] lg:px-[10px] 2xl:px-[15px] mb-[10px] lg:mb-0 max-sm:hidden"> */}
          <div
            className={`${
              variant === "activeJobs" ? "text-[#4b4b4b]" : "text-white"
            } text-[14px] sm:text-[16px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] 3xl:text-[28px] font-bold`}
          >
            Filter
          </div>
        </div>
        {/* State */}
        <div className={gridStyle}>
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <SearchableSelect
                  onValueChange={(value) => handleFormChange("state", value)}
                  value={field.value || ""}
                  options={states.map((state) => ({ value: String(state?.value), label: toSentenceCase(state?.label) || "-" }))}
                  placeholder="-- Select state --"
                  emptyText="No state found"
                  className="w-full max-w-full max-sm:h-[40px] bg-white border-white rounded-[12px] lg:rounded-[12px] 2xl:rounded-[16px]"
                  contentClassName="bg-white border-white"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* District */}
        <div className={gridStyle}>
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <SearchableSelect
                  onValueChange={(value) => handleFormChange("district", value)}
                  value={field.value || ""}
                  disabled={!form.watch("state")}
                  options={(districts || []).map((district) => ({ value: String(district?.id), label: toSentenceCase(district?.district_name) || "-" }))}
                  placeholder="-- Select district --"
                  emptyText="No district found"
                  className="w-full max-w-full max-sm:h-[40px] bg-white border-white rounded-[12px] lg:rounded-[12px] 2xl:rounded-[16px]"
                  contentClassName="bg-white border-white"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Location */}
        <div className={gridStyle}>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <SearchableSelect
                  onValueChange={(value) => handleFormChange("location", value)}
                  value={field.value || ""}
                  disabled={!form.watch("district")}
                  options={locations.map((location) => ({ value: String(location?.id), label: toSentenceCase(location?.location_name) || "-" }))}
                  placeholder="-- Select location --"
                  emptyText="No location found"
                  className="text-ellipsis w-full max-w-full sm:h-full max-sm:h-[40px] bg-white border-white rounded-[11px]"
                  contentClassName="bg-white border-white"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Role */}
        <div className={gridStyle}>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <SearchableSelect
                  onValueChange={(value) => handleFormChange("role", value)}
                  value={field.value || ""}
                  options={(roles || []).map((role) => ({ value: String(role?.value), label: role?.label || "-" }))}
                  placeholder="-- Select dept. --"
                  emptyText="No department found"
                  className="w-full max-w-full max-sm:h-[40px] bg-white border-white rounded-[12px] lg:rounded-[12px] 2xl:rounded-[16px]"
                  contentClassName="bg-white border-white"
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Button */}
        <div className={gridStyle + " flex gap-2"}>
          <Button
            type="submit"
            size="sm"
            className="bg-[#cf2613] text-white px-4 py-2 rounded-[8px] min-w-[80px] hover:bg-[#b71c0c]"
          >
            SEARCH
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="bg-white border-[#cf2613] text-[#cf2613] px-4 py-2 rounded-[8px] min-w-[80px] hover:bg-[#ffe5e0] hover:text-[#b71c0c]"
            onClick={() => {
              form.reset();
              if (handleClearFilters) {
                handleClearFilters();
              }
            }}
          >
            CLEAR
          </Button>
        </div>
        <div className="max-sm:block mt-[8px] hidden w-full">
          <Link
            href={button_link ? button_link : "/career-list"}
            className="text-[14px] leading-[1] font-bold text-white h-[40px] flex items-center justify-center bg-base2 rounded-[24px] p-[4px] transition-color duration-300 hover:bg-base2/80 hover:[&>*-translate-x-[5px]]"
            onClick={() => form.reset()}
          >
            <span className="px-[10px] md:px-[10px] lg:px-[15px] 2xl:px-[20px]">
              {button_text ? button_text : "View All"}
            </span>
            <Image
              src="/images/icon-careerBtn.svg"
              alt="careerBtn"
              width={40}
              height="40"
              className="w-[25px] h-auto aspect-4/4 block ml-[5px]"
            />
            <span className="px-[10px] md:px-[10px] lg:px-[15px] px-[20px]">{button_text ? button_text : "View All"}</span>
            <Image
              src="/images/icon-careerBtn.svg"
              alt="careerBtn"
              width={40}
              height="40"
              className="w-[25px] h-auto aspect-4/4 block ml-[5px]"
            />
          </Link>
        </div>
      </form>
    </Form>
  );
}
