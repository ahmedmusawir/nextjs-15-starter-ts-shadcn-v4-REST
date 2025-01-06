"use client";

import React, { useState, useEffect } from "react";
import { RadioGroup, Radio } from "@headlessui/react";
import { Product, ProductVariation } from "@/types/product";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  product: Product;
}

const ProductPricing = ({ product }: Props) => {
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);

  // Fetch and parse variations JSON on mount
  useEffect(() => {
    const variationsScript = document.getElementById("product-variations");
    if (variationsScript) {
      const data = JSON.parse(variationsScript.textContent || "[]");
      setVariations(data);
    }
  }, []);

  // Update price when attributes change
  useEffect(() => {
    const allAttributesSelected =
      Object.keys(selectedAttributes).length === product.attributes.length;

    if (allAttributesSelected) {
      const matchedVariation = variations.find((variation: any) =>
        variation.attributes.every(
          (attr: any) => selectedAttributes[attr.name] === attr.option
        )
      );
      setCurrentPrice(matchedVariation ? matchedVariation.price : "N/A");
    }
  }, [selectedAttributes, variations, product.attributes.length]);

  // Update selected attribute
  const handleSelection = (attributeName: string, option: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  return (
    <div className="mt-10">
      {/* Dynamically Render Radio Groups */}
      {product.attributes.map((attribute) => (
        <div key={attribute.name} className="mb-4">
          <h3 className="text-sm text-gray-600">{attribute.name}</h3>
          {/* <RadioGroup
            value={selectedAttributes[attribute.name] || ""}
            onChange={(value) => handleSelection(attribute.name, value)}
            className="flex items-center gap-x-3"
          >
            {attribute.options.map((option) => (
              <Radio
                key={option}
                value={option}
                className={classNames(
                  selectedAttributes[attribute.name] === option
                    ? "ring-indigo-500"
                    : "ring-gray-300",
                  "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-2 focus:outline-none"
                )}
              >
                <span className="text-sm">{option}</span>
              </Radio>
            ))}
          </RadioGroup> */}
          <RadioGroup
            value={selectedAttributes[attribute.name] || ""}
            onChange={(value) => handleSelection(attribute.name, value)}
            className="flex flex-wrap gap-3 mt-2"
          >
            {attribute.options.map((option) => (
              <Radio
                key={option}
                value={option}
                className={classNames(
                  selectedAttributes[attribute.name] === option
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100",
                  "cursor-pointer rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                )}
              >
                {option}
              </Radio>
            ))}
          </RadioGroup>
        </div>
      ))}

      {/* Current Price */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">Current Price:</h3>
        <p className="text-2xl font-bold text-gray-900">
          {currentPrice || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProductPricing;
