import CheckoutPageContent from "./CheckoutPageContent";
import {
  fetchAllCoupons,
  fetchShippingOptions,
} from "@/services/checkoutServices";

/**
 * The Checkout Page - Server Side Rendering (ISR)
 * - Fetches shipping options from WooCommerce ACF REST API.
 * - Logs results for verification.
 * - Embeds JSON object into the page for debugging.
 */
const Checkout = async () => {
  // console.log("Fetching Shipping Options...");

  const shippingData = await fetchShippingOptions();

  console.log("Shipping Options Fetched:[/checkout/page.tsx]", shippingData);

  const couponData = await fetchAllCoupons();
  console.log("Coupons Fetched:", couponData);

  return (
    <div>
      {/* Embed Shipping Data */}
      <script
        id="shipping-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shippingData),
        }}
      />

      {/* Embed Coupon Data */}
      <script
        id="coupon-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(couponData),
        }}
      />

      {/* Main Checkout Page Content */}
      <CheckoutPageContent />
    </div>
  );
};

export default Checkout;
