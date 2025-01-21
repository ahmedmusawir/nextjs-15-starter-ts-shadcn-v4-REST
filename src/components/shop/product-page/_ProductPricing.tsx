"use client";

import { ProductVariation } from "@/types/product";
import React, { useState, useEffect } from "react";

const ProductPricing = () => {
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [filteredVersions, setFilteredVersions] = useState<string[]>([]);
  const [filteredSizes, setFilteredSizes] = useState<string[]>([]);

  // Fetch and parse variations JSON on mount
  useEffect(() => {
    const variationsScript = document.getElementById("product-variations");
    if (variationsScript) {
      const data = JSON.parse(variationsScript.textContent || "[]");
      setVariations(data);
    }
  }, []);

  // Extract unique Pole Shapes
  const getValidShapes = (): string[] => {
    const shapes = new Set<string>();
    variations.forEach((variation) => {
      const shapeAttribute = variation.attributes.find(
        (attr) => attr.name === "Pole Shape"
      );
      if (shapeAttribute) shapes.add(shapeAttribute.option);
    });
    return Array.from(shapes);
  };

  // Filter versions and sizes based on the selected shape
  const filterOptionsByShape = (shape: string) => {
    const validVersions = new Set<string>();
    const validSizes = new Set<string>();

    variations.forEach((variation) => {
      const shapeAttribute = variation.attributes.find(
        (attr) => attr.name === "Pole Shape" && attr.option === shape
      );
      if (shapeAttribute) {
        // Collect valid versions
        const versionAttribute = variation.attributes.find(
          (attr) => attr.name === "Version"
        );
        if (versionAttribute) validVersions.add(versionAttribute.option);

        // Collect valid sizes
        const sizeAttribute = variation.attributes.find(
          (attr) => attr.name === "Pole Size"
        );
        if (sizeAttribute) validSizes.add(sizeAttribute.option);
      }
    });

    const versionsArray = Array.from(validVersions);
    const sizesArray = Array.from(validSizes);

    // Update filtered options
    setFilteredVersions(versionsArray);
    setFilteredSizes(sizesArray);

    // Automatically select defaults
    setSelectedVersion(versionsArray[0] || null); // Fallback to null if no versions
    setSelectedSize(sizesArray[0] || null); // Fallback to null if no sizes
  };

  // Calculate current price when all selections are made
  const calculatePrice = () => {
    const matchedVariation = variations.find((variation) => {
      const shapeMatch = variation.attributes.find(
        (attr) => attr.name === "Pole Shape" && attr.option === selectedShape
      );
      const versionMatch = selectedVersion
        ? variation.attributes.find(
            (attr) => attr.name === "Version" && attr.option === selectedVersion
          )
        : true; // Skip version match if no version is selected
      const sizeMatch = variation.attributes.find(
        (attr) => attr.name === "Pole Size" && attr.option === selectedSize
      );
      return shapeMatch && versionMatch && sizeMatch;
    });
    setCurrentPrice(matchedVariation ? matchedVariation.price : "N/A");
  };

  // Initialize default selections on mount
  useEffect(() => {
    if (variations.length > 0) {
      const validShapes = getValidShapes();
      if (validShapes.length > 0) {
        setSelectedShape(validShapes[0]); // Default to the first shape
        filterOptionsByShape(validShapes[0]); // Filter options for default shape
      }
    }
  }, [variations]);

  // Trigger price calculation when all selections are made
  useEffect(() => {
    if (selectedShape && selectedSize) {
      calculatePrice();
    }
  }, [selectedShape, selectedVersion, selectedSize]);

  // Handle shape selection
  const handleShapeSelection = (shape: string) => {
    setSelectedShape(shape);
    filterOptionsByShape(shape); // Reset versions and sizes for new shape
  };

  return (
    <div className="mt-10">
      {/* Pole Shape Options */}
      <div className="mb-4">
        <h3 className="text-sm text-gray-600">Pole Shape</h3>
        <div className="flex gap-3 mt-2">
          {getValidShapes().map((shape) => (
            <button
              key={shape}
              onClick={() => handleShapeSelection(shape)}
              className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                selectedShape === shape
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>

      {/* Version Options */}
      {filteredVersions.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-sm text-gray-600">Version</h3>
          <div className="flex gap-3 mt-2">
            {filteredVersions.map((version) => (
              <button
                key={version}
                onClick={() => setSelectedVersion(version)}
                className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                  selectedVersion === version
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {version}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <h3 className="text-sm text-gray-600">Version</h3>
          <p className="text-gray-500">N/A</p>
        </div>
      )}

      {/* Pole Size Options */}
      <div className="mb-4">
        <h3 className="text-sm text-gray-600">Pole Size</h3>
        <div className="flex gap-3 mt-2">
          {filteredSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                selectedSize === size
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
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

export default ProductPricing;
