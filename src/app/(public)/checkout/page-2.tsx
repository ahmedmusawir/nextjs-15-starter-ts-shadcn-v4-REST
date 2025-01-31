import CheckoutPageContent from "./CheckoutPageContent";
import {
  fetchShippingMethodsByZone,
  fetchShippingOptions,
  fetchShippingZones,
} from "@/services/checkoutServices";

/**
 * The Checkout Page - Server Side Rendering (ISR)
 * - Fetches shipping options from WooCommerce ACF REST API.
 * - Logs results for verification.
 * - Embeds JSON object into the page for debugging.
 */
const Checkout = async () => {
  // console.log("🚀 Fetching Shipping Options...");

  const shippingOptions = await fetchShippingOptions();

  console.log(
    "✅ Shipping Options Fetched:[/checkout/page.tsx]",
    shippingOptions
  );

  const shippingZones = await fetchShippingZones();

  console.log("✅ Shipping Zones Fetched:[/checkout/page.tsx]", shippingZones);

  const shippingMethodsByZone = await fetchShippingMethodsByZone(1);

  console.log(
    "✅ Shipping Methods by Zone ID Fetched:[/checkout/page.tsx]",
    shippingMethodsByZone
  );

  return (
    <div>
      {/* Embed Shipping Data */}
      {/* <script
        id="shipping-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(shippingData),
        }}
      /> */}

      {/* Embed Coupon Data */}
      {/* <script
        id="coupon-data"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(couponData),
        }}
      /> */}

      <h1>The Checkout Page ISR Testing...</h1>
      {/* <pre>{JSON.stringify(shippingOptions, null, 2)}</pre> */}
      {/* Commented out until the UI is ready */}
      {/* <CheckoutPageContent /> */}
    </div>
  );
};

export default Checkout;
