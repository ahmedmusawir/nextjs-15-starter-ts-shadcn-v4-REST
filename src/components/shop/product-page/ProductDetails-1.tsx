"use client";

import { Product } from "@/types/product";
import ProductImageGallery from "./ProductImageGallery";
import ProductReviews from "./ProductReviews";
import AddToCartButton from "./AddToCartButton";
import ProductDescription from "./ProductDescription";
import ProductColorRadio from "./ProductColorRadio";
import AdditionalDetailsAccordion from "./AdditionalDetailsAccordion";
import ProductInfo from "./ProductInfo";
import ProductPricing from "./ProductPricing";
import DynamicProductUI from "./DynamicProductUi";
import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import BloxxPricing from "./variations/BloxxPricing";
import SimplePricing from "./variations/SimplePricing";
import SingleVariationPricing from "./variations/SingleVariationPricing";
import ComplexVariationPricing from "./variations/ComplexVariationPricing";

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
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
        {type === "bloxx" && <BloxxPricing />}
        {type === "simple" && <SimplePricing />}
        {type === "single-variation" && <SingleVariationPricing />}
        {type === "complex-variation" && <ComplexVariationPricing />}

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />

        {/* Additional Details w/ Accordion */}
        <AdditionalDetailsAccordion product={product} />
      </div>
    </div>
  );
};

export default ProductDetails;
