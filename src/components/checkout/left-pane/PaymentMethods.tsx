"use client";

import { createWoocomOrder } from "@/services/checkoutServices";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StripePaymentForm from "../payments/StripePaymentForm";

const PaymentMethods = () => {
  const router = useRouter();
  // Retrieve orderValidated flag along with checkoutData
  const { checkoutData, orderValidated } = useCheckoutStore();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      {/* Payment Methods Options (if needed, you might want to leave these always visible or conditionally render them) */}
      <fieldset className="my-10">
        <legend className="sr-only">Payment type</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {[
            { id: "credit-card", title: "Credit card" },
            { id: "paypal", title: "PayPal" },
            { id: "etransfer", title: "eTransfer" },
          ].map((paymentMethod, idx) => (
            <div key={paymentMethod.id} className="flex items-center">
              <input
                defaultChecked={idx === 0}
                id={paymentMethod.id}
                name="payment-type"
                type="radio"
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 [&:not(:checked)]:before:hidden"
              />
              <label
                htmlFor={paymentMethod.id}
                className="ml-3 block text-sm/6 font-medium text-gray-700"
              >
                {paymentMethod.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Conditional Rendering: Payment Form is only shown if orderValidated is true */}
      {orderValidated ? (
        <>
          {/* PAYMENT FORM */}
          <StripePaymentForm />
        </>
      ) : (
        // If order is not validated, display an info message
        <div className="mt-6">
          <p className="text-sm text-gray-600">
            Please complete your order details (shipping, billing, cart) to
            enable payment.
          </p>
        </div>
      )}
    </>
  );
};

export default PaymentMethods;
