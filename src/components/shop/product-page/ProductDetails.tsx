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
import ManageQuantity from "./ManageQuantity";

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
  const [basePrice, setBasePrice] = useState<number | null>(null);
  // const [quantity, setQuantity] = useState<number>(1); // Default to 1
  const [productCategory, setProductCategory] = useState<{
    type: string;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Add CartItem state to the component
  const [cartItem, setCartItem] = useState<CartItem>({
    id: product.id,
    name: product.name,
    price: 0, // Default price
    quantity: 1, // Default quantity
    image: product.images[0].src, // Main product image
    categories: product.categories,
    basePrice: 0, // Default base price
    variations: [],
    customFields: [],
    metadata: {},
  });

  // Map all category names to CartItem
  useEffect(() => {
    if (product && product.categories.length > 0) {
      setCartItem((prev) => ({
        ...prev,
        category: product.categories.map((cat) => cat.name), // Map all category names
      }));
    }
  }, [product]);

  // Fetch and parse the product category JSON on mount
  useEffect(() => {
    const categoryScript = document.getElementById("product-category-custom");
    if (categoryScript) {
      const data = JSON.parse(categoryScript.textContent || "{}");
      setProductCategory(data);
    }
  }, []);

  // Sync quantity and current price to CartItem
  useEffect(() => {
    setCartItem((prev) => ({
      ...prev,
      quantity,
      price: basePrice ? basePrice * quantity : 0, // Calculate total price
    }));
  }, [quantity, basePrice]);

  if (!productCategory) {
    return <Spinner />; // Show a loading state until the category is fetched
  }

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Add this function inside the ProductDetails component
  const handleAddToCart = () => {
    const poleSizeVariation = cartItem.variations?.find(
      (variation) => variation.name === "Pole Size"
    );

    console.log("Pole Size [ProductDetails]", poleSizeVariation);

    // Validate pole size
    if (poleSizeVariation?.value === "Other") {
      const customSizeField = cartItem.customFields?.length;

      console.log("Custom Size Filed: [ProductDetails]", customSizeField);

      if (customSizeField === 0) {
        alert("Please enter a custom pole size before adding to cart!");
        return; // Prevent adding to cart if custom size is missing
      }
    }

    // If validation passes, proceed
    console.log("Generated Cart Item:", cartItem);
    // Dispatch to Zustand store here in the next steps
  };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {/* Image gallery */}
      <ProductImageGallery product={product} />

      {/* Product info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <ProductInfo product={product} />
        {/* Render the appropriate pricing module */}
        {renderPricingModule(
          productCategory,
          setBasePrice,
          cartItem,
          setCartItem,
          {
            SimplePricing,
            SingleVariationPricing,
            ComplexVariationPricing,
            BloxxPricing,
          }
        )}

        {/* <div className="mt-10">
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
        </div> */}
        {/* Current Price Display */}
        <CurrentPriceDisplay basePrice={basePrice} quantity={quantity} />

        {/* The Quantity & Add to Cart button block */}
        <div className="flex items-center space-x-8 my-10">
          {/* Quantity Selector */}
          <ManageQuantity
            quantity={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />

          {/* Add to Cart Button */}
          <AddToCartButton
            cartItem={cartItem}
            handleAddToCart={handleAddToCart}
          />
        </div>

        {/* Additional Details w/ Accordion */}
        <AdditionalDetailsAccordion product={product} />
      </div>
    </div>
  );
};

export default ProductDetails;
