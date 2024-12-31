import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useProductStore } from "@/store/useProductStore"; // Import the product store
import { CartItem } from "@/types/cart";

// Type for the Zustand store
interface CartStore {
  cartItems: CartItem[]; // The list of items in the cart
  isCartOpen: boolean; // Whether the cart drawer is open
  isLoading: boolean; // To check the loading state
  setIsLoading: (loading: boolean) => void; // To Set loading state
  setIsCartOpen: (isOpen: boolean) => void; // Toggle the cart drawer
  setCartItems: (newCartItems: CartItem[]) => void; // Directly update cart items
  getItemQuantity: (itemId: number) => number; // Get the quantity of a specific item
  increaseCartQuantity: (itemId: number) => void; // Add item to cart by ID
  decreaseCartQuantity: (itemId: number) => void; // Decrement the quantity of a specific item
  removeFromCart: (itemId: number) => void; // Remove an item from the cart
  clearCart: () => void; // Clear the entire cart
  cartDetails: () => CartItem[]; // Get detailed cart items with product info
  subtotal: () => number; // Calculate the subtotal of all items in the cart
}

// Define the Zustand store with persist middleware
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      setCartItems: (newCartItems: CartItem[]) =>
        set({ cartItems: newCartItems }),

      getItemQuantity: (itemId) =>
        get().cartItems.find((item) => item.id === itemId)?.quantity || 0,

      increaseCartQuantity: (itemId: number) => {
        const state = get();
        const existingItem = state.cartItems.find((item) => item.id === itemId);

        if (existingItem) {
          // Increment the quantity for the existing item
          set({
            cartItems: state.cartItems.map((item) =>
              item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          // Fetch product details from the product store
          const product = useProductStore
            .getState()
            .products.find((p) => p.databaseId === itemId);

          if (!product) {
            console.warn(`Product with ID ${itemId} not found in ProductStore`);
            return;
          }

          // Add a new item with full product details and quantity 1
          set({
            cartItems: [
              ...state.cartItems,
              {
                id: itemId,
                quantity: 1,
                productDetails: product,
              },
            ],
          });
        }
      },

      decreaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (existingItem?.quantity === 1) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== itemId),
            };
          } else {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }
        }),

      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        })),

      clearCart: () => set({ cartItems: [] }),

      cartDetails: () => {
        const cartItems = get().cartItems || [];
        return cartItems; // No additional mapping or transformation needed
      },

      subtotal: () => {
        const cartItems = get().cartItems || [];
        return parseFloat(
          cartItems
            .reduce((acc, cartItem) => {
              const price = parseFloat(
                cartItem.productDetails.price.replace("$", "")
              );
              return acc + price * cartItem.quantity;
            }, 0)
            .toFixed(2)
        );
      },
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
