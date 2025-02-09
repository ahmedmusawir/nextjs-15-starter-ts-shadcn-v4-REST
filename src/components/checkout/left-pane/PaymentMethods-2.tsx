import React, { useState } from "react";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const PaymentMethods = () => {
  const { checkoutData } = useCheckoutStore();
  const [error, setError] = useState("");

  // Function to validate checkout before placing order
  const handlePlaceOrder = () => {
    setError(""); // Reset previous errors

    // 1️⃣ Validate email
    if (!checkoutData.billing.email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2️⃣ Validate shipping info
    const { first_name, last_name, address_1, city, postcode, country } =
      checkoutData.shipping;
    if (
      !first_name ||
      !last_name ||
      !address_1 ||
      !city ||
      !postcode ||
      !country
    ) {
      setError("Please complete the shipping details.");
      return;
    }

    // 3️⃣ Validate cart items
    if (checkoutData.cartItems.length === 0) {
      setError("Your cart is empty. Add items before placing an order.");
      return;
    }

    // 4️⃣ Validate shipping method
    if (!checkoutData.shippingMethod) {
      setError("Please select a shipping method.");
      return;
    }

    // ✅ All checks passed - Log the order object for debugging
    console.log("Order Object:", checkoutData);
  };

  return (
    <>
      <fieldset className="mt-4">
        <legend className="sr-only">Payment type</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {["Credit card", "PayPal", "eTransfer"].map((method, idx) => (
            <div key={idx} className="flex items-center">
              <input
                defaultChecked={idx === 0}
                id={method}
                name="payment-type"
                type="radio"
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
              <label
                htmlFor={method}
                className="ml-3 block text-sm/6 font-medium text-gray-700"
              >
                {method}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Place Order Button */}
      <div className="mt-6">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handlePlaceOrder}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          Place Order
        </button>
      </div>
    </>
  );
};

export default PaymentMethods;
