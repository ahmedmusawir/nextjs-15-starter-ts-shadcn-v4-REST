import { ProductSingle } from "@/types/single-product";
import { Product } from "@/types/product";
/**
 * Fetch All Products
 *
 * This function fetches a paginated list of published products from the
 * WordPress GraphQL API. It uses the `GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS`
 * query to retrieve product details, pagination info, and other metadata.
 *
 * @param {number} first - The number of products to fetch per request.
 * @param {string | null} after - The cursor for pagination. Use `null` for the first page.
 * @returns {Promise<ProductsResponse>} An object containing:
 *   - items: Array of products.
 *   - hasNextPage: Boolean indicating if more pages are available.
 *   - endCursor: Cursor for the next page.
 * @throws {Error} If the request fails or the response is invalid.
 *
 * Note:
 * - Caches the response for 60 seconds using the `next.revalidate` option.
 * - Logs the `first` parameter for debugging purposes.
 */

import { GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS } from "@/graphql/queries/products/getAllPublishedProducts";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

interface ProductsResponse {
  items: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export const fetchAllProducts = async (
  first: number,
  after: string | null
): Promise<ProductsResponse> => {
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS,
      variables: { first, after },
    }),
    next: {
      revalidate: 60, // Revalidate the cached data every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result = await response.json();

  const edges = result?.data?.products?.edges || [];
  const items = edges.map((edge: any) => ({
    cursor: edge.cursor,
    ...edge.node,
  }));

  return {
    items,
    hasNextPage: result?.data?.products?.pageInfo?.hasNextPage || false,
    endCursor: result?.data?.products?.pageInfo?.endCursor || null,
  };
};

// --------------------------- end of fetchAllProducts -----------------------------------------

/**
 * Fetch Total Product Count
 *
 * This function sends a GraphQL request to fetch the total count of
 * published products from the WordPress backend. It utilizes the
 * `GetTotalProducts` query defined in `/graphql/queries/products/getTotalProductCount.ts`.
 *
 * The total count is essential for setting up pagination by determining
 * the total number of pages and rendering pagination controls.
 *
 * @returns {Promise<number>} The total number of published products.
 * @throws {Error} If the request fails or the response is invalid.
 */
export const fetchTotalProductCount = async (): Promise<number> => {
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetTotalProducts {
          totalProducts
        }
      `,
    }),
    next: {
      revalidate: 60, // Cache the result for 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch total product count: ${response.statusText}`
    );
  }

  const result = await response.json();
  const totalProducts = result?.data?.totalProducts;

  if (typeof totalProducts !== "number") {
    throw new Error("Invalid response for total product count.");
  }

  return totalProducts;
};

// ---------------------------- end of fetchTotalProductCount -----------------------------------

/**
 * Fetch Product by ID
 *
 * This function retrieves a single product by its unique database ID from
 * the WordPress GraphQL API. It uses the `GRAPHQL_QUERY_GET_PRODUCT_BY_ID`
 * query to fetch detailed information about the specified product.
 *
 * @param {number} id - The unique database ID of the product to fetch.
 * @returns {Promise<Product | null>} The product data, or `null` if not found.
 * @throws {Error} If the request fails, the response contains errors, or the product is not found.
 *
 * Note:
 * - Throws an error for non-200 HTTP responses or if the GraphQL query returns errors.
 * - Ensure that the `WORDPRESS_API_URL` environment variable is correctly configured.
 */
import { GRAPHQL_QUERY_GET_PRODUCT_BY_ID } from "@/graphql/queries/products/getProductsById";

export const fetchProductById = async (id: number) => {
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_PRODUCT_BY_ID,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product with ID ${id}: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data?.product || null;
};

// ------------------------------- end of fetchProductById -------------------------------------

/**
 * Fetch Product by Slug
 *
 * This function fetches the details of a single product from the WordPress GraphQL API
 * based on the provided slug. It uses the `GRAPHQL_QUERY_GET_SINGLE_PRODUCT_BY_SLUG`
 * query to retrieve product details, including attributes, tags, gallery images,
 * related products, and other metadata.
 *
 * @param {string} slug - The slug of the product to fetch.
 * @returns {Promise<Product>} A product object containing:
 *   - id: Unique identifier of the product.
 *   - name: Name of the product.
 *   - slug: Slug of the product.
 *   - sku: SKU of the product.
 *   - price: Price of the product.
 *   - featuredImage: Featured image of the product.
 *   - productCategories: Categories associated with the product.
 *   - other fields based on the query.
 * @throws {Error} If the request fails or the response is invalid.
 */

import { GRAPHQL_QUERY_GET_SINGLE_PRODUCT_BY_SLUG } from "@/graphql/queries/products/getProductBySlug";

export const fetchProductBySlug = async (
  slug: string
): Promise<ProductSingle> => {
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_SINGLE_PRODUCT_BY_SLUG,
      variables: { slug },
    }),
    next: {
      revalidate: 60, // Revalidate the cached data every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product by slug: ${response.statusText}`);
  }

  const result = await response.json();

  const product = result?.data?.product;

  if (!product) {
    throw new Error("Product not found");
  }

  // return product as ProductSingle;
  return {
    ...product,
    galleryImages: product.galleryImages?.nodes || [],
    related: product.related.nodes || [],
  } as ProductSingle;
};

// ------------------------------- end of fetchProductBySlug -------------------------------------

/**
 * Fetch All Product Slugs
 *
 * This function retrieves all product slugs from the WordPress GraphQL API with
 * support for pagination. It uses the `GRAPHQL_QUERY_GET_ALL_PRODUCT_SLUGS` query
 * to fetch the data in chunks and ensures all slugs are returned, even if the total
 * exceeds the limit of a single request.
 *
 * @returns {Promise<string[]>} An array of product slugs.
 * @throws {Error} If the request fails or the response is invalid.
 *
 * Usage:
 * - Used to generate static pages for all products in Next.js with SSG.
 */

import { GRAPHQL_QUERY_GET_ALL_PRODUCT_SLUGS } from "@/graphql/queries/products/getAllProductSlugs";

interface ProductSlugResponse {
  data: {
    products: {
      nodes: { slug: string }[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export const fetchAllProductSlugs = async (): Promise<string[]> => {
  let hasNextPage = true;
  let endCursor: string | null = null;
  const allSlugs: string[] = [];

  while (hasNextPage) {
    const response: ProductSlugResponse = await fetch(WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GRAPHQL_QUERY_GET_ALL_PRODUCT_SLUGS,
        variables: {
          first: 100,
          after: endCursor,
        },
      }),
    }).then((res) => res.json());

    // Check for GraphQL errors
    if (response.errors) {
      console.error("GraphQL Errors:", response.errors);
      throw new Error("Failed to fetch post slugs");
    }

    const { nodes, pageInfo } = await response.data.products;

    if (!nodes.length) {
      break; // No more slugs to fetch
    }

    // Collect slugs
    allSlugs.push(...nodes.map((node: { slug: string }) => node.slug));

    // Update pagination info
    hasNextPage = pageInfo?.hasNextPage || false;
    endCursor = pageInfo?.endCursor || null;
  }

  return allSlugs;
};

// ------------------------------- end of fetchAllProductSlugs -------------------------------------
