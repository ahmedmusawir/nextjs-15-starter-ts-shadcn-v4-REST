"use client";

import React, { useState } from "react";
import ContactEmail from "./ContactEmail";
import ShippingInfo from "./ShippingInfo";
import PaymentMethods from "./PaymentMethods";
import OrderValidation from "./OrderValidation";

const LeftPane = () => {
  return (
    <div>
      {/* OrderValidation runs its useEffect to monitor checkoutData and update orderValidated */}
      <OrderValidation />

      <div className="mt-10">
        <h1 className="text-2xl text-gray-900">Contact information</h1>

        <ContactEmail />
      </div>

      <div className="mt-10 border-t border-gray-200 pt-10">
        <h1 className="text-2xl text-gray-900">Shipping information</h1>

        <ShippingInfo />
      </div>

      {/* Payment */}
      <div className="mt-10 border-t border-gray-200 pt-10">
        <h1 className="text-2xl text-gray-900">Payment</h1>

        <PaymentMethods />
      </div>
    </div>
  );
};

export default LeftPane;
