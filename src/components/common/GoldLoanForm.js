"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useMemo, useState } from "react";
import EnquiryModal from "./EnquiryModal";

// Schema Validation
const formSchema = z.object({
  carat: z.string().nonempty({
    message: "carat is required",
  }),
  gold_type: z.string().nonempty({
    message: "Gold type is required",
  }),
  gold_amount: z.string().min(1, {
    message: "must be at least 1 characters.",
  }),
});

const labelStyle = "text-[12px] lg:text-[12px] 2xl:text-[14px] 3xl:text-[18px] leading-none font-normal text-black";
const toggleBtnStyle =
  "text-[10px] lg:text-[12px] 2xl:text-[14px] text-center leading-[1.2] font-normal text-white w-[40px] lg:w-[45px] 2xl:w-[54px] h-[20px] lg:h-[20px] 2xl:h-[26px] rounded-[4px] lg:rounded-[6px] flex items-center justify-center cursor-pointer transition-colors duration-300";

export default function GoldLoanForm({ goldCaratTypes, goldTypes, goldRate }) {
  const [submittedData, setSubmittedData] = useState({});
  const [reductionPercent, setReductionPercent] = useState(25);

  // Define form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carat: "",
      gold_type: "",
      gold_amount: "",
      loanAmount: "₹ 59,080",
    },
  });

  const goldAmount = useWatch({
    control: form.control,
    name: "gold_amount",
  });

  const [unit, setUnit] = useState("gm");

  const handleToggle = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleRefresh() {
    form.setValue("gold_amount", "");
  }

  // Handle form submission
  function onSubmit(values) {
    const weight = parseFloat(values.gold_amount);
    const weightInGm = unit === "kg" ? weight * 1000 : weight;
    const calculatedLoanAmount = weightInGm * finalRate;

    setSubmittedData({
      ...values,
      gold_amount: `${weight} ${unit}`,
      loan_amount: `₹ ${calculatedLoanAmount.toFixed(2)}`,
    });

    setIsDialogOpen(true);
  }

  // Handle dialog cancel
  function handleCancel() {
    setIsDialogOpen(false);
  }

  const finalRate = useMemo(() => {
    return goldRate * (1 - reductionPercent / 100);
  }, [goldRate, reductionPercent]);

  const loanAmountValue = useMemo(() => {
    const weight = parseFloat(goldAmount || "0");
    if (isNaN(weight)) return "";

    const weightInGm = unit === "kg" ? weight * 1000 : weight;
    return (weightInGm * finalRate).toFixed(2);
  }, [goldAmount, finalRate, unit]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap -mx-[4px] lg:-mx-[6px] 2xl:-mx-[10px]">
          <div className="w-full px-[4px] lg:px-[6px] 2xl:px-[10px]">
            <FormField
              control={form.control}
              name="carat"
              render={({ field }) => (
                <FormItem className="mb-2 xl:mb-3 3xl:mb-4">
                  <FormLabel className={labelStyle}>Karat</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} key={field.value}>
                    <SelectTrigger className="w-full bg-white border-white">
                      <SelectValue placeholder="Karat" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-white">
                      {goldCaratTypes?.map((carat) => (
                        <SelectItem key={carat?.value} value={carat?.label}>
                          {carat?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full px-[4px] lg:px-[6px] 2xl:px-[10px]">
            <FormField
              control={form.control}
              name="gold_type"
              render={({ field }) => (
                <FormItem className="mb-2 xl:mb-3 3xl:mb-4">
                  <FormLabel className={labelStyle}>Gold type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} key={field.value}>
                    <SelectTrigger className="w-full bg-white border-white">
                      <SelectValue placeholder="Gold type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-white">
                      {goldTypes?.map((type) => (
                        <SelectItem key={type?.value} value={type?.label}>
                          {type?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full px-[4px] lg:px-[6px] 2xl:px-[10px]">
            <FormField
              control={form.control}
              name="gold_amount"
              render={({ field }) => (
                <FormItem className="mb-2 xl:mb-3 3xl:mb-4">
                  <div className="flex">
                    <FormLabel className={`${labelStyle} flex-1`}>Gold amount </FormLabel>
                    <div className="inline-flex gap-[4px] lg:gap-[6px] 2xl:gap-[8px] rounded-[5px] lg:rounded-[10px] 2xl:rounded-[15px] bg-white p-[2px_4px] lg:p-[3px_6px] 2xl:p-[4px_8px]">
                      <div
                        onClick={() => handleToggle("gm")}
                        className={`${unit === "gm" ? "bg-base1" : " bg-base1/50 hover:bg-base1/60"} ${toggleBtnStyle}`}
                      >
                        gm
                      </div>
                      <div
                        onClick={() => handleToggle("kg")}
                        className={`${unit === "kg" ? "bg-base1" : " bg-base1/50 hover:bg-base1/60"} ${toggleBtnStyle}`}
                      >
                        kg
                      </div>
                    </div>
                  </div>
                  <FormControl>
                    <Input type="number" className="bg-white border-white" placeholder={`Gold Amount (in ${unit})`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full px-[4px] lg:px-[6px] 2xl:px-[10px]">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem className="mb-2 xl:mb-3 3xl:mb-4">
                  <FormLabel className={labelStyle}>Loan Amount</FormLabel>
                  <div className="relative z-0">
                    <FormControl>
                      <Input
                        className="bg-white border-white"
                        placeholder="Loan amount"
                        {...field}
                        value={loanAmountValue ? `₹ ${loanAmountValue}` : ""}
                        disabled
                      />
                    </FormControl>
                    <Image
                      src="/images/icon-refresh.svg"
                      alt="refresh"
                      width={16}
                      height={16}
                      onClick={handleRefresh}
                      className="w-[10px] sm:w-[10px] 2xl:w-[15px] aspect-square absolute z-1 top-0 bottom-0 right-[10px] lg:right-[12px] 2xl:right-[15px] m-auto cursor-pointer hover:scale-95 transition-transform duration-300"
                    />
                  </div>
                  <FormDescription className="text-[10px] lg:text-[12px] 2xl:text-[14px] 3xl:text-[18px] leading-none font-normal text-[#3c3c3c]">
                    Rate Calculated @ {goldRate ?? "--"} / Gm
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full px-[4px] lg:px-[6px] 2xl:px-[10px] mt-[15px] lg:mt-[20px] 2xl:mt-[30px]">
            <Button
              id="gold-loan-calculator"
              className="btn btn-base2 max-w-[105px] lg:max-w-[120px] 2xl:max-w-[140px] 3xl:max-w-[160px uppercase ml-auto"
              type="submit"
            >
              apply now
            </Button>
          </div>
        </form>
      </Form>
      {isDialogOpen && (
        <EnquiryModal isDialogOpen={isDialogOpen} onCancel={handleCancel} enquiryCalculatorData={submittedData} type={"gold_loan_calculator"} />
      )}
    </>
  );
}
