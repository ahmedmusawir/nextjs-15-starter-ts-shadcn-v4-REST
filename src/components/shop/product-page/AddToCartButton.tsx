import React from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  product: Product;
}
const AddToCartButton = ({ product }: Props) => {
  const { cartItems, setIsCartOpen, increaseCartQuantity, removeFromCart } =
    useCartStore();

  // Check if the product is already in the cart
  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };

  const handleAddToCart = (id: number) => {
    increaseCartQuantity(id); // Add item to the cart by ID
    setIsCartOpen(true); // Open the side cart
  };

  const handleRemoveCartItem = (id: number) => {
    removeFromCart(id); // Remove item from the cart by ID
    setIsCartOpen(true); // Open the side cart
  };
  return (
    <>
      <div className="mt-10 flex">
        {/* Add to Cart Button */}
        <div className="mt-10">
          {!isProductInCart(product.id) && (
            <button
              className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Order
            </button>
          )}
          {isProductInCart(product.id) && (
            <button
              className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              onClick={() => handleRemoveCartItem(product.id)}
            >
              Remove from Cart
            </button>
          )}
        </div>

        <button
          type="button"
          className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
        >
          <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
          <span className="sr-only">Add to favorites</span>
        </button>
      </div>
    </>
  );
};

export default AddToCartButton;
