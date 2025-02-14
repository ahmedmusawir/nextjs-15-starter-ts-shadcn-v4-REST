"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import LeftPane from "@/components/checkout/left-pane/LeftPane";
import RightPane from "@/components/checkout/right-pane/RightPane";
import Spinner from "@/components/common/Spinner";

const CheckoutPageContent = () => {
  const router = useRouter();
  // Directly read cartItems from the cart store
  const cartItems = useCartStore((state) => state.cartItems);

  // We'll do the simplest approach: local "mounted" state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // **Use a separate useEffect** to handle the redirect once mounted
  useEffect(() => {
    if (!mounted) return; // Wait until we're mounted
    if (cartItems.length === 0) {
      router.push("/shop");
    }
  }, [mounted, cartItems, router]);

  if (!mounted) {
    // We haven't mounted yet—just show nothing or a spinner
    return <Spinner />;
  }

  // Otherwise, render the normal checkout page
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1>Checkout</h1>
          <section className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <LeftPane />
            <RightPane />
          </section>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPageContent;
