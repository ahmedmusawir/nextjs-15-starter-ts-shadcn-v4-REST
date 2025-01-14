"use client";

import React, { useEffect, useState } from "react";

interface PoleStyles {
  [key: string]: string; // Example: { square: "url", round: "url", ... }
}

interface Props {
  onSelectionChange: (selectedStyle: string) => void; // Pass the selected style back
}

const BloxxPricingPoleStyles = ({ onSelectionChange }: Props) => {
  const [poleStyles, setPoleStyles] = useState<PoleStyles | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("Square");

  // Fetch pole styles from global JSON
  useEffect(() => {
    const categoryScript = document.getElementById("product-category-custom");
    if (categoryScript) {
      const data = JSON.parse(categoryScript.textContent || "{}");
      if (data.poleStyles) {
        setPoleStyles(data.poleStyles);
        setSelectedStyle("square"); // Default to Square
        onSelectionChange("square"); // Notify parent of default selection
      }
    }
  }, [onSelectionChange]);

  if (!poleStyles) return null; // Render nothing if no poleStyles available

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-600">Shape of Pole</h3>
      <div className="grid grid-cols-2 gap-3 mt-2 md:grid-cols-4">
        {Object.entries(poleStyles).map(([key, imageUrl]) => (
          <label
            key={key}
            className={`flex items-center justify-center w-20 h-20 border-4 rounded-md ${
              selectedStyle === key ? "border-indigo-500" : "border-gray-300"
            } hover:border-indigo-500 cursor-pointer`}
          >
            <input
              type="radio"
              name="poleStyle"
              value={key}
              checked={selectedStyle === key}
              onChange={() => {
                setSelectedStyle(key);
                onSelectionChange(key); // Notify parent of selection
              }}
              className="sr-only"
            />
            <img src={imageUrl} alt={key} className="w-20 h-20 mb-1" />
            {/* <span className="capitalize">{key.replace("_", " ")}</span> */}
          </label>
        ))}
      </div>
    </div>
  );
};

export default BloxxPricingPoleStyles;
