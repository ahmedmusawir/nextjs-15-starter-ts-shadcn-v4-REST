"use client";

import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const ShippingInfo = () => {
  const { checkoutData, setShipping } = useCheckoutStore();

  // Local state for controlled inputs
  const [shipping, setLocalShipping] = useState(checkoutData.shipping);

  // Debounce function to delay updates to Zustand
  const debouncedUpdate = debounce((updatedShipping) => {
    setShipping(updatedShipping);
  }, 300);

  // Effect to update Zustand when the local state changes
  useEffect(() => {
    debouncedUpdate(shipping);
    return () => debouncedUpdate.cancel(); // Cleanup to avoid unnecessary calls
  }, [shipping]);

  return (
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
  );
};

export default ShippingInfo;
