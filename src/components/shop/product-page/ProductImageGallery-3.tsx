import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { Product } from "@/types/product";
import Spinner from "@/components/common/Spinner";

interface Props {
  product: Product;
}

const ProductImageGallery = ({ product }: Props) => {
  // console.log("Product [ProductImageGallery]:", product.images);

  // Filters out null or undefined entries from the images array
  const validImages = product.images.filter((image) => image !== null);

  // Validation
  if (!product.images || validImages.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      <TabGroup className="flex flex-col-reverse">
        {/* Image selector */}
        <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
          <TabList className="grid grid-cols-2 gap-4">
            {validImages.map((image) => (
              <div
                key={image.id}
                className="relative flex items-center justify-center bg-gray-100 rounded-md overflow-hidden aspect-square"
              >
                {/* Handle YouTube video differently */}
                {image.id === "youtube_video" ? (
                  <div className="flex items-center justify-center bg-gray-200 text-gray-500 w-full h-full">
                    <span>Video Placeholder</span>
                  </div>
                ) : (
                  <Image
                    alt=""
                    src={image.src || "/placeholder.png"}
                    className="object-cover"
                    quality={80}
                    width={500}
                    height={500}
                  />
                )}
              </div>
            ))}
          </TabList>
        </div>
      </TabGroup>
    </>
  );
};

export default ProductImageGallery;
