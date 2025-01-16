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
import { CartItem } from "@/types/cart";

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // Default to 1
  const [productCategory, setProductCategory] = useState<{
    type: string;
  } | null>(null);

  // Add CartItem state to the component
  const [cartItem, setCartItem] = useState<CartItem>({
    id: product.id,
    name: product.name,
    price: 0, // Default price
    quantity: 1, // Default quantity
    image: product.images[0].src, // Main product image
    category: productCategory?.type || "Unknown", // Category
    basePrice: 0, // Default base price
    variations: [],
    customFields: [],
    metadata: {},
  });

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

  // const { type } = productCategory;
  // console.log("Custom Catetory [ProductDetails]", type);

  // Add this function inside the ProductDetails component
  // const handleAddToCart = () => {
  //   const cartItem = {
  //     id: product.id,
  //     name: product.name,
  //     price: basePrice, // From the selected options
  //     quantity: quantity,
  //     poleShape: selectedShape, // From BloxxPricing
  //     poleSize: selectedSize, // From BloxxPricing
  //     customSize: selectedSize === "Other" ? customSize : null, // From custom input
  //     poleStyle: selectedPoleStyle, // From BloxxPricingPoleStyles
  //     version: selectedVersion, // From BloxxPricing
  //     image: product.images[0].src, // From product object
  //     category: productCategory?.type || "Unknown", // From productCategory state
  //   };

  //   console.log("Generated Cart Item:", cartItem);
  //   // Later: Dispatch this cartItem to the Zustand store
  // };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {/* Image gallery */}
      <ProductImageGallery product={product} />

      {/* Product info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <ProductInfo product={product} />

        {/* Render the appropriate pricing module */}
        {renderPricingModule(productCategory, setBasePrice, {
          SimplePricing,
          SingleVariationPricing,
          ComplexVariationPricing,
          BloxxPricing,
        })}

        {/* Quantity Selector */}
        <div className="mt-10">
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
