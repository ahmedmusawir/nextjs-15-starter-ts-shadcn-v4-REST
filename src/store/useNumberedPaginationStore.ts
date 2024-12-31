import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";
import { useProductStore } from "./useProductStore";
import { Product } from "@/types/product";
import { fetchAllProducts } from "@/services/productServices-GQL";

// Define the state and actions for pagination
interface NumberedPaginationStore {
  currentPage: number; // Current active page
  totalProducts: number; // Total number of products
  productsPerPage: number; // Number of products displayed per page
  totalPages: number; // Total number of pages (calculated)
  cursors: (string | null)[]; // Array of cursors for previous pages
  pageData: Record<number, Product[]>; // Cache for products per page
  setTotalProducts: (count: number) => void; // Action to set total products
  setCursor: (page: number, cursor: string | null) => void; // Action to update cursors
  setPageData: (page: number, products: Product[]) => void; // Action to cache products
  // goToPage: (page: number) => Promise<void>; // Navigate to a specific page
  nextPage: () => Promise<void>; // Navigate to the next page
  prevPage: () => Promise<void>; // Navigate to the previous page
  loading: boolean; // Track loading status
  setLoading: (loading: boolean) => void; // Action to toggle loading
  resetPagination: (
    initialProducts: Product[],
    initialCursor: string | null
  ) => void;
}

export const useNumberedPaginationStore = create<NumberedPaginationStore>()(
  persist(
    (set, get) => ({
      currentPage: 1, // Start at the first page
      totalProducts: 0, // Initialize with zero products
      productsPerPage: 12, // Default number of products per page
      totalPages: 0, // Dynamically calculated total pages
      cursors: [null], // First page starts with no cursor
      pageData: {}, // Cache for products per page
      loading: false,
      setLoading: (loading) => set({ loading }),

      setPageData: (page, products) =>
        set((state) => ({
          pageData: { ...state.pageData, [page]: products }, // Cache products for the given page
        })),

      // Store the cursor for a specific page
      setCursor: (page, cursor) => {
        set((state) => {
          const updatedCursors = [...state.cursors];
          updatedCursors[page] = cursor;
          return { cursors: updatedCursors };
        });
      },

      // Set the total number of products and recalculate total pages
      setTotalProducts: (count) =>
        set((state) => ({
          totalProducts: count,
          totalPages: Math.ceil(count / state.productsPerPage),
        })),

      // Navigate to a specific page
      // goToPage: async (page) => {
      //   const { productsPerPage, totalPages, currentPage } = get();
      //   const productStore = useProductStore.getState();

      //   console.log("[PaginationStore] Navigating to page:", page);

      //   if (page < 1 || page > totalPages) {
      //     console.error("Invalid page number:", page);
      //     return;
      //   }

      //   // Check if products for the requested page are already available
      //   if (page === currentPage) {
      //     console.log("[PaginationStore] Already on the requested page:", page);
      //     return;
      //   }

      //   // Calculate the cursor for the requested page
      //   const currentProducts = productStore.products;
      //   const afterCursor =
      //     page > 1 && currentProducts.length
      //       ? currentProducts[currentProducts.length - 1].cursor
      //       : null;

      //   console.log(
      //     "[PaginationStore] Calculated Cursor for Page:",
      //     afterCursor
      //   );

      //   try {
      //     // Fetch products for the requested page
      //     const productsResponse = await fetchAllProducts(
      //       productsPerPage,
      //       afterCursor
      //     );

      //     if (productsResponse.items.length > 0) {
      //       productStore.setProducts(productsResponse.items); // Set new page products
      //       set({ currentPage: page });
      //     } else {
      //       console.warn(
      //         `[PaginationStore] No products found for page ${page}. Retrying with page 1.`
      //       );
      //       set({ currentPage: 1 });
      //       const fallbackResponse = await fetchAllProducts(
      //         productsPerPage,
      //         null // Fallback to the first page
      //       );
      //       productStore.setProducts(fallbackResponse.items);
      //     }
      //   } catch (error) {
      //     console.error("[PaginationStore] Error fetching products:", error);
      //   }
      // },

      // Navigate to the next page
      nextPage: async () => {
        const { currentPage, pageData, cursors, setLoading } = get();
        const productStore = useProductStore.getState();

        setLoading(true); // Start loading spinner

        try {
          if (pageData[currentPage + 1]) {
            productStore.setProducts(pageData[currentPage + 1]);
            set({ currentPage: currentPage + 1 });
          } else {
            const cursor = cursors[currentPage - 1] || null;
            const productsResponse = await fetchAllProducts(12, cursor);
            const newProducts = productsResponse.items;

            if (newProducts.length) {
              productStore.setProducts(newProducts);
              set((state) => {
                const updatedCursors = [...state.cursors];
                updatedCursors[currentPage] = productsResponse.hasNextPage
                  ? productsResponse.endCursor
                  : null;

                return {
                  currentPage: currentPage + 1,
                  cursors: updatedCursors,
                  pageData: {
                    ...state.pageData,
                    [currentPage + 1]: newProducts,
                  },
                };
              });
            }
          }
        } catch (error) {
          console.error("[nextPage] Error:", error);
        } finally {
          setLoading(false); // Stop loading spinner
        }
      },

      // Navigate to the previous page
      prevPage: async () => {
        const { currentPage, pageData, setLoading } = get();
        const productStore = useProductStore.getState();

        setLoading(true); // Start loading spinner

        try {
          if (currentPage > 1) {
            const prevProducts = pageData[currentPage - 1];
            if (prevProducts) {
              productStore.setProducts(prevProducts);
              set({ currentPage: currentPage - 1 });
            }
          }
        } catch (error) {
          console.error("[prevPage] Error:", error);
        } finally {
          setLoading(false); // Stop loading spinner
        }
      },

      resetPagination: (initialProducts, initialCursor) => {
        const productStore = useProductStore.getState();
        productStore.setProducts(initialProducts); // Reset products to initial SSR data
        set({
          currentPage: 1,
          cursors: [initialCursor],
          pageData: { 1: initialProducts }, // Cache initial page data
        });
      },
    }),
    {
      name: "numbered-pagination-storage", // Key for localforage
      storage: createJSONStorage(() => localforage), // Use localforage for IndexedDB
      partialize: (state) => ({
        currentPage: state.currentPage,
        totalProducts: state.totalProducts,
        productsPerPage: state.productsPerPage,
        totalPages: state.totalPages,
        pageData: state.pageData, // Persist cached pages
      }), // Persist only relevant fields
    }
  )
);
