"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Example styling object for CardElement
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      iconColor: "black",
      color: "black",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "darkorchid" },
    },
    invalid: {
      iconColor: "red",
      color: "red",
    },
  },
  hidePostalCode: true,
};

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  // Basic UI state
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Single "Place Order" button that handles payment + order creation
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Fetch PaymentIntent clientSecret from your Next.js API (placeholder)
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          /* pass cart total, etc. */
        }),
      });
      const { clientSecret } = await response.json();

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setIsProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);

        // 3. Create or finalize your WooCommerce order
        //    e.g., await createWoocomOrder(checkoutData);

        // 4. Optionally redirect to a success page
        //    router.push("/thankyou");
      }
    } catch (err: any) {
      console.error("Error placing order:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePlaceOrder}>
      <div className="mb-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

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
