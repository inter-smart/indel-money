"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import api from "@/lib/api/axios";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toSentenceCase } from "@/lib/utils/toSentenceCase";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/custom-alert-dialog";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = {
  pdf: { label: "PDF", mimes: ["application/pdf"] },
  doc: { label: "DOC", mimes: ["application/msword"] },
  docx: { label: "DOCX", mimes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] },
};
const FILE_ACCEPT = [".pdf", ".doc", ".docx", ...Object.values(ALLOWED_FILE_TYPES).flatMap((type) => type.mimes)].join(",");
const FILE_HINT = "PDF/DOC/DOCX, max 5MB";

const getFileExtension = (name) => (name?.includes(".") ? name.split(".").pop().toLowerCase() : "");

const noticePeriod = ["Less than 15 days", "15 to 30 days", "30 days", "60 to 90 days", "More than 90 days"];

// Schema Validation
const baseSchema = {
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  current_location: z.string().optional(),
  preferred_locations: z.array(z.string()).optional(),
  preferred_states: z.array(z.string()).min(1, { message: "Please select a state." }).max(1, { message: "Please select only one state." }),
  preferred_districts: z.array(z.string()).min(1, { message: "Please select a district." }).max(1, { message: "Please select only one district." }),
  preferred_role: z.string().min(1, { message: "Please select a preferred role." }),
  referred_employee_name: z.string().optional(),
  employee_referral_code: z.string().optional(),
  notice_period: z.enum(noticePeriod, {
    errorMap: () => ({ message: "Please select a valid notice period." }),
  }),
  current_salary: z
    .string()
    .regex(/^[1-9]\d{4}$/, {
      message: "Must be exactly 5 digits, cannot start with 0 or be all zeros.",
    })
    .optional(),

  expected_salary: z
    .string()
    .regex(/^[1-9]\d{4}$/, {
      message: "Must be exactly 5 digits, cannot start with 0 or be all zeros.",
    })
    .optional(),
  age: z
    .preprocess(
      (val) => {
        // Treat empty, null, undefined as invalid (not optional)
        if (val === "" || val === null || val === undefined) return "invalid";
        const num = Number(val);
        return isNaN(num) ? "invalid" : num;
      },
      z.number({ invalid_type_error: "Enter a valid age" }).max(99, "Enter a valid age"),
    )
    .optional(),
};

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits." })
    .regex(/^\d{6}$/, { message: "OTP must be numeric." }),
});

function CareerFormInner({ jobId, isGeneral }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    locations: [],
    roles: [],
    states: [],
    districts: [],
  });
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [isStatesDropdownOpen, setIsStatesDropdownOpen] = useState(false);
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");
  const [isDistrictsDropdownOpen, setIsDistrictsDropdownOpen] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [isLocationsDropdownOpen, setIsLocationsDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [isDraggingMobile, setIsDraggingMobile] = useState(false);
  const [isDraggingDesktop, setIsDraggingDesktop] = useState(false);

  // 1. ADD NEW STATE VARIABLES (add these to your existing state declarations)
  const [verifiedEmail, setVerifiedEmail] = useState(""); // Store the verified email
  const [currentEmailInForm, setCurrentEmailInForm] = useState(""); // Track current email in form

  // File type display helper
  const getFileTypeDisplay = (file, fileName) => {
    const extension = getFileExtension(file ? file.name : fileName);
    return ALLOWED_FILE_TYPES[extension]?.label || extension.toUpperCase();
  };

  const formSchema = useMemo(() => {
    return z
      .object({
        ...baseSchema,
        preferred_role_name: z.string().optional(), // Add this line
        file:
          selectedFile || selectedFileName
            ? z.any().optional()
            : z.any().refine((file) => file instanceof File, {
                message: "Please upload a resume.",
              }),
      })
      .refine(
        (data) => {
          // Only require preferred_role_name if isGeneral and preferred_role is "Others"
          if (isGeneral) {
            return data.preferred_role_name && data.preferred_role_name.trim().length > 0;
          }
          return true;
        },
        {
          message: "Please enter a role name.",
          path: ["preferred_role_name"],
        },
      );
  }, [selectedFile, selectedFileName, isGeneral]);

  // Forms
  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      preferred_locations: [],
      preferred_states: [],
      preferred_districts: [],
      current_location: "",
      referred_employee_name: "",
      employee_referral_code: "",
      age: "",
      preferred_role: isGeneral ? "" : jobId?.toString() || "",
      notice_period: "",
      current_salary: "",
      expected_salary: "",
      file: null,
    },
  });

  // Fetch dropdowns
  const fetchDropdowns = async () => {
    try {
      let endpoint = "/career/jobs/dropdowns";

      // If jobId is provided, fetch job-specific states and locations
      if (jobId && !isGeneral) {
        endpoint = `/career/jobs/${jobId}/dropdowns`;
      }

      const { data } = await api.get(endpoint);

      if (!data.success) throw new Error(data.message || "Failed to fetch dropdowns");

      // If job-specific data is available, use it; otherwise fallback to all data
      const dropdownData = data.data || { locations: [], roles: [], states: [] };

      // If job-specific states are available, use them; otherwise use all states
      let states = dropdownData.job_states || dropdownData.states || [];
      let locations = dropdownData.job_locations || dropdownData.locations || [];
      const roles = dropdownData.roles || [];

      // Ensure states have the correct format (value and label)
      if (states.length > 0 && states[0].id && !states[0].value) {
        states = states.map((state) => ({
          value: state.id,
          label: state.state_name || state.name || state.label,
        }));
      }

      // Ensure locations have the correct format (id and location_name)
      if (locations.length > 0 && locations[0].id) {
        // Locations are already in the correct format
        locations = locations;
      }

      setDropdowns({
        states: states,
        locations: locations,
        roles: roles,
        districts: [],
      });
      setDropdownsLoaded(true);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);

      // Fallback to general dropdowns if job-specific fails
      if (jobId && !isGeneral) {
        try {
          const { data } = await api.get("/career/jobs/dropdowns");
          if (data.success) {
            setDropdowns(data.data || { locations: [], roles: [], states: [], districts: [] });
            setDropdownsLoaded(true);
            return;
          }
        } catch (fallbackError) {
          console.error("Error fetching fallback dropdowns:", fallbackError);
        }
      }

      toast.error("Failed to load dropdown options");
    }
  };

  // Fetch districts by state ID (single state)
  const fetchDistrictsByStates = async (stateIds) => {
    if (!stateIds || stateIds.length === 0) {
      setDropdowns((prev) => ({ ...prev, districts: [], locations: [] }));
      return;
    }

    try {
      setDistrictsLoading(true);
      // Use first state only since we only allow one state
      const stateId = stateIds[0];

      const { data } = await api.get(`/career/districts/by_state/${stateId}`);

      if (!data.success) throw new Error(data.message || "Failed to fetch districts");

      setDropdowns((prev) => ({ ...prev, districts: data.data || [] }));
    } catch (error) {
      console.error("Error fetching districts by state:", error);
      toast.error("Failed to load districts for selected state");
    } finally {
      setDistrictsLoading(false);
    }
  };

  // Fetch locations by state IDs and district IDs (for general applications)
  // OR just by state IDs (for job-specific applications)
  const fetchLocationsByStatesAndDistricts = async (stateIds, districtIds) => {
    if (!stateIds || stateIds.length === 0) {
      setDropdowns((prev) => ({ ...prev, locations: [] }));
      return;
    }

    try {
      setLocationsLoading(true);
      const stateIdsParam = stateIds.join(",");

      // For general applications, use state and district filtering
      const districtIdsParam = districtIds.join(",");

      const endpoint = `/career/locations/by_district_state?state_id=${stateIdsParam}&district_id=${districtIdsParam}`;

      const { data } = await api.get(endpoint);

      if (!data.success) throw new Error(data.message || "Failed to fetch locations");

      setDropdowns((prev) => ({ ...prev, locations: data.data || [] }));
    } catch (error) {
      console.error("Error fetching locations:", error);

      // Fallback to general locations if job-specific fails
      if (jobId && !isGeneral) {
        try {
          const stateIdsParam = stateIds.join(",");
          const { data } = await api.get(`/career/locations/by_state?state_ids=${stateIdsParam}`);
          if (data.success) {
            setDropdowns((prev) => ({ ...prev, locations: data.data || [] }));
            return;
          }
        } catch (fallbackError) {
          console.error("Error fetching fallback locations:", fallbackError);
        }
      }

      toast.error("Failed to load locations");
    } finally {
      setLocationsLoading(false);
    }
  };

  // Filter states based on search term
  const filteredStates = dropdowns.states.filter((state) =>
    (state.label || state.state_name || state.name)?.toLowerCase().includes(stateSearchTerm.toLowerCase()),
  );

  // Filter districts based on search term
  const filteredDistricts = dropdowns.districts
    .filter((district) => district.district_name?.toLowerCase().includes(districtSearchTerm.toLowerCase()))
    .sort((a, b) => a.district_name.localeCompare(b.district_name));

  // Filter locations based on search term
  const filteredLocations = dropdowns.locations
    .filter((location) => location.location_name?.toLowerCase().includes(locationSearchTerm.toLowerCase()))
    .sort((a, b) => a.location_name.localeCompare(b.location_name));

  // Auto-fill form
  const autoFillForm = (data) => {
    const validatedData = {
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      preferred_locations: data.preferred_locations || [],
      preferred_states: data.preferred_states || [],
      preferred_districts: data.preferred_districts || [],
      current_location: data.current_location || "",
      referred_employee_name: data.referred_employee_name || "",
      employee_referral_code: data.employee_referral_code || "",
      age: data.age?.toString() || "",
      preferred_role: isGeneral ? data.preferred_role?.toString() || "" : jobId?.toString() || "",
      preferred_role_name: data.preferred_role_name || "",
      notice_period: noticePeriod.includes(data.notice_period) ? data.notice_period : "",
      current_salary: data.current_salary?.toString() || "",
      expected_salary: data.expected_salary?.toString() || "",
      file: null,
    };

    console.log("Auto-filling form with data:", validatedData);

    form.reset(validatedData);

    // If preferred_states are loaded, fetch corresponding districts
    if (validatedData.preferred_states && validatedData.preferred_states.length > 0) {
      fetchDistrictsByStates(validatedData.preferred_states);
    }

    // If preferred_districts are loaded, fetch corresponding locations
    if (
      validatedData.preferred_states &&
      validatedData.preferred_states.length > 0 &&
      validatedData.preferred_districts &&
      validatedData.preferred_districts.length > 0
    ) {
      fetchLocationsByStatesAndDistricts(validatedData.preferred_states, validatedData.preferred_districts);
    }
  };

  // Check cookies
  useEffect(() => {
    fetchDropdowns();
  }, []);

  // Watch for changes in preferred_states and fetch districts/locations
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "preferred_states" && value.preferred_states) {
        form.setValue("preferred_districts", []);
        form.setValue("preferred_locations", []);

        // Fetch districts for selected states
        fetchDistrictsByStates(value.preferred_states);
      }
      if (name === "preferred_districts" && value.preferred_districts) {
        // Clear selected locations when districts change
        form.setValue("preferred_locations", []);
        // Fetch locations for selected states and districts
        const selectedStates = form.getValues("preferred_states");
        if (selectedStates && selectedStates.length > 0 && value.preferred_districts.length > 0) {
          fetchLocationsByStatesAndDistricts(selectedStates, value.preferred_districts);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, isGeneral]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isStatesDropdownOpen && !event.target.closest(".states-dropdown")) {
        setIsStatesDropdownOpen(false);
        setStateSearchTerm("");
      }
      if (isDistrictsDropdownOpen && !event.target.closest(".districts-dropdown")) {
        setIsDistrictsDropdownOpen(false);
        setDistrictSearchTerm("");
      }
      if (isLocationsDropdownOpen && !event.target.closest(".locations-dropdown")) {
        setIsLocationsDropdownOpen(false);
        setLocationSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStatesDropdownOpen, isDistrictsDropdownOpen, isLocationsDropdownOpen]);

  useEffect(() => {
    if (dropdownsLoaded) {
      const savedData = Cookies.get("applicantData");

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        setEmail(parsedData.email);
        setSelectedFileName(parsedData.file || null);
        setVerifiedEmail(parsedData.email); // Set verified email
        setCurrentEmailInForm(parsedData.email); // Set current form email

        // Don't auto-fill states, districts and locations for job-specific applications
        if (jobId && !isGeneral) {
          // Remove states, districts and locations from auto-fill data
          const filteredData = { ...parsedData };
          delete filteredData.preferred_states;
          delete filteredData.preferred_districts;
          delete filteredData.preferred_locations;
          autoFillForm(filteredData);
        } else {
          // Auto-fill everything for general applications
          autoFillForm(parsedData);
        }

        setIsOtpVerified(true);
      }
    }
  }, [dropdownsLoaded, jobId, isGeneral]);

  // Handle email submission
  const handleEmailSubmit = async (values) => {
    try {
      setLoading(true);
      const { data } = await api.post("/web/careers/send-otp", {
        email: values.email,
      });

      if (!data.success) throw new Error(data.message || "Failed to send OTP");
      setEmail(values.email);
      form.setValue("email", values.email, { shouldValidate: true });
      setShowOtpInput(true);

      toast.success("OTP sent to your email");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const handleOtpSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = { email, otp: values.otp.trim() };

      const { data } = await api.post("/web/careers/verify-otp", payload);

      if (!data.success) throw new Error(data.message || "Invalid OTP");
      if (data.data) {
        // Don't auto-fill states, districts and locations for job-specific applications
        if (jobId && !isGeneral) {
          // Remove states, districts and locations from auto-fill data
          const filteredData = { ...data.data };
          delete filteredData.preferred_states;
          delete filteredData.preferred_districts;
          delete filteredData.preferred_locations;
          autoFillForm(filteredData);

          // Save filtered data to cookie
          Cookies.set("applicantData", JSON.stringify(filteredData), {
            expires: 7,
            sameSite: "strict",
          });
        } else {
          // Auto-fill everything for general applications
          autoFillForm(data.data);
          Cookies.set("applicantData", JSON.stringify(data.data), {
            expires: 7,
            sameSite: "strict",
          });
        }
      }
      setIsOtpVerified(true);
      setIsModalOpen(false);
      setVerifiedEmail(email); // Store the verified email
      setCurrentEmailInForm(email); //
      form.trigger("email");
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (newEmail) => {
    setCurrentEmailInForm(newEmail);

    // If email is different from verified email, mark as not verified and clear cookie
    if (newEmail !== verifiedEmail) {
      setIsOtpVerified(false);

      // Clear the cookie when email changes
      Cookies.remove("applicantData");

      // Reset file selection since cookie data is cleared
      setSelectedFile(null);
      setSelectedFileName(null);

      // Reset verification states
      setVerifiedEmail("");
      setShowOtpInput(false);

      // Set the new email and open the modal for verification
      setEmail(newEmail);
      setIsModalOpen(true);

      // Reset the email form with the new email
      emailForm.reset({ email: newEmail });
    } else {
      // If email matches verified email, mark as verified
      setIsOtpVerified(true);
    }
  };

  // Handle form submission
  const onSubmit = async (values) => {
    // Check if email has changed and needs re-verification
    if (values.email !== verifiedEmail && !isOtpVerified) {
      toast.error("Please verify your email before submitting the form.");
      setEmail(values.email); // Set the new email for OTP
      setIsModalOpen(true);
      return;
    }

    if (!isOtpVerified) {
      toast.error("Please verify OTP before submitting the form.");
      setIsModalOpen(true);
      return;
    }

    const recaptchaToken = await executeRecaptcha("job_form");

    if (!recaptchaToken) {
      toast.error("Failed to get reCAPTCHA token. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("applicant[name]", values.name);
    formData.append("applicant[email]", values.email);
    formData.append("applicant[phone]", values.phone);
    // Append preferred locations as array
    values.preferred_locations.forEach((location) => {
      formData.append("applicant[preferred_locations][]", location);
    });
    // Append preferred states as array
    values.preferred_states.forEach((state) => {
      formData.append("applicant[preferred_states][]", state);
    });
    // Append preferred districts as array
    values.preferred_districts.forEach((district) => {
      formData.append("applicant[preferred_districts][]", district);
    });
    formData.append("applicant[current_location]", values.current_location || "");
    formData.append("applicant[referred_employee_name]", values.referred_employee_name || "");
    formData.append("applicant[employee_referral_code]", values.employee_referral_code || "");
    if (values.age !== null && !isNaN(values.age) && values.age > 0) {
      formData.append("applicant[age]", values.age.toString());
    }
    formData.append("applicant[notice_period]", values.notice_period);
    formData.append("applicant[current_salary]", values.current_salary || "");
    formData.append("applicant[expected_salary]", values.expected_salary || "");
    // Append reCAPTCHA token
    formData.append("recaptcha", recaptchaToken);

    if (selectedFile) {
      formData.append("applicant[file]", selectedFile);
    }
    formData.append("applicant[is_active]", "true");

    const apiUrl = isGeneral ? "/web/careers/general_application" : "/web/careers/job_application";
    if (isGeneral) {
      formData.append("general_application[role_id]", values.preferred_role);
      formData.append("general_application[preferred_role_name]", values.preferred_role_name);
    } else {
      formData.append("job_application[job_id]", jobId || "");
    }

    try {
      setLoading(true);

      const response = await api.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) throw new Error(response.data.message || "Failed to submit application");

      const existingCookieRaw = Cookies.get("applicantData");
      const existingCookie = existingCookieRaw ? JSON.parse(existingCookieRaw) : {};

      const cookieData = {
        ...values,
        file: selectedFile ? selectedFile.name : selectedFileName,
        ...(!isGeneral && {
          preferred_states: existingCookie.preferred_states ?? values.preferred_states,
          preferred_districts: existingCookie.preferred_districts ?? values.preferred_districts,
          preferred_locations: existingCookie.preferred_locations ?? values.preferred_locations,
          preferred_role: existingCookie.preferred_role ?? "",
          preferred_role_name: existingCookie.preferred_role_name ?? "",
        }),
      };

      Cookies.set("applicantData", JSON.stringify(cookieData), {
        expires: 7,
        sameSite: "strict",
      });

      // form.reset();
      setSelectedFile(null);
      // setIsOtpVerified(false);
      // setEmail("");
      emailForm.reset();
      otpForm.reset();
      setShowOtpInput(false);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error submitting form:", err);
      const status = err?.response?.status;
      const data = err?.response?.data;
      const message =
        data?.error?.message ||
        data?.message ||
        (status === 413
          ? "The uploaded file is too large."
          : err?.request && !err?.response
            ? "Network error. Please check your connection and try again."
            : err?.message) ||
        "Failed to submit application.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const rejectFile = (message) => {
    toast.error(message);
    form.setError("file", { type: "manual", message });
    return false;
  };

  const validateAndSetFile = (file) => {
    if (file) {
      const allowedType = ALLOWED_FILE_TYPES[getFileExtension(file.name)];
      // Some browsers/OSes send an empty or generic type for Word files, so the extension is the primary check
      if (!allowedType || (file.type && file.type !== "application/octet-stream" && !allowedType.mimes.includes(file.type))) {
        return rejectFile("Please upload a PDF, DOC or DOCX file");
      }
      if (file.size === 0) {
        return rejectFile("The selected file is empty");
      }
      if (file.size > MAX_FILE_SIZE) {
        return rejectFile("File size should be less than 5MB");
      }
      setSelectedFile(file);
      setSelectedFileName(file.name);
      form.setValue("file", file);
      form.clearErrors("file");
      return true;
    }
    return false;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    validateAndSetFile(file);
    // Allow re-selecting the same file after a rejection
    event.target.value = "";
  };

  const handleDrop = (event, isDesktop) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    validateAndSetFile(file);
    isDesktop ? setIsDraggingDesktop(false) : setIsDraggingMobile(false);
  };

  const handleDragOver = (event, isDesktop) => {
    event.preventDefault();
    isDesktop ? setIsDraggingDesktop(true) : setIsDraggingMobile(true);
  };

  const handleDragLeave = (event, isDesktop) => {
    event.preventDefault();
    isDesktop ? setIsDraggingDesktop(false) : setIsDraggingMobile(false);
  };

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      {/* Email Verification Modal */}
      <AlertDialog open={isModalOpen} onOpenChange={() => {}}>
        <AlertDialogContent>
          <div className="w-full min-w-[340px] sm:min-w-[360px] md:min-w-[376px] lg:min-w-[420px] xl:min-w-[468px] 2xl:min-w-[576px] 3xl:min-w-[668px] bg-[#dceafb] rounded-[15px] lg:rounded-[30px] 2xl:rounded-[36px] p-[20px_25px] lg:p-[20px_30px] xl:p-[30px_50px] 2xl:p-[40px_60px] 3xl:p-[50px_80px] relative z-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[18px] sm:text-[22px] lg:text-[26px] xl:text-[32px] 2xl:text-[38px] 3xl:text-[48px] text-black font-bold flex items-center mb-[10px] lg:mb-[15px] 2xl:mb-[20px]">
                Verify Your Email
              </AlertDialogTitle>
              <AlertDialogDescription className="sr-only">Please verify your email address to continue with the application.</AlertDialogDescription>

              <div className="mt-4">
                {!showOtpInput ? (
                  <Form {...emailForm} key="email-form">
                    <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base1 focus:border-transparent text-gray-900 text-sm bg-white"
                                placeholder="Enter your email address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-base1 text-white hover:bg-base1/90 transition-colors duration-300 py-2 px-4 rounded-md font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                            </svg>
                            Sending OTP...
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...otpForm} key="otp-form">
                    <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        We\'ve sent a 6-digit verification code to <strong>{email}</strong>
                      </div>
                      <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-base1 focus:border-transparent text-gray-900 text-sm bg-white text-center text-lg tracking-widest"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-base1 text-white hover:bg-base1/90 transition-colors duration-300 py-2 px-4 rounded-md font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                            </svg>
                            Verifying...
                          </span>
                        ) : (
                          "Verify OTP"
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setShowOtpInput(false)}
                        className="w-full text-sm text-base1 hover:text-base1/80 transition-colors duration-300"
                      >
                        Change Email Address
                      </button>
                    </form>
                  </Form>
                )}
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setIsModalOpen(false)}
                className="sm:text-[12px] 2xl:text-[14px] 3xl:text-[16px] focus:outline-0 flex gap-[4px] lg:gap-[6px] 2xl:gap-[10px] absolute z-0 top-[15px] xl:top-[20px] 2xl:top-[25px] 3xl:top-[30px] right-[15px] xl:right-[20px] 2xl:right-[25px] 3xl:right-[30px] transition-color cursor-pointer hover:text-base2"
              >
                <span className="hidden sm:block">Close</span>
                <Image src="/images/modal-cancel.svg" alt="modal-cancel" width={20} height={20} className="w-[15px] lg:w-[20px]" />
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Form */}
      <div className={`transition-opacity duration-300`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap -mx-1 lg:-mx-6.5 2xl:-mx-2.5">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="mb-5 w-full mx-1.5">
                  <FormControl>
                    <div
                      className={`max-sm:flex items-center hidden p-2.5 bg-white bg-custom-svg w-full ${
                        isDraggingMobile ? "border-2 border-blue-500 rounded-lg" : ""
                      }`}
                      onDragOver={(e) => handleDragOver(e, false)}
                      onDragLeave={(e) => handleDragLeave(e, false)}
                      onDrop={(e) => handleDrop(e, false)}
                    >
                      <div className="w-20 lg:w-28 shrink-0">
                        <label className="text-xs lg:text-sm leading-none font-normal w-20 lg:w-28 h-10 flex items-center p-2.5 lg:p-3.5 bg-base1 rounded-2.5 cursor-pointer hover:bg-[#c8e1ff] transition-colors duration-300">
                          <Image
                            src="/images/icon-upload.svg"
                            alt="icon-upload"
                            width={21}
                            height={16}
                            className="w-[14px] lg:w-[24px] filter brightness-0 invert"
                          />
                          <span className="font-medium ml-1 lg:ml-1.5 text-white">Upload Resume</span>
                          <input
                            type="file"
                            name="file"
                            accept={FILE_ACCEPT}
                            className="hidden"
                            onChange={handleFileChange}
                            // disabled={!isOtpVerified}
                          />
                        </label>
                      </div>
                      <div className="text-xs leading-normal font-normal pl-[10px] lg:pl-[14px] text-gray-700 break-all min-w-0 flex-1">
                        {selectedFile
                          ? `${selectedFile.name} (${getFileTypeDisplay(selectedFile, null)})`
                          : selectedFileName
                            ? `${selectedFileName.replace("uploads/job-applications/", "")} (${getFileTypeDisplay(null, selectedFileName)})`
                            : `(${FILE_HINT})`}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <div className="w-full px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Name*</label>
                    <FormControl>
                      <Input
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Phone Number*</label>
                    <FormControl>
                      <Input
                        type="tel"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Email*</label>
                    <FormControl>
                      <Input
                        type="email"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleEmailChange(e.target.value);
                        }}
                        onFocus={() => {
                          if (!isOtpVerified || field.value !== verifiedEmail) {
                            setEmail(field.value);
                            setIsModalOpen(true);
                          }
                        }}
                        // disabled={isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              {/* Current Location Field */}
              <FormField
                control={form.control}
                name="current_location"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Current Location</label>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter current location"
                      className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      // disabled={!isOtpVerified}
                    />
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Age</label>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter age"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            {/* Preferred State Field */}
            <div className="w-full px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="preferred_states"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Preferred State*</label>
                    <div className="relative states-dropdown">
                      {/* Custom Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsStatesDropdownOpen(!isStatesDropdownOpen)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-xs bg-white text-left flex items-center justify-between"
                        // disabled={!isOtpVerified}
                      >
                        <span className="text-gray-500 truncate">
                          {field.value && field.value.length > 0
                            ? (() => {
                                const state = dropdowns.states.find((st) => String(st.value) === field.value[0]);
                                return toSentenceCase(state?.label || state?.state_name || state?.name) || field.value[0];
                              })()
                            : "Choose Preferred State*"}
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${isStatesDropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Custom Dropdown Content */}
                      {isStatesDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                          {/* Search Input Inside Dropdown */}
                          <div className="p-2 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search states..."
                              value={stateSearchTerm}
                              onChange={(e) => setStateSearchTerm(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          </div>

                          {/* States List */}
                          <div className="max-h-48 overflow-y-auto">
                            {filteredStates.length > 0 ? (
                              filteredStates.map((state) => {
                                const isSelected = field.value?.includes(String(state.value));
                                return (
                                  <button
                                    key={state.value}
                                    type="button"
                                    onClick={() => {
                                      // Only allow selecting one state
                                      field.onChange([String(state.value)]);
                                      setStateSearchTerm("");
                                      setIsStatesDropdownOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-100 flex items-center justify-between ${
                                      isSelected ? "bg-blue-50 text-blue-700" : "text-gray-900"
                                    }`}
                                  >
                                    <span>{toSentenceCase(state.label || state.state_name || state.name) || "-"}</span>
                                    {isSelected && (
                                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </button>
                                );
                              })
                            ) : stateSearchTerm ? (
                              <div className="px-3 py-2 text-xs text-gray-500">No states match "{stateSearchTerm}"</div>
                            ) : (
                              <div className="px-3 py-2 text-xs text-gray-500">No states available</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="preferred_districts"
                render={({ field }) => {
                  const selectedStates = form.watch("preferred_states") || [];
                  const hasSelectedStates = selectedStates.length > 0;

                  return (
                    <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                      <label className="text-[10px] text-gray-600 font-medium block">Preferred District*</label>
                      <div className="relative districts-dropdown">
                        {/* Custom Dropdown Trigger */}
                        <button
                          type="button"
                          onClick={() => hasSelectedStates && !districtsLoading && setIsDistrictsDropdownOpen(!isDistrictsDropdownOpen)}
                          disabled={!hasSelectedStates || districtsLoading}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-xs text-left flex items-center justify-between ${
                            !hasSelectedStates || districtsLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          <span className="text-gray-500 truncate">
                            {!hasSelectedStates
                              ? "Select states first"
                              : districtsLoading
                                ? "Loading districts..."
                                : field.value && field.value.length > 0
                                  ? (() => {
                                      const district = dropdowns.districts.find((dist) => String(dist.id) == String(field.value[0]));
                                      return toSentenceCase(district?.district_name) || field.value[0];
                                    })()
                                  : "Choose Preferred District*"}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${isDistrictsDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Custom Dropdown Content */}
                        {isDistrictsDropdownOpen && hasSelectedStates && !districtsLoading && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                            {/* Search Input Inside Dropdown */}
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search districts..."
                                value={districtSearchTerm}
                                onChange={(e) => setDistrictSearchTerm(e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>

                            {/* Districts List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredDistricts.length > 0 ? (
                                filteredDistricts.map((district) => {
                                  const isSelected = field.value?.includes(String(district.id));
                                  return (
                                    <button
                                      key={district.id}
                                      type="button"
                                      onClick={() => {
                                        // Only allow selecting one district
                                        field.onChange([String(district.id)]);
                                        setDistrictSearchTerm("");
                                        setIsDistrictsDropdownOpen(false);
                                      }}
                                      className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-100 flex items-center justify-between ${
                                        isSelected ? "bg-blue-50 text-blue-700" : "text-gray-900"
                                      }`}
                                    >
                                      <span>{toSentenceCase(district.district_name) || "-"}</span>
                                      {isSelected && (
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                  );
                                })
                              ) : districtSearchTerm ? (
                                <div className="px-3 py-2 text-xs text-gray-500">No districts match "{districtSearchTerm}"</div>
                              ) : (
                                <div className="px-3 py-2 text-xs text-gray-500">No districts available</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="w-full px-1 lg:px-1.5 2xl:px-2.5">
              {/* Preferred Locations Field */}
              <FormField
                control={form.control}
                name="preferred_locations"
                render={({ field }) => {
                  const selectedStates = form.watch("preferred_states") || [];
                  const selectedDistricts = form.watch("preferred_districts") || [];
                  const hasSelectedStates = selectedStates.length > 0;
                  const hasSelectedDistricts = selectedDistricts.length > 0;
                  const canSelectLocations = isGeneral ? hasSelectedStates && hasSelectedDistricts : hasSelectedStates;

                  return (
                    <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                      <label className="text-[10px] text-gray-600 font-medium block">Preferred Locations*</label>
                      <div className="relative locations-dropdown">
                        {/* Custom Dropdown Trigger */}
                        <button
                          type="button"
                          onClick={() => canSelectLocations && !locationsLoading && setIsLocationsDropdownOpen(!isLocationsDropdownOpen)}
                          disabled={!canSelectLocations || locationsLoading}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-xs text-left flex items-center justify-between ${
                            !canSelectLocations || locationsLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                          }`}
                        >
                          <span className="text-gray-500 truncate">
                            {!hasSelectedStates
                              ? "Select states first"
                              : isGeneral && !hasSelectedDistricts
                                ? "Select districts first"
                                : locationsLoading
                                  ? "Loading locations..."
                                  : field.value && field.value.length > 0
                                    ? (() => {
                                        const selectedLocations = field.value.map((locationId) => {
                                          const location = dropdowns.locations.find((loc) => String(loc.id) == String(locationId));
                                          return toSentenceCase(location?.location_name) || locationId;
                                        });

                                        if (selectedLocations.length === 1) {
                                          return selectedLocations[0];
                                        } else if (selectedLocations.length <= 2) {
                                          return selectedLocations.join(", ");
                                        } else {
                                          return `${selectedLocations.slice(0, 2).join(", ")}... (+${selectedLocations.length - 2} more)`;
                                        }
                                      })()
                                    : "Preferred Locations*"}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${isLocationsDropdownOpen ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Custom Dropdown Content */}
                        {isLocationsDropdownOpen && canSelectLocations && !locationsLoading && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                            {/* Search Input Inside Dropdown */}
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                placeholder="Search locations..."
                                value={locationSearchTerm}
                                onChange={(e) => setLocationSearchTerm(e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>

                            {/* Locations List */}
                            <div className="max-h-48 overflow-y-auto">
                              {filteredLocations.length > 0 ? (
                                filteredLocations.map((location) => {
                                  const isSelected = field.value?.includes(String(location.id));
                                  return (
                                    <button
                                      key={location.id}
                                      type="button"
                                      onClick={() => {
                                        const currentValues = field.value || [];
                                        if (isSelected) {
                                          // Deselect if already selected
                                          field.onChange(currentValues.filter((v) => v !== String(location.id)));
                                        } else {
                                          // Select if not selected
                                          field.onChange([...currentValues, String(location.id)]);
                                        }
                                        setLocationSearchTerm("");
                                      }}
                                      className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-100 flex items-center justify-between ${
                                        isSelected ? "bg-blue-50 text-blue-700" : "text-gray-900"
                                      }`}
                                    >
                                      <span>{toSentenceCase(location.location_name) || "-"}</span>
                                      {isSelected && (
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    </button>
                                  );
                                })
                              ) : locationSearchTerm ? (
                                <div className="px-3 py-2 text-xs text-gray-500">No locations match "{locationSearchTerm}"</div>
                              ) : (
                                <div className="px-3 py-2 text-xs text-gray-500">No locations available</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="referred_employee_name"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Referred Employee Name</label>
                    <FormControl>
                      <Input
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter Referred Employee Name"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="employee_referral_code"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Employee Referral Code</label>
                    <FormControl>
                      <Input
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter Employee Referral Code"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            {isGeneral && (
              <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
                <FormField
                  control={form.control}
                  name="preferred_role"
                  render={({ field }) => {
                    console.log("field.value:", field.value, typeof field.value);
                    console.log("roles:", dropdowns.roles);
                    console.log(
                      "selected role:",
                      dropdowns.roles.find((r) => String(r.value) === String(field.value)),
                    );

                    return (
                      <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                        <label className="text-[10px] text-gray-600 font-medium block">Department*</label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Choose Department*" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-300">
                            {dropdowns.roles.map((role) => (
                              <SelectItem key={role.value} value={String(role.value)}>
                                {role.label || "-"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}
            {isGeneral && (
              <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
                <FormField
                  control={form.control}
                  name="preferred_role_name"
                  render={({ field }) => (
                    <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                      <label className="text-[10px] text-gray-600 font-medium block">Preferred Role*</label>
                      <FormControl>
                        <Input
                          className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter Preferred Role*"
                          {...field}
                          // disabled={!isOtpVerified}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="w-full px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="notice_period"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Notice Period*</label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      // disabled={!isOtpVerified}
                    >
                      <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Choose Notice Period*" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        {noticePeriod.map((notice) => (
                          <SelectItem key={notice} value={notice}>
                            {notice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5">
              <FormField
                control={form.control}
                name="current_salary"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Current Monthly Salary*</label>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        pattern="\d*"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter Current Monthly Salary*"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 px-1 lg:px-1.5 2xl:px-2.5 mb-1.5 lg:mb-2.5 2xl:mb-3.5">
              <FormField
                control={form.control}
                name="expected_salary"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <label className="text-[10px] text-gray-600 font-medium block">Expected Monthly Salary*</label>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        pattern="\d*"
                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter Expected Monthly Salary*"
                        {...field}
                        // disabled={!isOtpVerified}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div
              className={`max-sm:hidden w-full px-[4px] lg:px-[6px] 2xl:px-[10px] mb-[10px] lg:mb-0 ${
                isDraggingDesktop ? "border-2 border-blue-500 rounded-lg" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, true)}
              onDragLeave={(e) => handleDragLeave(e, true)}
              onDrop={(e) => handleDrop(e, true)}
            >
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="mb-2 xl:mb-3 2xl:mb-4">
                    <FormControl>
                      <div className="flex items-center">
                        <label className="shrink-0 text-[12px] lg:text-[12px] 2xl:text-[16px] 3xl:text-[18px] leading-none font-normal text-[#373737] w-[100px] lg:w-[110px] 2xl:w-[120px] 3xl:w-[145px] h-[30px] lg:h-[35px] xl:h-[40px] 2xl:h-[45px] 3xl:h-[50px] flex items-center p-[4px_10px] lg:p-[10px_15px] 3xl:p-[10px_25px] bg-[#b3d5ff] rounded-full cursor-pointer hover:bg-[#c8e1ff] transition-background duration-300">
                          <Image src="/images/icon-upload.svg" alt="icon-upload" width={26} height={21} />
                          <span className="font-medium ml-1 lg:ml-1.5">Upload Resume*</span>
                          <input
                            type="file"
                            accept={FILE_ACCEPT}
                            className="hidden"
                            onChange={handleFileChange}
                            // disabled={!isOtpVerified}
                          />
                        </label>
                        <span className="text-xs lg:text-xs 2xl:text-base leading-snug font-normal text-gray-700 break-all min-w-0 flex-1 ml-1 lg:ml-1.5">
                          {selectedFile
                            ? `${selectedFile.name} (${getFileTypeDisplay(selectedFile, null)})`
                            : selectedFileName
                              ? `${selectedFileName.replace("uploads/job-applications/", "")} (${getFileTypeDisplay(null, selectedFileName)})`
                              : `(${FILE_HINT})`}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end px-[4px] lg:px-[6px] 2xl:px-[10px]">
              <Button
                className="text-[12px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px] 3xl:text-[18px] leading-[1] font-bold text-white w-full max-w-[140px] lg:max-w-[160px] 2xl:max-w-[180px] 3xl:max-w-[200px] h-[30px] lg:h-[35px] xl:h-[40px] 2xl:h-[50px] 3xl:h-[55px] flex items-center justify-between bg-base2 rounded-[20px] lg:rounded-[30px] 2xl:rounded-[40px] 3xl:rounded-[60px] p-[4px] lg:p-[6px] 2xl:p-[8px] transition-color duration-300 hover:bg-base2/80 hover:[&>*-translate-x-[5px]]"
                type="submit"
                // disabled={loading || !isOtpVerified}
              >
                <span className="px-1 lg:px-3.5">{loading ? "Submitting..." : "Submit"}</span>
                <Image src="/images/icon-careerBtn.svg" alt="careerBtn" width={40} height={40} className="w-5 lg:w-6 2xl:w-8 h-auto" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function CareerForm({ jobId, isGeneral }) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <CareerFormInner jobId={jobId} isGeneral={isGeneral} />
    </GoogleReCaptchaProvider>
  );
}
