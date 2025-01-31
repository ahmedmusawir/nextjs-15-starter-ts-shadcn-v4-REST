import { CheckoutData } from "./checkout";

export interface OrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: CheckoutData["billing"];
  shipping: CheckoutData["shipping"];
  line_items: Array<{
    product_id: number;
    variation_id?: number;
    quantity: number;
  }>;
  shipping_lines: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  coupon_lines?: Array<{
    code: string;
  }>;
}
