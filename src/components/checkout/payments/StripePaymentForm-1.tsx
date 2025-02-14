"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

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

    // TODO: Fetch your PaymentIntent client secret from your Next.js API endpoint.
    // For now, we're using a placeholder.
    const clientSecret = "your_client_secret_here";

    // Retrieve the CardElement instance
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    // Confirm the payment with Stripe
    const { error: confirmError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

    if (confirmError) {
      setError(confirmError.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent?.status === "succeeded") {
      console.log("Payment succeeded", paymentIntent);
      // TODO: Trigger further actions, like order creation in your backend.
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        {isProcessing ? "Processing..." : "Confirm Payment"}
      </button>
    </form>
  );
};

export default StripePaymentForm;
