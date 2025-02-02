import { useState, useEffect, useMemo } from "react";
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
  const { flat_rates } = shippingData;

  // Memoize the shipping options to avoid re-creating the array on each render.
  const shippingOptions = useMemo(() => {
    const applicableRate = flat_rates.find(
      (rate) => subtotal >= rate.subtotal_threshold
    );
    const fullShippingOptions = [
      {
        id: "flat_rate",
        label: `Flat Rate - $${applicableRate?.shipping_cost ?? 10.0}`,
        cost: applicableRate?.shipping_cost ?? 10.0,
      },
      {
        id: "free_shipping",
        label: "Free Shipping - $0.00",
        cost: 0.0,
      },
      {
        id: "local_pickup",
        label: "Local Pickup - $0.00",
        cost: 0.0,
      },
    ];
    return fullShippingOptions.filter((option) => {
      if (option.id === "flat_rate") {
        return availableMethods.some((m) => m.includes("Flat Rate"));
      }
      if (option.id === "free_shipping") {
        return availableMethods.includes("Free Shipping");
      }
      if (option.id === "local_pickup") {
        return availableMethods.includes("Local Pickup");
      }
      return false;
    });
  }, [availableMethods, flat_rates, subtotal]);

  // Determine default selection based on availableMethods.
  const defaultSelection = useMemo(() => {
    if (availableMethods.includes("Free Shipping")) {
      return "free_shipping";
    } else if (availableMethods.includes("Local Pickup")) {
      return "local_pickup";
    } else if (availableMethods.some((m) => m.includes("Flat Rate"))) {
      return "flat_rate";
    }
    return "";
  }, [availableMethods]);

  const [selectedMethod, setSelectedMethod] = useState(defaultSelection);

  // When availableMethods (and thus defaultSelection) change, update the selected method if needed.
  useEffect(() => {
    if (defaultSelection && defaultSelection !== selectedMethod) {
      setSelectedMethod(defaultSelection);
    }
  }, [defaultSelection, selectedMethod]);

  // Update the checkout store whenever selectedMethod (or shippingOptions) changes.
  useEffect(() => {
    const chosenOption = shippingOptions.find((o) => o.id === selectedMethod);
    if (chosenOption) {
      setShippingMethod(
        selectedMethod as "free_shipping" | "flat_rate" | "local_pickup",
        chosenOption.cost
      );
    }
  }, [selectedMethod, shippingOptions, setShippingMethod]);

  return (
    <div className="mt-4">
      <h1 className="text-2xl text-gray-900">Delivery method</h1>

      {/* ✅ Empty Box Message When No ZIP Code is Entered */}
      {availableMethods.length === 0 ? (
        <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white text-center text-gray-500">
          Please select a shipping address in order to see shipping quotes
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ShippingMethods;
