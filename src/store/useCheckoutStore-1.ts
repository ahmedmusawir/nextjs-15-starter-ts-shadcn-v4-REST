import { create } from "zustand";
import { CheckoutData } from "@/types/checkout";
import { CartItem } from "@/types/cart";

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
}

export const useCheckoutStore = create<CheckoutStore>((set, get) => ({
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
}));
