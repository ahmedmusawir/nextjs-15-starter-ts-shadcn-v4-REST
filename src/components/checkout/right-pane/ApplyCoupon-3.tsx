// File: ApplyCoupon.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { validateCoupon } from "@/lib/couponUtils";
import { fetchCouponByCode } from "@/services/checkoutServices";

const ApplyCoupon = () => {
  const { checkoutData, applyCoupon, removeCoupon } = useCheckoutStore();
  const [couponCode, setCouponCode] = useState("");
  // We'll record the cart count at the time the coupon was applied.
  const [appliedCartCount, setAppliedCartCount] = useState<number | null>(null);
  // We'll use this state to store the message prompting re-application.
  const [couponRemovedMessage, setCouponRemovedMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle applying coupon
  const handleApply = async () => {
    setError(""); // Reset error message
    setCouponRemovedMessage(""); // Clear any previous removal message

    if (!couponCode.trim()) {
      setError("Please enter a coupon code.");
      return;
    }

    setIsLoading(true);

    try {
      const coupon = await fetchCouponByCode(couponCode);

      console.log("coupon [ApplyCoupon.tsx]", coupon);

      if (!coupon) {
        setError("Invalid or expired coupon.");
        return;
      }

      const validation = validateCoupon(coupon, checkoutData);
      if (!validation.isValid) {
        setError(validation.message);
        return;
      }

      applyCoupon(coupon);
      // Record the cart item count when the coupon is applied.
      setAppliedCartCount(checkoutData.cartItems.length);
      setCouponCode(""); // Clear input field
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error applying coupon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing coupon manually
  const handleRemove = () => {
    removeCoupon();
    setAppliedCartCount(null); // Reset the applied cart count
    setCouponRemovedMessage(""); // Clear any removal message
  };

  // Auto-remove the coupon if the cart has changed since it was applied.
  useEffect(() => {
    if (
      checkoutData.coupon &&
      appliedCartCount !== null &&
      checkoutData.cartItems.length !== appliedCartCount
    ) {
      removeCoupon();
      setAppliedCartCount(null);
      setCouponRemovedMessage("The cart updated, plz re-apply the coupon");
    }
  }, [
    checkoutData.cartItems,
    checkoutData.coupon,
    appliedCartCount,
    removeCoupon,
  ]);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700">
        Coupon/Gift Certificate
      </h3>

      {/* If a coupon is applied, show the applied coupon */}
      {checkoutData.coupon ? (
        <div className="mt-2 flex flex-col">
          <div className="flex items-center justify-between border border-gray-300 p-2 rounded-md bg-gray-100">
            <span className="text-sm font-medium text-gray-900">
              Coupon Applied: {checkoutData.coupon.code}
            </span>
            <button
              onClick={handleRemove}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
          {/* If the cart changed and coupon was auto-removed, show the message */}
          {couponRemovedMessage && (
            <p className="mt-1 text-sm font-bold text-red-600">
              {couponRemovedMessage}
            </p>
          )}
        </div>
      ) : (
        // Otherwise, show the input field to enter a coupon
        <div className="mt-2 flex flex-col">
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              onClick={handleApply}
              disabled={isLoading}
              className={`bg-indigo-600 text-white py-2 px-4 rounded-md ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
            >
              {isLoading ? "Applying..." : "Apply"}
            </button>
          </div>
          {/* Show the removal message if present */}
          {couponRemovedMessage && (
            <p className="mt-1 text-sm font-bold text-red-600">
              {couponRemovedMessage}
            </p>
          )}
        </div>
      )}

      {/* Show error message if coupon is invalid */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ApplyCoupon;
