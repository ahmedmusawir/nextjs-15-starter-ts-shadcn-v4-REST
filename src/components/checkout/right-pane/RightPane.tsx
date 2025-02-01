"use client";

import Spinner from "@/components/common/Spinner";
import Link from "next/link";
import React from "react";
import { Radio, RadioGroup } from "@headlessui/react";

import {
  CheckCircleIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";
import { useProductStore } from "@/store/useProductStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";

const RightPane = () => {
  const router = useRouter();

  const {
    cartItems,
    subtotal: cartSubtotal,
    isLoading,
    setIsCartOpen,
  } = useCartStore();
  const { checkoutData, setCartItems, calculateTotals } = useCheckoutStore();

  // Sync cart data with checkout store
  useEffect(() => {
    if (checkoutData.cartItems.length === 0 && cartItems.length > 0) {
      setCartItems(cartItems);
      calculateTotals();
    }
  }, [cartItems, checkoutData.cartItems.length, setCartItems, calculateTotals]);

  const cartData =
    checkoutData.cartItems.length > 0 ? checkoutData.cartItems : cartItems;

  // const cartData = cartItems || [];

  // Closes the sidebar Cart Slide
  useEffect(() => {
    setIsCartOpen(false);
  }, [setIsCartOpen]); // This runs once when the component mounts

  // Sync cart data with checkout store and keep it updated
  useEffect(() => {
    if (cartItems.length > 0) {
      setCartItems(cartItems); // Always update checkout cart items
      calculateTotals();
    }
  }, [cartItems, setCartItems, calculateTotals]);

  // Taxes, Shipping & Total
  const taxes = 5.52;
  const shipping = checkoutData.shippingCost || 0;
  const total = checkoutData.subtotal + shipping;

  // Redirect to shop if cart is empty
  const editInCart = () => {
    router.push("/cart");
  };

  // Makes sure Zustand states are loaded
  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="mt-10 lg:mt-0">
      <h2 className="text-2xl text-gray-900">Order summary</h2>
      {isLoading && <Spinner />}

      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {cartData.length > 0 &&
            cartData.map((product) => (
              <li key={product.id} className="flex px-4 py-6 sm:px-6">
                <div className="shrink-0">
                  <img
                    alt={product.name}
                    src={product.image}
                    className="w-20 rounded-md"
                  />
                </div>
                <div className="ml-6 flex flex-1 flex-col">
                  <div className="flex">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                        {product.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.categories.map((cat) => cat.name)}
                      </p>
                    </div>
                    <div className="ml-4 flow-root shrink-0">
                      <button
                        type="button"
                        className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                        onClick={editInCart}
                      >
                        <span className="sr-only">Remove</span>
                        {/* <TrashIcon className="h-5 w-5" /> */}
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-1 items-end justify-between pt-2">
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {product.price}
                    </p>
                    <p>{product.quantity} Items</p>
                  </div>
                </div>
              </li>
            ))}
        </ul>

        <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${cartSubtotal().toFixed(2)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm">Shipping</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${shipping.toFixed(2)}
            </dd>
          </div>
          {/* <div className="flex items-center justify-between">
            <dt className="text-sm">Taxes</dt>
            <dd className="text-sm font-medium text-gray-900">
              ${taxes.toFixed(2)}
            </dd>
          </div> */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">
              ${total.toFixed(2)}
            </dd>
          </div>
        </dl>
        <div className="px-4 py-6">
          <Link href={"/thankyou"}>
            <div
              // type="submit"
              className="w-full text-center rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700"
            >
              Confirm order
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RightPane;
