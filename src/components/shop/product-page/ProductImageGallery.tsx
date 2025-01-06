import React from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { Product } from "@/types/product";

interface Props {
  product: Product;
}

const ProductImageGallery = ({ product }: Props) => {
  return (
    <>
      <TabGroup className="flex flex-col-reverse">
        {/* Image selector */}
        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <TabList className="grid grid-cols-4 gap-6">
            {product.images?.map((image) => (
              <Tab
                key={image.id}
                className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-500/50 focus:ring-offset-4"
              >
                <span className="sr-only">{product.name}</span>
                <span className="absolute inset-0 overflow-hidden rounded-md">
                  <Image
                    alt=""
                    src={image.src}
                    className="size-full object-cover"
                    width={100}
                    height={100}
                    quality={80} // Optional: Adjust image quality (default is 75)
                    priority={true} // Optional: Prioritize loading for above-the-fold content
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                />
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels>
          {product.images?.map((image) => (
            <TabPanel key={image.src}>
              <Image
                alt={product.name}
                src={image.src || "/placeholder.png"}
                className="aspect-square w-full object-cover sm:rounded-lg"
                width={500}
                height={500}
                quality={80} // Optional: Adjust image quality
              />
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </>
  );
};

export default ProductImageGallery;
