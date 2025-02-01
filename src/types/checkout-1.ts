import { CartItem } from "./cart";

export interface CheckoutData {
  billing: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone?: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: string;
  shippingMethod: "flat_rate" | "free_shipping" | "local_pickup";
  shippingCost: number;
  cartItems: CartItem[]; // ✅ Uses the full CartItem structure
  coupon?: {
    code: string;
    discount: number;
    free_shipping: boolean;
  };
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
}
