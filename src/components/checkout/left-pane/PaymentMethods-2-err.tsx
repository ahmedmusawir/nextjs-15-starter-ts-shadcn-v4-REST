"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { createWoocomOrder } from "@/services/checkoutServices";
import StripePaymentForm from "../payments/StripePaymentForm";

const PaymentMethods = () => {
  const router = useRouter();

  // Retrieve relevant state from Zustand
  const { checkoutData, orderValidated, orderId, setOrderId } =
    useCheckoutStore();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. If shipping/billing is validated but we have no orderId, create a pending WooCommerce order
  useEffect(() => {
    const createPendingOrder = async () => {
      setIsSubmitting(true);
      setError("");
      try {
        const orderResponse = await createWoocomOrder(checkoutData);
        if (!orderResponse) {
          setError("Order submission failed. Please try again.");
          setIsSubmitting(false);
          return;
        }
        console.log("Order submission successful:", orderResponse);
        // Store the newly created order's ID in Zustand
        setOrderId(orderResponse.id);
      } catch (err) {
        console.error("Error submitting order:", err);
        setError("Order submission encountered an error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    // Only create an order if validated, no existing orderId, and not already submitting
    if (orderValidated && !orderId && !isSubmitting) {
      createPendingOrder();
    }
  }, [orderValidated, orderId, isSubmitting, checkoutData, setOrderId]);

  // 2. If shipping is NOT validated, show a message
  if (!orderValidated) {
    return (
      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Please complete your order details (email, shipping, billing, cart) to
          enable payment.
        </p>
      </div>
    );
  }

  // 3. If we’re still creating the order, show a loading message (and any error)
  if (isSubmitting) {
    return (
      <div className="mt-6">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <p>Creating your pending order...</p>
      </div>
    );
  }

  // 4. If we have an error (but not actively submitting), display it
  if (error && !isSubmitting) {
    return (
      <div className="mt-6">
        <p className="text-red-500 text-sm mb-2">{error}</p>
      </div>
    );
  }

  // 5. Otherwise, we have an orderId in place, so show the Stripe payment form
  return (
    <>
      <StripePaymentForm />
    </>
  );
};

export default PaymentMethods;
