"use client";

import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import ShippingMethods from "./ShippingMethods";

// Function to retrieve shipping data from the embedded script
const getShippingData = () => {
  const script = document.getElementById("shipping-data");
  return script ? JSON.parse(script.textContent || "{}") : null;
};

const ShippingInfo = () => {
  const { checkoutData, setShipping, setShippingMethod } = useCheckoutStore();

  // Use Zustand's state directly instead of local state reset
  const [shipping, setLocalShipping] = useState(checkoutData.shipping);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [shippingData, setShippingData] = useState<{
    local_pickup_zipcodes: string[];
    flat_rates: { subtotal_threshold: number; shipping_cost: number }[];
    is_free_shipping_for_local_pickup: boolean;
  } | null>(null);

  const subtotal = checkoutData.subtotal;

  useEffect(() => {
    const data = getShippingData();
    if (!data) return;

    setShippingData(data);

    const { local_pickup_zipcodes, flat_rates, is_free_shipping_for_local } =
      data;
    let methods: string[] = [];
    const isValidZip = /^\d{5}$/.test(shipping.postcode);

    if (!isValidZip) {
      setAvailableMethods([]);
      return;
    }

    if (local_pickup_zipcodes.includes(shipping.postcode)) {
      if (is_free_shipping_for_local) {
        // Push both options when free shipping is enabled
        methods.push("Free Shipping");
        methods.push("Local Pickup");
      } else {
        methods.push("Local Pickup");
      }
    } else {
      const applicableRates = flat_rates.filter(
        (rate: { subtotal_threshold: number; shipping_cost: number }) =>
          subtotal >= rate.subtotal_threshold
      );
      const applicableRate =
        applicableRates.length > 0
          ? applicableRates.reduce(
              (
                prev: { subtotal_threshold: number; shipping_cost: number },
                curr: { subtotal_threshold: number; shipping_cost: number }
              ) =>
                curr.subtotal_threshold > prev.subtotal_threshold ? curr : prev
            )
          : flat_rates[0];
      methods.push(`Flat Rate - $${applicableRate?.shipping_cost}`);
    }
    setAvailableMethods(methods);

    // Persist shipping method if not already set
    if (!checkoutData.shippingMethod) {
      if (methods.includes("Free Shipping")) {
        setShippingMethod("free_shipping", 0);
      } else if (methods.includes("Local Pickup")) {
        setShippingMethod("local_pickup", 0);
      } else if (methods.some((m) => m.includes("Flat Rate"))) {
        const flatRateStr = methods.find((m) => m.includes("Flat Rate")) || "";
        const cost = Number(flatRateStr.split("$")[1]) || 0;
        setShippingMethod("flat_rate", cost);
      }
    }
  }, [
    shipping.postcode,
    subtotal,
    checkoutData.shippingMethod,
    setShippingMethod,
  ]);

  const debouncedUpdate = debounce((updatedShipping) => {
    setShipping(updatedShipping);
  }, 300);

  // Ensure persisted shipping data is set properly across page reloads
  useEffect(() => {
    setLocalShipping(checkoutData.shipping);
    debouncedUpdate(checkoutData.shipping);
    return () => debouncedUpdate.cancel();
  }, [checkoutData.shipping]);

  // Input change handler updates the store immediately
  const handleInputChange = (field: keyof typeof shipping, value: string) => {
    setShipping({ ...shipping, [field]: value });
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Shipping Information
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div>
          <label
            htmlFor="first-name"
            className="block text-sm font-medium text-gray-700"
          >
            First name
          </label>
          <input
            id="first-name"
            type="text"
            value={shipping.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="last-name"
            className="block text-sm font-medium text-gray-700"
          >
            Last name
          </label>
          <input
            id="last-name"
            type="text"
            value={shipping.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            id="address"
            type="text"
            value={shipping.address_1}
            onChange={(e) => handleInputChange("address_1", e.target.value)}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>
          <input
            id="city"
            type="text"
            value={shipping.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="postcode"
            className="block text-sm font-medium text-gray-700"
          >
            Postal Code
          </label>
          <input
            id="postcode"
            type="text"
            value={shipping.postcode}
            onChange={(e) => handleInputChange("postcode", e.target.value)}
            className="block w-full rounded-md px-3 py-2 text-base outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600"
          />
        </div>
      </div>

      {/* Shipping Method Selection Box */}
      {shippingData && (
        <ShippingMethods
          availableMethods={availableMethods}
          shippingData={shippingData}
          subtotal={subtotal}
        />
      )}
    </div>
  );
};

export default ShippingInfo;
