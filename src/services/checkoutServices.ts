/**
 * Fetches the WooCommerce shipping options from ACF.
 * This includes flat rate thresholds and local pickup zip codes.
 *
 * Returns:
 * - `flat_rates`: Array of flat rate shipping costs based on subtotal thresholds.
 * - `local_pickup_zipcodes`: Array of zip codes eligible for local pickup.
 *
 * Example Response:
 * ```
 * {
 *   "flat_rates": [
 *     { "subtotal_threshold": 100, "shipping_cost": 10 },
 *     { "subtotal_threshold": 250, "shipping_cost": 20 },
 *     { "subtotal_threshold": 500, "shipping_cost": 35 }
 *   ],
 *   "local_pickup_zipcodes": ["30501", "30507", "30503", "30566", "30506"]
 * }
 * ```
 */
import { WOOCOM_REST_GET_SHIPPING_OPTIONS } from "@/rest-api/checkout";
// console.log(
//   "WOOCOM_REST_GET_SHIPPING_OPTIONS [checkoutServices.ts]",
//   WOOCOM_REST_GET_SHIPPING_OPTIONS
// );
export const fetchShippingOptions = async (): Promise<any> => {
  try {
    const response = await fetch(WOOCOM_REST_GET_SHIPPING_OPTIONS || "");
    if (!response.ok) throw new Error("Failed to fetch shipping options");

    const result = await response.json();
    const data = result.acf;

    console.log("ACF data [checkoutServices.ts]", data);

    return {
      flat_rates: [
        {
          subtotal_threshold: Number(data.flat_rate_1_threshold),
          shipping_cost: Number(data.flat_rate_1_cost),
        },
        {
          subtotal_threshold: Number(data.flat_rate_2_threshold_max),
          shipping_cost: Number(data.flat_rate_2_cost),
        },
        {
          subtotal_threshold: Number(data.flat_rate_3_threshold),
          shipping_cost: Number(data.flat_rate_3_cost),
        },
      ],
      local_pickup_zipcodes: data.local_pickup_zipcodes.map(
        (item: { zip_code: string }) => item.zip_code
      ),
      is_free_shipping_for_local: data.is_free_shipping_for_local_pickup,
    };
    // return result.acf;
  } catch (error) {
    console.error("Error fetching shipping options:", error);
    return null;
  }
};

import { WOOCOM_REST_GET_ALL_COUPONS } from "@/rest-api/checkout";

export const fetchAllCoupons = async (): Promise<Coupon[]> => {
  try {
    const response = await fetch(WOOCOM_REST_GET_ALL_COUPONS);
    if (!response.ok) throw new Error("Failed to fetch coupons");

    const coupons = await response.json();

    // Transforming coupon data into a structured format
    return coupons.map((coupon: any) => ({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: parseFloat(coupon.amount),
      free_shipping: coupon.free_shipping,
      min_spend: coupon.minimum_amount,
      max_spend: coupon.maximum_amount,
      products_included: coupon.product_ids || [],
      products_excluded: coupon.excluded_product_ids || [],
      categories_included: coupon.product_categories || [],
      categories_excluded: coupon.excluded_product_categories || [],
      usage_limit: coupon.usage_limit,
      usage_limit_per_user: coupon.usage_limit_per_user,
      expires_on: coupon.date_expires,
    }));
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

/**
 * Fetches all WooCommerce shipping zones.
 *
 * Shipping zones determine available shipping methods based on customer location.
 *
 * Returns:
 * - Array of shipping zones, each containing:
 *   - `id`: Unique identifier for the zone.
 *   - `name`: Zone name (e.g., "Local", "Free Shipping Promo").
 *   - `order`: Priority order of the zone.
 *
 * Example Response:
 * ```
 * [
 *   { "id": 1, "name": "Local", "order": 0 },
 *   { "id": 2, "name": "Free Shipping Promo", "order": 0 }
 * ]
 * ```
 */
import { WOOCOM_REST_GET_SHIPPING_ZONES } from "@/rest-api/checkout";

export const fetchShippingZones = async (): Promise<any[]> => {
  try {
    const response = await fetch(WOOCOM_REST_GET_SHIPPING_ZONES);
    if (!response.ok) throw new Error("Failed to fetch shipping zones");

    const data = await response.json();
    return data.map((zone: any) => ({
      id: zone.id,
      name: zone.name,
      order: zone.order,
    }));
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return [];
  }
};

/**
 * Fetches shipping methods for a given WooCommerce shipping zone.
 *
 * Shipping methods define how orders are delivered within a zone.
 *
 * Parameters:
 * - `zoneId`: The ID of the shipping zone (e.g., Local, Free Shipping Promo).
 *
 * Returns:
 * - Array of shipping methods, each containing:
 *   - `id`: Unique method ID.
 *   - `instance_id`: Instance of the method.
 *   - `title`: Display name of the method.
 *   - `method_id`: Identifier (e.g., "flat_rate", "free_shipping").
 *   - `cost`: (If applicable) Cost of this shipping method.
 *
 * Example Response:
 * ```
 * [
 *   {
 *     "id": 6,
 *     "instance_id": 6,
 *     "title": "Free Shipping",
 *     "method_id": "free_shipping",
 *     "cost": "0.00"
 *   },
 *   {
 *     "id": 7,
 *     "instance_id": 7,
 *     "title": "Flat Rate",
 *     "method_id": "flat_rate",
 *     "cost": "9.99"
 *   }
 * ]
 * ```
 */
import { WOOCOM_REST_GET_SHIPPING_METHODS_BY_ZONE } from "@/rest-api/checkout";
import { Coupon } from "@/types/coupon";

export const fetchShippingMethodsByZone = async (
  zoneId: number
): Promise<any[]> => {
  try {
    const response = await fetch(
      WOOCOM_REST_GET_SHIPPING_METHODS_BY_ZONE(zoneId)
    );
    if (!response.ok)
      throw new Error(`Failed to fetch shipping methods for zone ${zoneId}`);

    const data = await response.json();
    return data.map((method: any) => ({
      id: method.id,
      instance_id: method.instance_id,
      title: method.title,
      method_id: method.method_id,
      cost: method.settings?.cost?.value || "0.00",
    }));
  } catch (error) {
    console.error(`Error fetching shipping methods for zone ${zoneId}:`, error);
    return [];
  }
};
