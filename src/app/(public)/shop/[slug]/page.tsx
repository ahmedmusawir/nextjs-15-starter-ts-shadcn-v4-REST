import { notFound } from "next/navigation";
import SingleProductContent from "./SingleProductContent";
import {
  fetchAllProductSlugs,
  fetchProductBySlug,
  fetchProductVariationsById,
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

  return (
    <div>
      <SingleProductContent singleProduct={singleProduct} />
      {/* Single Product Content by {slug} ... coming soon! */}
    </div>
  );
};

export default SingleProductPage;
