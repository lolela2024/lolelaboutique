// import { addItem } from "@/app/actions";

import { FeaturedProducts } from "@/app/components/storefront/FeaturedProducts";
import { ImageSlider } from "@/app/components/storefront/ImageSlider";
import prisma from "@/app/lib/db";

import { StarIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { formatCurrency } from "../../../lib/formatters";
import AddToCartForm from "@/app/components/storefront/AddToCartForm";
import { IoCheckmarkOutline } from "react-icons/io5";
import ProductDescription from "@/app/components/storefront/ProductDescription";
import { Metadata } from "next";
import { cache } from "react";

const getData = cache(async (slug: string) => {
  const data = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
    include: {
      seo: true,
      inventory: true,
      productTags: {
        include:{
          tag:true
        }
      }
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
});

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await getData(params.id);

  const url = `https://lolelaboutique.ro/product/${data?.slug}`;
  const imageUrl =
    data.images?.length > 0 ? data.images[0] : "/default-image.jpg"; // Fallback pentru imagine

  // Funcție pentru a elimina tag-urile HTML
  const stripHtmlTags = (html: string) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Elimină tag-urile HTML
  };

  // Extragem descrierea curată
  const descriptionFinal = data?.seo?.seoDescription
    ? stripHtmlTags(data.seo.seoDescription)
    : "Default product description"; // Fallback dacă nu există descriere

  const keywords = data.productTags.map((tag) => tag.tag).map((tag)=> tag.name)

  const tags = keywords.join(",");

  // Returnează metadatele pe baza SEO-ului produsului
  return {
    title: data?.seo?.seoTitle || data.name, // Dacă nu există `seoTitle`, fallback la `name`
    description: descriptionFinal || "Default product description", // Fallback la o descriere implicită
    keywords: tags || "",
    alternates: {
      canonical: url, // Canonical URL pentru SEO
    },
    openGraph: {
      title: data?.seo?.seoTitle || data.name, // OG Title
      description: descriptionFinal, // OG Description
      url: url, // Open Graph URL pentru social media
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: data.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image", // Twitter Card
      title: data?.seo?.seoTitle || data.name, // Twitter Title
      description: descriptionFinal, // Twitter Description
      images: [imageUrl], // Twitter Image
    },
  };
}

export default async function ProductIdRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);


  const content = data?.description
    ? JSON.parse(JSON.stringify(data.description))
    : null;
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start lg:gap-x-24 py-6">
        <div className="col-span-2 ">
          <ImageSlider images={data.images} slug={data.slug}/>
          <ProductDescription content={content} />
        </div>
        <div className="col-span-1 sticky top-[175px]">
          <div className="mb-4 ">
            {data.discountPercentage && (
              <span className="bg-primary py-1 px-4 rounded-lg text-white font-semibold shadow-sm">
                {`-${data.discountPercentage}%`}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-gray-900 mb-4">
            {data.name}
          </h1>
          <div className="flex items-end ">
            {data.discountAmount && (
              <p className="line-through text-lg">
                {formatCurrency(data.originalPrice as number)}
              </p>
            )}

            <p className="text-3xl mt-2 font-semibold text-[#ad0577]">
              {formatCurrency(data.price)}
            </p>
          </div>
          <div className="my-4 flex items-center gap-1 ">
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </div>

          {/* <div
            className="ProseMirror whitespace-pre-line py-4 rounded-lg"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{
              __html: JSON.parse(JSON.stringify(data.description)),
            }}
          /> */}

          <AddToCartForm dataId={data.id} inventory={data.inventory} />

          <div>
            <p className="flex items-center gap-2">
              <IoCheckmarkOutline size={22} color="green" />
              Plata sigura
            </p>
            <p className="flex items-center gap-2">
              <IoCheckmarkOutline size={22} color="green" />
              Livrare sigură
            </p>
            <p className="flex items-center gap-2">
              <IoCheckmarkOutline size={22} color="green" />
              Retururi gratuite
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts />
      </div>
    </>
  );
}
