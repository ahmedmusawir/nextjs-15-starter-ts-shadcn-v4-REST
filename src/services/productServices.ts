// Load environment variables for WooCommerce API credentials
const WOOCOM_REST_API_URL = process.env.NEXT_PUBLIC_WOOCOM_REST_API_URL;
const WOOCOM_CONSUMER_KEY = process.env.WOOCOM_CONSUMER_KEY;
const WOOCOM_CONSUMER_SECRET = process.env.WOOCOM_CONSUMER_SECRET_KEY;

/**
 * Fetch Paginated Products
 *
 * This function fetches a paginated list of published products from the
 * custom API route (`/api/get-all-products`). The API route handles
 * communication with the WooCommerce REST API, simplifying client-side fetching.
 *
 * @param {number} page - The current page to fetch.
 * @param {number} perPage - The number of products to fetch per page.
 * @returns {Promise<{ products: Product[]; totalProducts: number }>} An object containing:
 *   - products: Array of product objects.
 *   - totalProducts: Total number of products available.
 * @throws {Error} If the request fails or the response is invalid.
 *
 * Note:
 * - The API route manages headers and authentication for WooCommerce REST API calls.
 * - Simplifies client-side code while maintaining security.
 */
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const fetchPaginatedProducts = async (
  page: number = 1,
  perPage: number = 12
): Promise<{ products: Product[]; totalProducts: number }> => {
  const url = `${BASE_URL}/api/get-all-products?page=${page}&perPage=${perPage}`;

  console.log("Fetching products from API route:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();

  console.log("[productServices] - data", data);

  // Destructure products and totalProducts from the API response
  const { products, totalProducts } = data;

  return { products, totalProducts };
};

import { Product } from "@/types/product";

/**
 * Fetch Initial Products (SSR-Compatible)
 *
 * This function fetches the first page of published products directly from the
 * WooCommerce REST API, ensuring compatibility with SSR and SSG. It bypasses
 * the local API route to prevent build-time errors.
 *
 * @param {number} page - The page number to fetch (default is 1).
 * @param {number} perPage - The number of products per page (default is 12).
 * @returns {Promise<{ products: Product[]; totalProducts: number }>} An object containing the fetched products and the total product count.
 * @throws {Error} If the request fails or the response is invalid.
 *
 * Note:
 * - Intended for server-side fetching during SSR or SSG.
 * - Uses environment variables for WooCommerce API credentials.
 */
export const fetchInitialProducts = async (
  page: number = 1,
  perPage: number = 12
): Promise<{ products: Product[]; totalProducts: number }> => {
  if (!WOOCOM_REST_API_URL || !WOOCOM_CONSUMER_KEY || !WOOCOM_CONSUMER_SECRET) {
    throw new Error(
      "Missing WooCommerce REST API credentials in environment variables."
    );
  }

  // Construct the WooCommerce REST API URL with query parameters
  const url = `${WOOCOM_REST_API_URL}products?per_page=${perPage}&page=${page}&consumer_key=${WOOCOM_CONSUMER_KEY}&consumer_secret=${WOOCOM_CONSUMER_SECRET}&orderby=date&order=asc&status=publish`;

  try {
    console.log("[fetchInitialProducts] Fetching products from:", url);

    // Fetch data from the WooCommerce REST API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[fetchInitialProducts] WooCommerce API Error:", errorData);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    // Parse the response JSON
    const products = await response.json();

    // Extract the total product count from response headers
    const totalProducts = parseInt(
      response.headers.get("X-WP-Total") || "0",
      10
    );

    console.log(
      "[fetchInitialProducts] Products fetched successfully:",
      products
    );
    console.log("[fetchInitialProducts] Total products:", totalProducts);

    return { products, totalProducts };
  } catch (error) {
    console.error("[fetchInitialProducts] Error fetching products:", error);
    throw error;
  }
};
