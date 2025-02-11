"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

// 1. Extend the Zod schema for shipping fields, adding "state"
const shippingSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  address_1: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postcode: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  phone: z.string().regex(/^\d{10,15}$/, "Invalid phone number"),
});

// 2. Infer the TypeScript type from the Zod schema
type ShippingFormValues = z.infer<typeof shippingSchema>;

const ShippingForm = () => {
  const { checkoutData, setShipping, setBilling } = useCheckoutStore();

  // We'll track "same as shipping" in local state for simplicity.
  // Default to true, as requested.
  const [isBillingSame, setIsBillingSame] = useState(true);

  // 3. Use the Zod schema as the resolver for React Hook Form
  const {
    register,
    handleSubmit,
    control, // Needed for the Controller handling "state"
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: checkoutData.shipping,
  });

  // 4. Submission handler updates the Zustand store with valid data
  const onSubmit = (data: ShippingFormValues) => {
    // Merge into existing shipping object if you have other fields like address_2, country, etc.
    const updatedShipping = {
      ...checkoutData.shipping,
      ...data,
    };
    setShipping(updatedShipping);

    // If the checkbox is checked, copy shipping data to billing
    if (isBillingSame) {
      setBilling(updatedShipping);
    }
  };

  // 5. Handle changes to the "Billing same as shipping" checkbox
  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsBillingSame(e.target.checked);
  //   if (e.target.checked) {
  //     // Copy existing shipping data to billing right away
  //     setBilling(checkoutData.shipping);
  //   }
  // };

  // 6. Render the form
  return (
    <div className="mt-4">
      {/* Display Country/Region: USA on top (not part of the form) */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Country/Region
        </label>
        <p className="text-base text-gray-900">USA</p>
      </div>

      {/* Billing Address same as shipping */}
      <div className="mb-2 flex items-center space-x-2">
        <input
          id="billing-same-checkbox"
          type="checkbox"
          checked={isBillingSame}
          // onChange={handleCheckboxChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="billing-same-checkbox"
          className="block text-sm font-medium text-gray-700"
        >
          Billing address is same as Shipping
        </label>
      </div>

      {/* The existing shipping form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
      >
        {/* First Name */}
        <div>
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          <input
            {...register("first_name")}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="last-name"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          <input
            {...register("last_name")}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            {...register("address_1")}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
          {errors.address_1 && (
            <p className="text-red-500 text-sm">{errors.address_1.message}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            {...register("city")}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>

        {/* State using react-country-state-city */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <Controller
            name="state"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <StateSelect
                  countryid={233}
                  value={field.value || ""}
                  onChange={(selected) => {
                    console.log(
                      "Selected object from <StateSelect>:",
                      selected
                    );
                    const iso = (selected as any)?.state_code || "";
                    field.onChange(iso);
                  }}
                />
                {fieldState.error && (
                  <p className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Postal Code */}
        <div>
          <label
            htmlFor="postcode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <input
            {...register("postcode")}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
          {errors.postcode && (
            <p className="text-red-500 text-sm">{errors.postcode.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            {...register("phone")}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Save &amp; Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingForm;
