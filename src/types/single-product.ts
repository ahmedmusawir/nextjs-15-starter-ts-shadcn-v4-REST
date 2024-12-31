/* 
Product Types for WooCommerce GraphQL Query
Description: Defines the structure of a single product and related data for the new query.
 - Product: Represents a single product with its key details.
 - ProductCategory: Represents product categories attached to a product.
 - ProductTag: Represents tags associated with a product.
 - ProductAttribute: Represents attributes of a product.
 - RelatedProduct: Represents related products.
 - ProductStore: Represents the list of products.
*/

export interface ProductCategory {
  name: string;
  slug: string;
}

export interface ProductTag {
  name: string;
  slug: string;
}

export interface ProductAttribute {
  name: string;
}

export interface ProductGalleryImage {
  sourceUrl: string;
}

export interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface ProductSingle {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  averageRating?: number;
  reviewCount?: number;
  onSale?: boolean;
  totalSales?: number;
  dateOnSaleFrom?: string;
  dateOnSaleTo?: string;
  status?: string;
  catalogVisibility?: string;
  categories?: string[];
  productTags?: ProductTag[];
  attributes?: ProductAttribute[];
  galleryImages?: ProductGalleryImage[];
  related?: RelatedProduct[];
  price?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
    };
  };
  productCategories?: {
    nodes: ProductCategory[];
  };
}

// export interface ProductStore {
//   products: Product[];
// }
