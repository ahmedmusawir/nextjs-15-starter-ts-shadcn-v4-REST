import { notFound } from "next/navigation";
import SingleProductContent from "./SingleProductContent";
import {
  fetchAllProductSlugs,
  fetchProductBySlug,
  fetchProductVariationsById,
  fetchRelatedProductsById,
} from "@/services/productServices";

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const slugs = await fetchAllProductSlugs();
    console.log("Fetched product slugs:", slugs);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}

// Single product page component
const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const singleProduct = await fetchProductBySlug(slug);
  console.log("Fetched product data:", singleProduct); // Log for testing purposes

  // Handle 404 with ISR
  if (!singleProduct) {
    notFound();
  }

  const productWithVariations = {
    ...singleProduct,
    variations: await fetchProductVariationsById(
      singleProduct.id,
      singleProduct.variations
    ),
    related_products: await fetchRelatedProductsById(singleProduct.related_ids),
  };

  console.log(
    "varions [SingleProductContent]",
    productWithVariations.variations
  );

  console.log(
    "relatedProducts [SingleProductContent]",
    productWithVariations.related_products
  );

  const relatedProducts = productWithVariations.related_products;

  return (
    <div>
      <SingleProductContent
        singleProduct={singleProduct}
        relatedProducts={relatedProducts}
      />
      {/* Single Product Content by {slug} ... coming soon! */}
    </div>
  );
};

export default SingleProductPage;
