import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { createWoocomOrder, updateWoocomOrder } from "@/services/orderServices";
import { OrderSummary } from "@/types/order";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

const StripePaymentForm = () => {
  const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");

  // READ CHECKOUT DATA (e.g. total) FROM THE STORE
  const { checkoutData, removeCoupon } = useCheckoutStore();
  const { clearCart } = useCartStore();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const submitResult = await elements.submit();
    if (submitResult.error) {
      setError(submitResult.error.message ?? "Validation error");
      setIsProcessing(false);
      return;
    }

    try {
      const orderResponse = await createWoocomOrder(checkoutData);
      if (!orderResponse) {
        setError("Order submission failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      console.log("Order submission successful:", orderResponse);

      const orderObject: OrderSummary = {
        // Build simplified order object
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

      localStorage.setItem("latestOrder", JSON.stringify(orderObject)); // Persist the order

      // *** KEY CHANGE: Update the state *immediately* after successful order creation ***
      setOrderInfo(orderObject); // This is the CRITICAL fix

      setModalMessage("Processing Payment...");
      setIsOrderModalOpen(true); // Open the modal

      // Proceed to payment *after* orderInfo is updated in state.
      await processPayment(elements, orderObject); // Call a separate async function
    } catch (err) {
      console.error("Error submitting order:", err);
      setError("Order submission encountered an error. Please try again.");
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async (elements: any, orderInfo: OrderSummary) => {
    if (!stripe) {
      // Check if stripe is loaded
      console.error("Stripe is not initialized yet.");
      setModalMessage("Payment processing failed. Stripe is not ready.");
      return; // Or handle the error as needed
    }
    // Payment submission function
    console.log(
      "checkout total: [StripePaymentForm.tsx - processPayment]",
      checkoutData.total
    );
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(checkoutData.total * 100),
          currency: "usd",
          orderId: orderInfo.id, // Now orderInfo.id will be available.
        }),
      });
      const { clientSecret } = await response.json();

      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${SITE_URL}/thankyou`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setModalMessage("Sorry Payment Failed... plz contact support");
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setModalMessage("Payment successful. Updating order...");

        try {
          const updateResult = await updateWoocomOrder(
            orderInfo.id,
            "processing"
          ); // Use orderInfo.id here
          if (updateResult) {
            // clearCart();
            // removeCoupon();
            router.push("/thankyou"); // Redirect after successful update
          } else {
            setModalMessage("Order update failed. Please contact support.");
          }
        } catch (orderUpdateError) {
          console.error("Order update error:", orderUpdateError);
          setModalMessage("Order update failed. Please contact support.");
        }
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "requires_action"
      ) {
        setModalMessage("Payment requires additional action...");
      } else {
        console.log("Payment status:", result.paymentIntent?.status);
        setModalMessage("Unexpected payment status. Please contact support.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setModalMessage("Payment failed. Please contact support.");
    }
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
