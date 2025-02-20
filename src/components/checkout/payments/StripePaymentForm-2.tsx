import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { PaymentIntent } from "@stripe/stripe-js";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { createWoocomOrder } from "@/services/orderServices";
import { OrderSummary } from "@/types/order";

const StripePaymentForm = () => {
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  // READ CHECKOUT DATA (e.g. total) FROM THE STORE
  const { checkoutData, orderId } = useCheckoutStore();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // const totalInCents = Math.round(checkoutData.total * 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    // 1. Submit the Payment Element for inline validation
    const submitResult = await elements.submit();
    if (submitResult.error) {
      setError(submitResult.error.message ?? "Validation error");
      setIsProcessing(false);
      return;
    }

    // 2. Create the order in WooCommerce (pending payment)
    try {
      const orderResponse = await createWoocomOrder(checkoutData);
      if (!orderResponse) {
        setError("Order submission failed. Please try again.");
        setIsProcessing(false);
        return;
      }
      console.log("Order submission successful:", orderResponse);

      // Build a simplified order object
      const orderObject: OrderSummary = {
        id: orderResponse.id,
        status: orderResponse.status,
        total: orderResponse.total,
        shippingCost: orderResponse.shipping_lines?.[0]?.total,
        discountTotal: orderResponse.discount_total,
        billing: orderResponse.billing,
        shipping: orderResponse.shipping,
        line_items: orderResponse.line_items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.total,
          image: item.image?.src,
        })),
        coupon: orderResponse.coupon_lines,
      };

      console.log("Simplified Order Object:", orderObject);

      // Persist the order for later use (e.g., Thank You page)
      localStorage.setItem("latestOrder", JSON.stringify(orderObject));

      // Save the order object in state and open the modal to show order summary
      setOrderInfo(orderObject);
      setModalMessage("Processing Payment...");
      setIsOrderModalOpen(true);
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("Order submission encountered an error. Please try again.");
      setIsProcessing(false);
      return;
    }

    // 3. Process Payment
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(checkoutData.total * 100),
          currency: "usd",
          orderId: orderInfo ? orderInfo.id : null,
        }),
      });
      const { clientSecret } = await response.json();

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${SITE_URL}/thankyou`,
        },
      });

      if (result.error) {
        setModalMessage("Sorry Payment Failed... plz contact support");
        setIsProcessing(false);
        return;
      }

      if ("paymentIntent" in result && result.paymentIntent) {
        const paymentIntent = result.paymentIntent as PaymentIntent;
        if (paymentIntent.status === "succeeded") {
          setModalMessage("Success!");
          // Here you would update the order status, clear the cart, and redirect to /thankyou.
          // For now, we'll assume success and let the modal close.
        }
      }
    } catch (error) {
      setModalMessage("Sorry Payment Failed... plz contact support");
      setIsProcessing(false);
      return;
    }

    setIsProcessing(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

      {/* Payment processing modal */}
      {isOrderModalOpen && orderInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-4">Order Processing</h2>
            <p className="text-sm text-gray-700 mb-4">{modalMessage}</p>
            {/* Placeholder spinner */}
            <div className="mb-4">
              <svg
                className="animate-spin h-6 w-6 text-indigo-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
            {/* In case of failure, display a Cancel Order button */}
            {modalMessage.includes("Failed") && (
              <button
                onClick={() => {
                  // Call cancel order logic here if needed, then close modal.
                  setIsOrderModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StripePaymentForm;
