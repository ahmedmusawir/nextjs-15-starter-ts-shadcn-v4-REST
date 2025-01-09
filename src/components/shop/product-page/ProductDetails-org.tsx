"use client";

import Spinner from "@/components/common/Spinner";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import AdditionalDetailsAccordion from "./AdditionalDetailsAccordion";
import AddToCartButton from "./AddToCartButton";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";
import BloxxPricing from "./variations/BloxxPricing";
import ComplexVariationPricing from "./variations/ComplexVariationPricing";
import SimplePricing from "./variations/SimplePricing";
import SingleVariationPricing from "./variations/SingleVariationPricing";
import { renderPricingModule } from "@/lib/renderPricingModules";
import CurrentPriceDisplay from "./CurrentPriceDisplay";

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Default to 1
  const [productCategory, setProductCategory] = useState<{
    type: string;
  } | null>(null);

  // Fetch and parse the product category JSON on mount
  useEffect(() => {
    const categoryScript = document.getElementById("product-category-custom");
    if (categoryScript) {
      const data = JSON.parse(categoryScript.textContent || "{}");
      setProductCategory(data);
    }
  }, []);

  if (!productCategory) {
    return <Spinner />; // Show a loading state until the category is fetched
  }

  const { type } = productCategory;
  console.log("Custom Catetory [ProductDetails]", type);

  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {/* Image gallery */}
      <ProductImageGallery product={product} />

      {/* Product info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <ProductInfo product={product} />

        {/* Reviews */}
        {/* <ProductReviews /> */}

        {/* Description */}
        {/* <ProductDescription product={product} /> */}

        {/* Dynamic Pricing Block */}
        {/* Render the appropriate pricing module */}
        {renderPricingModule(productCategory, setBasePrice, {
          SimplePricing,
          SingleVariationPricing,
          ComplexVariationPricing,
          BloxxPricing,
        })}

        {/* Quantity Selector */}
        <div className="mt-4">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-gray-600"
          >
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="ml-2 p-2 border rounded-md text-gray-900"
          />
        </div>

        {/* Current Price Display */}
        <CurrentPriceDisplay basePrice={basePrice} quantity={quantity} />

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />

        {/* Additional Details w/ Accordion */}
        <AdditionalDetailsAccordion product={product} />
      </div>
    </div>
  );
};

export default ProductDetails;
