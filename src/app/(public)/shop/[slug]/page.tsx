import {
  fetchAllProductSlugs,
  fetchProductBySlug,
} from "@/services/productServices-GQL";
import { notFound } from "next/navigation";
import SingleProductContent from "./SingleProductContent";

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

  console.log("Single Product Slug:", slug); // Log for testing purposes

  // TESTING THE GEN PARAM FUNC
  // const slugs = await fetchAllProductSlugs();
  // console.log("Fetched product slugs:", slugs);

  // Handle 404 with ISR
  // if (!singleProduct) {
  //   notFound();
  // }

  return (
    <div>
      <SingleProductContent />
    </div>
  );
};

export default SingleProductPage;
