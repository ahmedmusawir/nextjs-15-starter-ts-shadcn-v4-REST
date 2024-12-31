"use client";

import { useEffect, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import ProductListItem from "@/components/shop/ProductListItem";
import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";
import { Product } from "@/types/product";

interface ProductListProps {
  initialProducts: Product[]; // Server-side rendered initial products
}

const ProductList = ({ initialProducts }: ProductListProps) => {
  const { products, setProducts, hasHydrated } = useProductStore();
  const { setTotalProducts, setCursor, setPageData, currentPage } =
    useNumberedPaginationStore();

  useEffect(() => {
    if (!hasHydrated) {
      // Hydrate Zustand store only if not hydrated
      setProducts(initialProducts);
      useProductStore.setState({ hasHydrated: true }); // Mark hydration complete
    }

    setPageData(1, initialProducts); // Cache Page 1
  }, [
    hasHydrated,
    initialProducts,
    setProducts,
    setTotalProducts,
    setCursor,
    setPageData,
  ]);

  // Dynamically decide data to render based on currentPage and Zustand state
  const dataToDisplay =
    currentPage === 1 && !products.length ? initialProducts : products;

  return (
    <>
      {dataToDisplay.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </>
  );
};

export default ProductList;
