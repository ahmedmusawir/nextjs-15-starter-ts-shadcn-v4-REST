import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import parse from "html-react-parser";
import { Product } from "@/types/product";
import Image from "next/image";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  product: Product;
}

const ProductDetails = ({ product }: Props) => {
  const demoProduct = {
    name: "Zip Tote Basket",
    price: "$140",
    rating: 4,
    images: [
      {
        id: 1,
        name: "Angled view",
        src: "https://tailwindui.com/plus/img/ecommerce-images/product-page-03-product-01.jpg",
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 2,
        name: "Angled view",
        src: "https://res.cloudinary.com/dyb0qa58h/image/upload/v1699357042/qmjhal0k7ygtcfvgea8u.jpg",
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 3,
        name: "Angled view",
        src: "https://res.cloudinary.com/dyb0qa58h/image/upload/v1699357113/kyuonuhab6uge4arosuo.jpg",
        alt: "Angled front view with bag zipped and handles upright.",
      },
      {
        id: 4,
        name: "Angled view",
        src: "https://tailwindui.com/plus/img/ecommerce-images/product-page-03-product-01.jpg",
        alt: "Angled front view with bag zipped and handles upright.",
      },
      // More images...
    ],
    colors: [
      {
        name: "Washed Black",
        bgColor: "bg-gray-700",
        selectedColor: "ring-gray-700",
      },
      {
        name: "White",
        bgColor: "bg-white",
        selectedColor: "ring-gray-400",
      },
      {
        name: "Washed Gray",
        bgColor: "bg-gray-500",
        selectedColor: "ring-gray-500",
      },
    ],
    description: `
    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
  `,
    details: [
      {
        name: "Variations IDs",
        items: product.variations,
      },
      {
        name: "Related Product IDs",
        items: product.related_ids,
      },
      {
        name: "Upsell IDs",
        items: product.upsell_ids,
      },
      // More sections...
    ],
  };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {/* Image gallery */}
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

      {/* Product info */}
      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {product.name}
        </h1>

        <div className="mt-3">
          <h2 className="sr-only">Product information</h2>
          <p className="text-3xl tracking-tight text-gray-900">
            {parse(product.price_html)}
          </p>
        </div>

        {/* Reviews */}
        <div className="mt-3">
          <h3 className="sr-only">Reviews</h3>
          <div className="flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  aria-hidden="true"
                  className={classNames(
                    4 > rating ? "text-indigo-500" : "text-gray-300",
                    "size-5 shrink-0"
                  )}
                />
              ))}
            </div>
            <p className="sr-only">{4} out of 5 stars</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="sr-only">Description</h3>

          <div
            dangerouslySetInnerHTML={{
              __html: product.description || "",
            }}
            className="space-y-6 text-base text-gray-700"
          />
        </div>

        <form className="mt-6">
          {/* Colors */}
          <div>
            <h3 className="text-sm text-gray-600">Color</h3>

            <fieldset aria-label="Choose a color" className="mt-2">
              {/* <RadioGroup
                value={selectedColor}
                onChange={setSelectedColor}
                className="flex items-center gap-x-3"
              >
                {demoProduct.colors.map((color) => (
                  <Radio
                    key={color.name}
                    value={color}
                    aria-label={color.name}
                    className={classNames(
                      color.selectedColor,
                      "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none data-[checked]:ring-2 data-[focus]:data-[checked]:ring data-[focus]:data-[checked]:ring-offset-1"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        color.bgColor,
                        "size-8 rounded-full border border-black/10"
                      )}
                    />
                  </Radio>
                ))}
              </RadioGroup> */}
            </fieldset>
          </div>
        </form>

        <section aria-labelledby="details-heading" className="mt-12">
          <h2 id="details-heading" className="sr-only">
            Additional details
          </h2>

          <div className="divide-y divide-gray-200 border-t">
            {demoProduct.details.map((detail) => (
              <Disclosure key={detail.name} as="div">
                <h3>
                  <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                    <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                      {detail.name}
                    </span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon
                        aria-hidden="true"
                        className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                      />
                      <MinusIcon
                        aria-hidden="true"
                        className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                      />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pb-6">
                  <ul
                    role="list"
                    className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
                  >
                    {detail.items.map((item) => (
                      <li key={item} className="pl-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
