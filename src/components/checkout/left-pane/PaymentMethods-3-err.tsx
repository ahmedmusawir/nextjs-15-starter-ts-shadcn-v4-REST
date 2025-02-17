"use client";

import { createWoocomOrder } from "@/services/checkoutServices";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StripePaymentForm from "../payments/StripePaymentForm";

const PaymentMethods = () => {
  const router = useRouter();
  // Retrieve state from Zustand: checkout data, order validation flag, and order ID.
  const { checkoutData, orderValidated, orderId, setOrderId } =
    useCheckoutStore();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handler for creating the pending WooCommerce order.
  const handleCreateOrder = async () => {
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
      // Store the order ID in the Zustand store
      setOrderId(orderResponse.id);
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("Order submission encountered an error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render logic:
  // 1. If order details are not validated, show an info message.
  if (!orderValidated) {
    return (
      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Please complete your order details (shipping, billing, cart) to enable
          payment.
        </p>
      </div>
    );
  }

  // 2. If the order is validated but no order has been created yet, show the "Create Order & Pay" button.
  if (orderValidated && !orderId) {
    return (
      <div className="mt-6">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          onClick={handleCreateOrder}
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
        >
          {isSubmitting ? "Processing Order..." : "Create Order & Pay"}
        </button>
      </div>
    );
  }

  // 3. If an orderId exists, show the Stripe Payment Form.
  return (
    <>
      <StripePaymentForm />
    </>
  );
};

export default PaymentMethods;
