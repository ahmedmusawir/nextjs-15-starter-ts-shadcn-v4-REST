import React from "react";

export const renderPricingModule = (
  productCategory: { type: string; price?: number } | null,
  setBasePrice: React.Dispatch<React.SetStateAction<number | null>>,
  components: {
    SimplePricing: React.ComponentType<{
      productPrice: number;
      onPriceChange: (price: number | null) => void;
    }>;
    SingleVariationPricing: React.ComponentType<{
      onPriceChange: (price: number | null) => void;
    }>;
    ComplexVariationPricing: React.ComponentType<{
      onPriceChange: (price: number | null) => void;
    }>;
    BloxxPricing: React.ComponentType<{
      onPriceChange: (price: number | null) => void;
    }>;
  }
) => {
  if (!productCategory) {
    return <div>Error: Could not determine product category.</div>;
  }

  const { type, price } = productCategory;
  const {
    SimplePricing,
    SingleVariationPricing,
    ComplexVariationPricing,
    BloxxPricing,
  } = components;

  switch (type) {
    case "simple":
      if (price === undefined) {
        return <div>Error: Missing price for simple product.</div>;
      }
      return (
        <SimplePricing productPrice={price} onPriceChange={setBasePrice} />
      );
    case "single-variation":
      return <SingleVariationPricing onPriceChange={setBasePrice} />;
    case "complex-variation":
      return <ComplexVariationPricing onPriceChange={setBasePrice} />;
    case "bloxx":
      return <BloxxPricing onPriceChange={setBasePrice} />;
    default:
      return null;
  }
};
