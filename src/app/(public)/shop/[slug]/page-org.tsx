import { notFound } from "next/navigation";

import SingleProductContent from "./SingleProductContent";
import {
  fetchAllProductSlugs,
  fetchProductBySlug,
} from "@/services/productServices-GQL";

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

  return (
    <div>
      <SingleProductContent singleProduct={singleProduct} />
    </div>
  );
};

export default SingleProductPage;
