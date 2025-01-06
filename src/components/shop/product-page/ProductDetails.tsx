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

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {/* Image gallery */}
      <ProductImageGallery product={product} />

      {/* Product info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <ProductInfo product={product} />

        {/* Reviews */}
        <ProductReviews />

        {/* Description */}
        {/* <ProductDescription product={product} /> */}

        {/* Colors */}
        <ProductPricing product={product} />

        {/* Add to Cart Button */}
        <AddToCartButton product={product} />

        {/* Additional Details w/ Accordion */}
        <AdditionalDetailsAccordion product={product} />
      </div>
    </div>
  );
};

export default ProductDetails;
