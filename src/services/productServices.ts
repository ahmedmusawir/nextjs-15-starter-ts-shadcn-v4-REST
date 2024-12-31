import { WOOCOM_REST_GET_ALL_PRODUCTS } from "@/rest-api/products";
import { Product } from "@/types/product";

/**
 * Fetch Paginated Products
 *
 * This function fetches a paginated list of published products from the
 * WooCommerce REST API. It uses the `WOOCOM_REST_GET_ALL_PRODUCTS` endpoint
 * to retrieve product details.
 *
 * @param {number} page - The current page to fetch.
 * @param {number} perPage - The number of products to fetch per page.
 * @returns {Promise<Product[]>} An array of product objects.
 * @throws {Error} If the request fails or the response is invalid.
 *
 * Note:
 * - Handles pagination via the `page` and `per_page` query parameters.
 * - Logs the `page` and `perPage` parameters for debugging purposes.
 */
export const fetchPaginatedProducts = async (
  page: number = 1,
  perPage: number = 12
): Promise<Product[]> => {
  const url = WOOCOM_REST_GET_ALL_PRODUCTS(page, perPage);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result = await response.json();
  return result;
};
