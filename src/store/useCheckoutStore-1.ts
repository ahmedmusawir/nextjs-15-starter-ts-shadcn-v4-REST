import { create } from "zustand";
import { CheckoutData } from "@/types/checkout";
import { CartItem } from "@/types/cart";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  applyCoupon,
  calculateCouponDiscount,
  getCouponsFromStorage,
  validateCoupon,
} from "@/lib/couponUtils";
import { Coupon } from "@/types/coupon";

interface CheckoutStore {
  checkoutData: CheckoutData;
  setBilling: (billing: CheckoutData["billing"]) => void;
  setShipping: (shipping: CheckoutData["shipping"]) => void;
  setPaymentMethod: (method: string) => void;
  setShippingMethod: (
    method: "flat_rate" | "free_shipping" | "local_pickup",
    cost: number
  ) => void;
  setCartItems: (items: CartItem[]) => void;
  setCoupon: (coupon: CheckoutData["coupon"]) => void;
  calculateTotals: () => void;
  resetCheckout: () => void;
  applyCoupon: (code: string) => void;
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      checkoutData: {
        billing: {
          first_name: "",
          last_name: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          email: "",
          phone: "",
        },
        shipping: {
          first_name: "",
          last_name: "",
          address_1: "",
          address_2: "",
          city: "",
          state: "",
          postcode: "",
          country: "",
          phone: "",
        },
        paymentMethod: "stripe",
        shippingMethod: "flat_rate",
        shippingCost: 0,
        cartItems: [],
        coupon: null,
        subtotal: 0,
        taxTotal: 0,
        discountTotal: 0,
        total: 0,
      },

      // Set Billing Address
      setBilling: (billing) =>
        set((state) => ({ checkoutData: { ...state.checkoutData, billing } })),

      // Set Shipping Address
      setShipping: (shipping) =>
        set((state) => ({ checkoutData: { ...state.checkoutData, shipping } })),

      // Set Payment Method
      setPaymentMethod: (method) =>
        set((state) => ({
          checkoutData: { ...state.checkoutData, paymentMethod: method },
        })),

      // Set Shipping Method & Cost
      setShippingMethod: (method, cost) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            shippingMethod: method,
            shippingCost: cost,
          },
        })),

      // Set Cart Items
      setCartItems: (items) =>
        set((state) => ({
          checkoutData: { ...state.checkoutData, cartItems: items },
        })),

      // Set Coupon Data
      setCoupon: (coupon) =>
        set((state) => ({
          checkoutData: {
            ...state.checkoutData,
            coupon,
            discountTotal: coupon ? coupon.discount : 0,
          },
        })),

      // Calculate Totals
      calculateTotals: () =>
        set((state) => {
          const subtotal = state.checkoutData.cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity, // Fix: Multiply price by quantity
            0
          );

          const discount = state.checkoutData.discountTotal || 0;
          const shippingCost = state.checkoutData.shippingCost || 0;
          const taxTotal = 0; // Future implementation
          const total = subtotal + shippingCost - discount;

          return {
            checkoutData: { ...state.checkoutData, subtotal, taxTotal, total },
          };
        }),

      // Apply Coupon
      applyCoupon: (code) =>
        set((state) => {
          const { checkoutData } = state;

          // Find the coupon object by its code
          const couponList = getCouponsFromStorage(); // Example function to fetch coupons
          const validCoupon = couponList.find((c) => c.code === code);

          if (!validCoupon || !validateCoupon(validCoupon, checkoutData)) {
            return {
              checkoutData: {
                ...checkoutData,
                coupon: null,
                discountTotal: 0,
              },
            };
          }

          // Apply the coupon
          const updatedCheckoutData = applyCoupon(validCoupon, checkoutData);

          return { checkoutData: updatedCheckoutData };
        }),

      // Reset Checkout (After Order is Placed)
      resetCheckout: () =>
        set({
          checkoutData: {
            billing: {
              first_name: "",
              last_name: "",
              address_1: "",
              address_2: "",
              city: "",
              state: "",
              postcode: "",
              country: "",
              email: "",
              phone: "",
            },
            shipping: {
              first_name: "",
              last_name: "",
              address_1: "",
              address_2: "",
              city: "",
              state: "",
              postcode: "",
              country: "",
              phone: "",
            },
            paymentMethod: "stripe",
            shippingMethod: "flat_rate",
            shippingCost: 0,
            cartItems: [],
            coupon: null,
            subtotal: 0,
            taxTotal: 0,
            discountTotal: 0,
            total: 0,
          },
        }),
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ checkoutData: state.checkoutData }),
    }
  )
);
