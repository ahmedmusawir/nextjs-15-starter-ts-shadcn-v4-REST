import React, { useState, useEffect } from "react";
import { ProductVariation } from "@/types/product";

const ComplexVariationPricing = () => {
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);

  // Fetch and parse variations JSON on mount
  useEffect(() => {
    const variationsScript = document.getElementById("product-variations");
    if (variationsScript) {
      const data = JSON.parse(variationsScript.textContent || "[]");
      setVariations(data);

      // Initialize default selections
      const initialSelections: Record<string, string> = {};
      data[0]?.attributes.forEach((attr: { name: string; option: string }) => {
        initialSelections[attr.name] = attr.option;
      });
      setSelectedOptions(initialSelections);
    }
  }, []);

  // Filter available options based on current selections
  const filterOptions = (attributeName: string): string[] => {
    const options = new Set<string>();
    variations.forEach((variation) => {
      const match = variation.attributes.every(
        (attr) =>
          attr.name === attributeName ||
          selectedOptions[attr.name] === attr.option
      );
      if (match) {
        const attr = variation.attributes.find(
          (attr) => attr.name === attributeName
        );
        if (attr) options.add(attr.option);
      }
    });
    return Array.from(options);
  };

  // Handle option selection
  const handleOptionClick = (attributeName: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  // Calculate current price
  useEffect(() => {
    const matchedVariation = variations.find((variation) =>
      variation.attributes.every(
        (attr) => selectedOptions[attr.name] === attr.option
      )
    );
    setCurrentPrice(matchedVariation?.price || null);
  }, [selectedOptions, variations]);

  return (
    <div>
      <div className="space-y-6">
        {Object.keys(selectedOptions).map((attributeName) => (
          <div key={attributeName} className="mb-4">
            <h3 className="text-sm font-medium text-gray-600">
              {attributeName}
            </h3>
            <div className="flex gap-3 mt-2">
              {filterOptions(attributeName).map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionClick(attributeName, option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-offset-1 ${
                    selectedOptions[attributeName] === option
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Current Price */}
      <div className="mt-10 p-4 bg-gray-100 rounded-lg shadow-sm">
        <h3 className="text-xl font-bold text-gray-800">
          Current Price: {currentPrice ? `$${currentPrice}` : "Select options"}
        </h3>
      </div>
    </div>
  );
};

export default ComplexVariationPricing;
