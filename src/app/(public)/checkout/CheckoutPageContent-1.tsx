"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import LeftPane from "@/components/checkout/left-pane/LeftPane";
import RightPane from "@/components/checkout/right-pane/RightPane";
import Spinner from "@/components/common/Spinner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe using your publishable key (exposed with NEXT_PUBLIC_ prefix)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutPageContent = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const [mounted, setMounted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && cartItems.length === 0) {
      router.push("/shop");
    }
  }, [mounted, cartItems, router]);

  // Fetch PaymentIntent client secret from your API endpoint
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: 50, // $0.50 in cents
              currency: "usd",
            }),
          }
        );
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
  }, []);

  if (!mounted) return <Spinner />;
  if (!clientSecret) return <Spinner />;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
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
    </Elements>
  );
};

export default CheckoutPageContent;
