import { Product } from "./product";

// Type for individual cart items
export interface CartItem {
  id: number; // Product ID
  quantity: number; // Quantity of the product in the cart
  productDetails: Product; // Full product details
}
