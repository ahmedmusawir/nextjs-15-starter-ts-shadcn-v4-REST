"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000",
      fontFamily: 'Roboto, "Open Sans", sans-serif',
      "::placeholder": {
        color: "#aab7c4",
      },
      // Note: backgroundColor or padding in here won't create a visible outer box,
      // but you can still control text background or spacing if you like.
    },
    invalid: {
      color: "red",
    },
  },
  hidePostalCode: true, // If you don't want the postal code field
};

const StripePaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Just a placeholder for demonstration
    console.log("TODO: confirmCardPayment or PaymentIntent logic");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="border border-indigo-300 rounded p-3">
        <CardElement options={cardElementOptions} />
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
