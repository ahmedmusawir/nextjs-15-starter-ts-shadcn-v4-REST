type DiscountType = "fixed_cart" | "percent" | "fixed_product";

export interface Coupon {
  id: number;
  code: string;
  discount_type: DiscountType;
  description: string;
  discount_value: number;
  free_shipping: boolean;
  min_spend: string;
  max_spend: string;
  products_included: number[];
  products_excluded: number[];
  categories_included: number[];
  categories_excluded: number[];
  usage_limit: number | null;
  usage_limit_per_user: number | null;
  expires_on: string;
}

// interface Coupon {
//   id: number;
//   code: string;
//   discount_type: "fixed_cart" | "percent" | "product";
//   discount_value: number;
//   free_shipping: boolean;
//   min_spend: string;
//   max_spend: string;
//   products_included: number[];
//   products_excluded: number[];
//   categories_included: number[];
//   categories_excluded: number[];
//   usage_limit: number | null;
//   usage_limit_per_user: number | null;
//   expires_on: string; // Date string
// }
