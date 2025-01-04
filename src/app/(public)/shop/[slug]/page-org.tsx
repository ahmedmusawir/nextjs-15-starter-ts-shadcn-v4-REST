import { notFound } from "next/navigation";
import SingleProductContent from "./SingleProductContent";
import {
  fetchAllProductSlugs,
  fetchProductBySlug,
  fetchProductVariationsById,
  fetchRelatedProductsById,
} from "@/services/productServices";
import { products } from "@/demo-data/data";

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

  // TESTING THE GEN PARAM FUNC
  // const slugs = await fetchAllProductSlugs();
  // console.log("Fetched product slugs:", slugs);

  // Handle 404 with ISR
  if (!singleProduct) {
    notFound();
  }

  // TESTING PRODUCT VARIATION
  const variations = await fetchProductVariationsById(
    singleProduct.id,
    singleProduct.variations
  );
  console.log("varions [SingleProductContent]", variations);
  // TESTING RELATED PRODUCTS
  const relatedProducts = await fetchRelatedProductsById(
    singleProduct.related_ids
  );
  console.log("relatedProducts [SingleProductContent]", relatedProducts);

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
