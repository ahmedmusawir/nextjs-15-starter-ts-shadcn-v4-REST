"use client";

import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useCheckoutStore } from "@/store/useCheckoutStore";

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
  const [selectedMethod, setSelectedMethod] = useState(
    checkoutData.shippingMethod
  );

  useEffect(() => {
    const shippingData = getShippingData();
    if (!shippingData) return;

    const {
      local_pickup_zipcodes,
      flat_rates,
      is_free_shipping_for_local_pickup,
    } = shippingData as {
      local_pickup_zipcodes: string[];
      flat_rates: { subtotal_threshold: number; shipping_cost: number }[];
      is_free_shipping_for_local_pickup: boolean;
    };

    let methods = [];

    if (
      shipping.postcode &&
      local_pickup_zipcodes.includes(shipping.postcode)
    ) {
      methods.push("Local Pickup");

      if (is_free_shipping_for_local_pickup) {
        methods.push("Free Shipping");
      }
    } else if (shipping.postcode) {
      const subtotal = checkoutData.subtotal;
      const applicableRate = flat_rates.find(
        (rate) => subtotal >= rate.subtotal_threshold
      );

      if (applicableRate) {
        methods.push(`Flat Rate - $${applicableRate.shipping_cost}`);
      }
    }

    setAvailableMethods(methods);
  }, [shipping.postcode, checkoutData.subtotal]);

  // Debounce function to delay updates to Zustand
  const debouncedUpdate = debounce((updatedShipping) => {
    setShipping(updatedShipping);
  }, 300);

  // Effect to update Zustand when the local state changes
  useEffect(() => {
    debouncedUpdate(shipping);
    return () => debouncedUpdate.cancel();
  }, [shipping]);

  // Handle method selection
  // Define allowed shipping methods explicitly
  type ShippingMethod = "flat_rate" | "free_shipping" | "local_pickup";

  const handleMethodSelect = (method: string) => {
    // setSelectedMethod(method);

    if (["flat_rate", "free_shipping", "local_pickup"].includes(method)) {
      setSelectedMethod(
        method as "flat_rate" | "free_shipping" | "local_pickup"
      );
    } else {
      console.error("Invalid shipping method selected:", method);
    }

    let shippingMethod: ShippingMethod = "flat_rate";
    let shippingCost = 0;

    if (method.includes("Flat Rate")) {
      shippingMethod = "flat_rate";
      shippingCost = Number(method.split("$")[1]) || 0;
    } else if (method === "Free Shipping") {
      shippingMethod = "free_shipping";
    } else if (method === "Local Pickup") {
      shippingMethod = "local_pickup";
    }

    setShippingMethod(shippingMethod, shippingCost);
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
      <div className="mt-6 border border-gray-300 rounded-md p-4 bg-white">
        <h3 className="text-md font-semibold text-gray-900">Shipping Method</h3>
        {availableMethods.length > 0 ? (
          <div className="mt-4 space-y-2">
            {availableMethods.map((method) => (
              <button
                key={method}
                className={`block w-full px-4 py-2 text-left text-sm font-medium rounded-md ${
                  selectedMethod === method
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => handleMethodSelect(method)}
              >
                {method}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-2">
            Please enter your shipping address to see available shipping
            options.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
