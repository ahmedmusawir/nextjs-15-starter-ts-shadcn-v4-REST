import Head from "next/head";
import Page from "@/components/common/Page";
import Row from "@/components/common/Row";
import ProductList from "@/components/shop/ProductList";
import { fetchPaginatedProducts } from "@/services/productServices";

const ShopPageContent = async () => {
  // Fetching the first 12 products
  const initialProducts = await fetchPaginatedProducts(1, 12);
  console.log("Fetched products:", initialProducts);

  return (
    <>
      <Head>
        <title>Next Page ShopPageContent</title>
        <meta name="description" content="This is the demo page" />
      </Head>
      <Page className={""} FULL={false}>
        <Row className="prose max-w-3xl mx-auto">
          <h1 className="text-center">The Shop</h1>
        </Row>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-1">
            <div className="md:flex md:items-center md:justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Trending products
              </h2>
              <a
                href="#"
                className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
              >
                Ask a question...
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
              <ProductList initialProducts={initialProducts} />
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};

export default ShopPageContent;