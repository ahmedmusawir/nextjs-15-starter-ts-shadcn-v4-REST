"use client";

import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { PaymentIntent } from "@stripe/stripe-js";

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // Fetch PaymentIntent client secret from your API endpoint.
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        /* pass order details if needed */
      }),
    });
    const { clientSecret } = await response.json();

    // Confirm payment using the Payment Element.
    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "/checkout-success",
      },
    });

    if (result.error) {
      setError(result.error.message || "Payment failed");
      setIsProcessing(false);
      return;
    }

    // Use a type guard and assertion to access paymentIntent properly.
    if ("paymentIntent" in result && result.paymentIntent) {
      const paymentIntent = result.paymentIntent as PaymentIntent;
      if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        // Further actions: create order, clear cart, redirect, etc.
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* Payment Element provides a unified payment UI */}
      <div className="border border-gray-300 rounded p-3">
        <PaymentElement />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
};

export default StripePaymentForm;
