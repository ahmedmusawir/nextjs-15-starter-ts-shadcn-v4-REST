/*
Product Types for WooCommerce REST API
Description: Defines the structure of a single product and associated types for shop and product pages.
 - ProductCategory: Represents product categories attached to a product.
 - Product: Represents a single product with all required details.
*/

// Represents a single product category
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

// Represents a single product returned from the WooCommerce REST API
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: string;
  description: string;
  short_description: string;
  sku: string;
  categories: ProductCategory[];
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  variations: number[];
  average_rating: string;
  rating_count: number;
  shipping_class_id: number;
  tax_class: string;
}
