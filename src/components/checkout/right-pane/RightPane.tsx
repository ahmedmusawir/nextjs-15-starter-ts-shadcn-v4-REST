"use client";

import Spinner from "@/components/common/Spinner";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import CheckoutCartItems from "./CheckoutCartItems";
import ApplyCoupon from "./ApplyCoupon";

const RightPane = () => {
  const {
    cartItems,
    subtotal: cartSubtotal,
    isLoading,
    setIsCartOpen,
  } = useCartStore();
  const { checkoutData, setCartItems, calculateTotals } = useCheckoutStore();

  // console.log("Checkout Data [RightPane]", checkoutData);

  // Sync cart data with checkout store
  useEffect(() => {
    if (checkoutData.cartItems.length === 0 && cartItems.length > 0) {
      setCartItems(cartItems);
      calculateTotals();
    }
  }, [cartItems, checkoutData.cartItems.length, setCartItems, calculateTotals]);

  const cartData =
    checkoutData.cartItems.length > 0 ? checkoutData.cartItems : cartItems;

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

  const shipping = checkoutData.shippingCost || 0;
  const total = checkoutData.total;

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
        {/* CART ITMES DISPLAY COMPONENT */}
        <CheckoutCartItems cartData={cartData} />

        {/* SUBTOTAL, SHIPPING & TOTAL CACULATION */}
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
          {/* DEMO BLOCK FOR COUPON APPLIED  */}
          {/* Coupon Discount - Only show if a coupon is applied */}
          {/* Coupon Discount */}
          {checkoutData.coupon && (
            <div className="flex flex-col text-green-600">
              <div className="flex items-center justify-between">
                <dt className="text-sm">
                  Coupon Applied ({checkoutData.coupon.code}):
                </dt>
                <dd className="text-sm font-medium">
                  -${checkoutData.discountTotal.toFixed(2)}
                </dd>
              </div>
              {/* 🔥 Small text for coupon description */}
              {checkoutData.coupon.description && (
                <p className="text-xs text-gray-500">
                  {checkoutData.coupon.description}
                </p>
              )}
            </div>
          )}

          {/* {checkoutData.coupon && (
            <div className="flex items-center justify-between text-green-600">
              <dt className="text-sm">
                Coupon Applied ({checkoutData.coupon.code}):
              </dt>
              <dd className="text-sm font-medium">
                -${checkoutData.discountTotal.toFixed(2)}
              </dd>
            </div>
          )} */}
          {/* THE APPLY COUPON BLOCK */}
          <ApplyCoupon />
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">
              ${total.toFixed(2)}
            </dd>
          </div>
        </dl>
        <div className="px-4 py-6">
          {/* <Link href={"/thankyou"}>
            <div className="w-full text-center rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700">
              Confirm order
            </div>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default RightPane;
