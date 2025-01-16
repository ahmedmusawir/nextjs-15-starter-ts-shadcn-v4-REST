"use client";

import React, { useEffect } from "react";

interface SimplePricingProps {
  productPrice: number; // Price passed from the global JSON
  onPriceChange: (price: number | null) => void;
}

const SimplePricing = ({ productPrice, onPriceChange }: SimplePricingProps) => {
  // Set the price on mount
  useEffect(() => {
    onPriceChange(productPrice);
  }, [productPrice, onPriceChange]);

  return (
    <div className="mt-10">
      <p className="text-sm text-gray-600">This product has no variations.</p>
    </div>
  );
};

export default SimplePricing;
