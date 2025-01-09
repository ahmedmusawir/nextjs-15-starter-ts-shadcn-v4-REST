"use client";

import React, { useState, useEffect } from "react";
import { ProductVariation } from "@/types/product";

interface SingleVariationPricingProps {
  onPriceChange: (price: number | null) => void;
}

const SingleVariationPricing = ({
  onPriceChange,
}: SingleVariationPricingProps) => {
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Fetch and parse variations JSON on mount
  useEffect(() => {
    const variationsScript = document.getElementById("product-variations");
    if (variationsScript) {
      const data = JSON.parse(variationsScript.textContent || "[]");
      setVariations(data);

      // Set default selection
      if (data.length > 0) {
        const defaultOption = data[0]?.attributes[0]?.option || null;
        setSelectedOption(defaultOption);

        // Set initial price
        onPriceChange(parseFloat(data[0]?.price) || null);
      }
    }
  }, [onPriceChange]);

  // Handle option selection
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);

    // Update the price based on the selected option
    const matchedVariation = variations.find((variation) =>
      variation.attributes.some((attr) => attr.option === option)
    );
    const price = matchedVariation ? parseFloat(matchedVariation.price) : null;
    onPriceChange(price);
  };

  return (
    <div className="mt-10">
      {/* Options */}
      <div className="mb-4">
        <h3 className="text-sm text-gray-600">Options</h3>
        <div className="flex gap-3 mt-2">
          {variations.map((variation) => {
            const option = variation.attributes[0]?.option || "N/A";
            return (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                  selectedOption === option
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SingleVariationPricing;
