import React from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CartItem } from "@/types/cart";

interface AddToCartButtonProps {
  cartItem: CartItem; // Pass the entire CartItem
  handleAddToCart: () => void; // Callback for handling add to cart logic
}

const AddToCartButton = ({
  cartItem,
  handleAddToCart,
}: AddToCartButtonProps) => {
  const { cartItems, setIsCartOpen, setCartItems } = useCartStore();

  // Check if the product is already in the cart
  const isProductInCart = cartItems.some((item) => item.id === cartItem.id);

  const addCartItemToStore = () => {
    setCartItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find((item) => item.id === cartItem.id);
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      }
      // Add new item to the cart
      return [...prevItems, cartItem];
    });
    setIsCartOpen(true); // Open the side cart
  };

  return (
    <div className="mt-10 flex">
      {!isProductInCart && (
        <button
          className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
          onClick={addCartItemToStore}
        >
          Add to Cart
        </button>
      )}
      {isProductInCart && (
        <button
          className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
          onClick={() =>
            setCartItems(cartItems.filter((item) => item.id !== cartItem.id))
          }
        >
          Remove from Cart
        </button>
      )}
    </div>
  );
};

export default AddToCartButton;
