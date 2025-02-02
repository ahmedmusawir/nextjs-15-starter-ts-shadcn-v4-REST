"use client";

import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useCheckoutStore } from "@/store/useCheckoutStore";

interface ShippingMethodsProps {
  shippingData: {
    is_free_shipping_for_local_pickup: boolean;
    flat_rates: { subtotal_threshold: number; shipping_cost: number }[];
  };
  subtotal: number;
  availableMethods: string[];
}

const ShippingMethods = ({
  shippingData,
  subtotal,
  availableMethods,
}: ShippingMethodsProps) => {
  const { setShippingMethod } = useCheckoutStore();
  const { is_free_shipping_for_local_pickup, flat_rates } = shippingData;

  // Determine applicable flat rate based on subtotal
  const applicableRate = flat_rates.find(
    (rate) => subtotal >= rate.subtotal_threshold
  );

  const shippingOptions = [
    {
      id: "flat_rate",
      label: `Flat Rate - $${applicableRate?.shipping_cost ?? 10.0}`,
      cost: applicableRate?.shipping_cost ?? 10.0,
    },
    {
      id: "free_shipping",
      label: "Free Shipping - $0.00",
      cost: 0.0,
      show: is_free_shipping_for_local_pickup,
    },
    {
      id: "local_pickup",
      label: "Local Pickup - $0.00",
      cost: 0.0,
    },
  ].filter((option) => option.show !== false);

  const defaultSelection = is_free_shipping_for_local_pickup
    ? "free_shipping"
    : "flat_rate";

  const [selectedMethod, setSelectedMethod] = useState(defaultSelection);

  useEffect(() => {
    setShippingMethod(
      selectedMethod as "free_shipping" | "flat_rate" | "local_pickup",
      shippingOptions.find((o) => o.id === selectedMethod)?.cost || 0
    );
  }, [selectedMethod]);

  useEffect(() => {
    if (availableMethods.includes("Free Shipping")) {
      setSelectedMethod("free_shipping");
      setShippingMethod("free_shipping", 0);
    } else if (availableMethods.includes("Local Pickup")) {
      setSelectedMethod("local_pickup");
      setShippingMethod("local_pickup", 0);
    } else if (availableMethods.some((m) => m.includes("Flat Rate"))) {
      const flatRate =
        availableMethods.find((m) => m.includes("Flat Rate")) || "";
      setSelectedMethod("flat_rate");
      setShippingMethod("flat_rate", Number(flatRate.split("$")[1]) || 0);
    }
  }, [availableMethods]);

  return (
    <div className="mt-4">
      <h1 className="text-2xl text-gray-900">Delivery method</h1>

      <RadioGroup
        value={selectedMethod}
        onChange={setSelectedMethod}
        className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
      >
        {shippingOptions.map((option) => (
          <RadioGroup.Option
            key={option.id}
            value={option.id}
            className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500"
          >
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-gray-900">
                  {option.label}
                </span>
              </span>
            </span>
            <CheckCircleIcon
              aria-hidden="true"
              className="size-5 text-indigo-600 [.group:not([data-checked])_&]:hidden"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-indigo-500"
            />
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ShippingMethods;
