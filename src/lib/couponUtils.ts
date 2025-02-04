/**
 * Utility functions for coupon validation and application in the checkout flow.
 * - Ensures valid coupon usage (expiry, conditions, restrictions).
 * - Applies discount based on coupon type.
 * - Adjusts shipping cost if free shipping is included.
 * - Recalculates cart totals after discount application.
 */

import { CheckoutData } from "@/types/checkout";
import { CartItem } from "@/types/cart";

interface Coupon {
  id: number;
  code: string;
  discount_type: "fixed_cart" | "percent" | "product";
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
  expires_on: string; // Date string
}

/**
 * Validates a coupon based on expiry date, min/max spend, and product/category restrictions.
 * @param coupon - The coupon object from the available coupon list.
 * @param checkoutData - Current checkout state (cart, subtotal, shipping, etc.).
 * @returns {boolean} - Returns true if the coupon is valid, otherwise false.
 */
export const validateCoupon = (
  coupon: Coupon,
  checkoutData: CheckoutData
): boolean => {
  const now = new Date();
  const expiryDate = new Date(coupon.expires_on);

  // 1. Check if coupon is expired
  if (now > expiryDate) {
    console.warn("Coupon expired:", coupon.code);
    return false;
  }

  // 2. Validate min/max spend requirements
  const subtotal = checkoutData.subtotal;
  const minSpend = parseFloat(coupon.min_spend);
  const maxSpend = parseFloat(coupon.max_spend);

  if (minSpend > 0 && subtotal < minSpend) {
    console.warn("Minimum spend not met for coupon:", coupon.code);
    return false;
  }
  if (maxSpend > 0 && subtotal > maxSpend) {
    console.warn("Maximum spend exceeded for coupon:", coupon.code);
    return false;
  }

  // 3. Validate product/category restrictions
  const cartProductIds = checkoutData.cartItems.map((item) => item.id);
  const cartCategoryIds = checkoutData.cartItems.flatMap(
    (item) => item.categories
  );
  const cartCategoryIdsOnly = cartCategoryIds.map((category) => category.id);

  if (
    coupon.products_included.length > 0 &&
    !cartProductIds.some((id) => coupon.products_included.includes(id))
  ) {
    console.warn("Coupon not applicable to any cart items:", coupon.code);
    return false;
  }

  if (
    coupon.products_excluded.length > 0 &&
    cartProductIds.some((id) => coupon.products_excluded.includes(id))
  ) {
    console.warn("Coupon applies to excluded products:", coupon.code);
    return false;
  }

  if (
    coupon.categories_included.length > 0 &&
    !cartCategoryIdsOnly.some((id) => coupon.categories_included.includes(id))
  ) {
    console.warn("Coupon not applicable to any cart categories:", coupon.code);
    return false;
  }

  if (
    coupon.categories_excluded.length > 0 &&
    cartCategoryIdsOnly.some((id) => coupon.categories_excluded.includes(id))
  ) {
    console.warn("Coupon applies to excluded categories:", coupon.code);
    return false;
  }

  return true;
};

/**
 * Applies a valid coupon to the checkout process.
 * - Adjusts the subtotal based on discount type.
 * - Enables free shipping if applicable.
 * - Returns updated checkout state.
 * @param coupon - The validated coupon object.
 * @param checkoutData - Current checkout state.
 * @returns {CheckoutData} - Updated checkout state with applied discount.
 */
export const applyCoupon = (
  coupon: Coupon,
  checkoutData: CheckoutData
): CheckoutData => {
  let discountAmount = 0;
  let updatedShippingCost = checkoutData.shippingCost;

  switch (coupon.discount_type) {
    case "fixed_cart":
      discountAmount = coupon.discount_value;
      break;
    case "percent":
      discountAmount = (checkoutData.subtotal * coupon.discount_value) / 100;
      break;
    case "product":
      discountAmount = checkoutData.cartItems.reduce((total, item) => {
        if (coupon.products_included.includes(item.id)) {
          return (
            total + (item.price * item.quantity * coupon.discount_value) / 100
          );
        }
        return total;
      }, 0);
      break;
  }

  // Ensure discount does not exceed subtotal
  discountAmount = Math.min(discountAmount, checkoutData.subtotal);

  // Apply free shipping if coupon allows it
  if (coupon.free_shipping) {
    updatedShippingCost = 0;
  }

  return {
    ...checkoutData,
    discountTotal: discountAmount,
    total: checkoutData.subtotal + updatedShippingCost - discountAmount,
    shippingCost: updatedShippingCost,
    coupon: {
      code: coupon.code,
      discount: discountAmount, // Ensuring this is set correctly
      free_shipping: coupon.free_shipping,
    },
  };
};

/**
 * Removes the applied coupon and resets totals.
 * @param checkoutData - The checkout state before coupon application.
 * @returns {CheckoutData} - Checkout state with coupon removed.
 */
export const removeCoupon = (checkoutData: CheckoutData): CheckoutData => {
  return {
    ...checkoutData,
    discountTotal: 0,
    total: checkoutData.subtotal + checkoutData.shippingCost,
    coupon: null,
  };
};

/**
 * Utility functions for handling coupon logic in the checkout process.
 * - Applies various types of discounts (fixed, percentage, product-specific)
 * - Ensures compliance with coupon restrictions (expiration, min/max spend, exclusions)
 * - Prevents discounts from making the total negative
 */

export const calculateCouponDiscount = (
  coupon: Coupon,
  cartItems: CartItem[],
  subtotal: number
): number => {
  // Validate expiration date
  const now = new Date();
  const expiryDate = new Date(coupon.expires_on);
  if (now > expiryDate) {
    console.warn(`Coupon ${coupon.code} has expired.`);
    return 0;
  }

  // Validate min/max spend
  const minSpend = parseFloat(coupon.min_spend || "0");
  const maxSpend = parseFloat(coupon.max_spend || "0");
  if (subtotal < minSpend) {
    console.warn(
      `Coupon ${coupon.code} requires a minimum spend of $${minSpend}.`
    );
    return 0;
  }
  if (maxSpend > 0 && subtotal > maxSpend) {
    console.warn(
      `Coupon ${coupon.code} can only be used on orders up to $${maxSpend}.`
    );
    return 0;
  }

  let discount = 0;

  const normalizedDiscountType =
    coupon.discount_type === "product" ? "fixed_product" : coupon.discount_type;

  // Apply discount based on type
  if (normalizedDiscountType === "fixed_cart") {
    discount = coupon.discount_value;
  } else if (normalizedDiscountType === "percent") {
    discount = (coupon.discount_value / 100) * subtotal;
  } else if (normalizedDiscountType === "fixed_product") {
    discount = cartItems.reduce((totalDiscount, item) => {
      if (coupon.products_included.includes(item.id)) {
        return totalDiscount + coupon.discount_value * item.quantity;
      }
      return totalDiscount;
    }, 0);
  }

  // Ensure discount does not exceed subtotal
  return Math.min(discount, subtotal);
};

/**
 * Retrieves the embedded coupon data from the checkout page.
 * - Extracts the JSON stored in the <script> tag (id="coupon-data").
 * - Parses the JSON and returns an array of available coupons.
 * - If no data is found, returns an empty array.
 */
export const getCouponsFromStorage = (): Coupon[] => {
  const script = document.getElementById("coupon-data");
  if (!script) {
    console.warn("Coupon data script not found in DOM.");
    return [];
  }

  try {
    const coupons: Coupon[] = JSON.parse(script.textContent || "[]");
    return coupons;
  } catch (error) {
    console.error("Error parsing coupon data:", error);
    return [];
  }
};
