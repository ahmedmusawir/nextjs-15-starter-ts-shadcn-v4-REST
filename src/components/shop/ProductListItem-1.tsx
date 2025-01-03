"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

const ProductListItem = ({ product }: Props) => {
  const featuredImage = product.images[0]?.src || "/placeholder.jpg";
  const { increaseCartQuantity, setIsCartOpen, removeFromCart, cartItems } =
    useCartStore();

  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };

  const handleAddToCart = (id: number) => {
    // console.log("Prod ID: (ShopPageContent)", id);
    increaseCartQuantity(id);
    setIsCartOpen(true);
  };
  const handleRemoveCartItem = (id: number) => {
    removeFromCart(id);
    setIsCartOpen(true);
  };
  return (
    <div key={product.id} className="group relative my-5">
      <Link href={`/shop/${product.slug}`}>
        <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
          <Image
            src={featuredImage}
            alt={product.name}
            className="object-cover w-full h-full rounded-lg"
            width={300}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="/placeholder.jpg" // Ensure this is correctly pointed
            loading="eager" // Load critical images immediately
            priority={true} // Prioritize this image for LCP
          />
        </div>
      </Link>
      <section className="">
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {product.categories.map((cat) => cat.name)}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {product.price}
        </p>

        {!isProductInCart(product.id) && (
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 float-right xl:mb-10"
            onClick={() => handleAddToCart(product.id)}
          >
            Add To Cart
          </button>
        )}
        {isProductInCart(product.id) && (
          <button
            type="button"
            className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 float-right"
            onClick={() => handleRemoveCartItem(product.id)}
          >
            Remove Item
          </button>
        )}
      </section>
    </div>
  );
};

export default ProductListItem;
