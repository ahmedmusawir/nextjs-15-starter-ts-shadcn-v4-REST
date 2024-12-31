"use client";

import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";
import { Product } from "@/types/product";
import { useEffect } from "react";

interface ShopPageResetProps {
  initialProducts: Product[];
  initialCursor: string | null;
}

const ShopPageReset = ({
  initialProducts,
  initialCursor,
}: ShopPageResetProps) => {
  const { resetPagination } = useNumberedPaginationStore();

  // Reset pagination when the component mounts
  useEffect(() => {
    resetPagination(initialProducts, initialCursor);
  }, [resetPagination, initialProducts, initialCursor]);

  return null; // This component is invisible
};

export default ShopPageReset;
