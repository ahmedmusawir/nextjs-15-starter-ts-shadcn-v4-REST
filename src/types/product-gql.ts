/* 
Product Types for WooCommerce GraphQL Query
Description: Defines the structure of a single product and the product store.
 - Product: Represents a single product with its key details.
 - ProductCategory: Represents product categories attached to a product.
 - ProductStore: Represents the list of products.
*/

export interface ProductCategory {
  name: string;
}

export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku: string;
  price: string;
  productCategories: {
    nodes: { name: string }[];
  };
  image: {
    sourceUrl: string;
  };
  cursor: string;
}

export interface ProductStore {
  products: Product[];
}
