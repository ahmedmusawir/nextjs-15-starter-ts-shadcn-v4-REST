"use client";

import React, { useState, useEffect } from "react";
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

  // Local state for controlled inputs
  const [shipping, setLocalShipping] = useState(checkoutData.shipping);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<
    "flat_rate" | "free_shipping" | "local_pickup"
  >(checkoutData.shippingMethod);
  const [shippingData, setShippingData] = useState<{
    local_pickup_zipcodes: string[];
    flat_rates: { subtotal_threshold: number; shipping_cost: number }[];
    is_free_shipping_for_local_pickup: boolean;
  } | null>(null);

  const [subtotal, setSubtotal] = useState<number>(checkoutData.subtotal);

  useEffect(() => {
    const data = getShippingData();
    if (!data) return;

    setShippingData(data);
    setSubtotal(checkoutData.subtotal);

    console.log("Shipping Data:[ShippingInfo.tsx]", data);

    const {
      local_pickup_zipcodes,
      flat_rates,
      is_free_shipping_for_local_pickup,
    } = data;

    let methods = [];

    // Validate ZIP Code: Ensure it's a 5-digit number before proceeding
    const isValidZip = /^\d{5}$/.test(shipping.postcode);

    if (!isValidZip) {
      setAvailableMethods([]); // Clear available methods
      return; // Stop execution to prevent accidental method selection
    }

    if (local_pickup_zipcodes.includes(shipping.postcode)) {
      methods.push("Local Pickup");

      if (is_free_shipping_for_local_pickup) {
        methods.push("Free Shipping");
      }
    } else {
      const applicableRate = flat_rates.find(
        (rate: { subtotal_threshold: number; shipping_cost: number }) =>
          subtotal >= rate.subtotal_threshold
      );

      if (applicableRate) {
        methods.push(`Flat Rate - $${applicableRate.shipping_cost}`);
      }
    }

    setAvailableMethods(methods);

    // ✅ Set default method if Free Shipping is available
    if (is_free_shipping_for_local_pickup) {
      setSelectedMethod("free_shipping");
      setShippingMethod("free_shipping", 0);
    } else if (methods.includes("Local Pickup")) {
      setSelectedMethod("local_pickup");
      setShippingMethod("local_pickup", 0);
    } else if (methods.some((m) => m.includes("Flat Rate"))) {
      const flatRate = methods.find((m) => m.includes("Flat Rate"));
      setSelectedMethod("flat_rate");
      setShippingMethod("flat_rate", Number(flatRate?.split("$")[1]) || 0);
    }
  }, [shipping.postcode, checkoutData.subtotal]);

  const debouncedUpdate = debounce((updatedShipping) => {
    setShipping(updatedShipping);
  }, 300);

  // Effect to update Zustand when the local state changes
  useEffect(() => {
    debouncedUpdate(shipping);
    return () => debouncedUpdate.cancel();
  }, [shipping]);

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
            onChange={(e) =>
              setLocalShipping({ ...shipping, first_name: e.target.value })
            }
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
            onChange={(e) =>
              setLocalShipping({ ...shipping, last_name: e.target.value })
            }
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
            onChange={(e) =>
              setLocalShipping({ ...shipping, address_1: e.target.value })
            }
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
            onChange={(e) =>
              setLocalShipping({ ...shipping, city: e.target.value })
            }
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
            onChange={(e) =>
              setLocalShipping({ ...shipping, postcode: e.target.value })
            }
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
