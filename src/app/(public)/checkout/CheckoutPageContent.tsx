import LeftPane from "@/components/checkout/left-pane/LeftPane";
import RightPane from "@/components/checkout/right-pane/RightPane";

const CheckoutPageContent = () => {
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="">Checkout</h1>

          <section className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Left Panel - Shipping and Contact Info */}
            <LeftPane />

            {/* Right Panel - Order Summary */}
            <RightPane />
          </section>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPageContent;
