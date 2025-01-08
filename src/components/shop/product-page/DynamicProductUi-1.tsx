import { ProductVariation } from "@/types/product";
import React, { useState, useEffect } from "react";

interface Attribute {
  name: string;
  options: string[];
}

interface Props {
  attributes: Attribute[];
}

const DynamicProductUI = ({ attributes }: Props) => {
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  // State to manage selected options for each attribute
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Fetch and parse variations JSON on mount
  useEffect(() => {
    const variationsScript = document.getElementById("product-variations");
    if (variationsScript) {
      const data = JSON.parse(variationsScript.textContent || "[]");
      setVariations(data);
    }
  }, []);

  // Initialize default selections on component mount
  useEffect(() => {
    const initialSelections: Record<string, string> = {};
    attributes.forEach((attribute) => {
      if (attribute.options.length > 0) {
        initialSelections[attribute.name] = attribute.options[0]; // Default to first option
      }
    });
    setSelectedOptions(initialSelections);
  }, [attributes]);

  // Handle option selection
  const handleOptionClick = (attributeName: string, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  return (
    <div className="space-y-6 mt-10">
      {attributes.map((attribute) => (
        <div key={attribute.name} className="mb-4">
          <h3 className="text-sm font-medium text-gray-600">
            {attribute.name}
          </h3>
          <div className="flex gap-3 mt-2">
            {/* {attribute.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(attribute.name, option)}
                className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-offset-1 ${
                  selectedOptions[attribute.name] === option
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {option}
              </button>
            ))} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicProductUI;
