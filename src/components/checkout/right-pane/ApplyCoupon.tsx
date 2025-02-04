"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { getCouponsFromStorage, validateCoupon } from "@/lib/couponUtils";

const ApplyCoupon = () => {
  const { checkoutData, applyCoupon, removeCoupon } = useCheckoutStore();
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");

  // Handle applying coupon
  const handleApply = () => {
    setError(""); // Reset error message

    // Get all coupons from storage
    const coupons = getCouponsFromStorage();
    const foundCoupon = coupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!foundCoupon || !validateCoupon(foundCoupon, checkoutData)) {
      setError("Invalid or expired coupon.");
      return;
    }

    applyCoupon(foundCoupon.code);
    setCouponCode(""); // Clear input field
  };

  // Handle removing coupon
  const handleRemove = () => {
    removeCoupon();
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700">
        Coupon/Gift Certificate
      </h3>

      {/* If a coupon is applied, show the applied coupon */}
      {checkoutData.coupon ? (
        <div className="mt-2 flex items-center justify-between border border-gray-300 p-2 rounded-md bg-gray-100">
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
      ) : (
        // Otherwise, show the input field to enter a coupon
        <div className="mt-2 flex space-x-2">
          <input
            type="text"
            className="flex-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            onClick={handleApply}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      )}

      {/* Show error message if coupon is invalid */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ApplyCoupon;
