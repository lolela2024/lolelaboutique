import Image from "next/image";
import Link from "next/link";
import all from "@/public/all.jpeg";
import men from "@/public/men.jpeg";
import women from "@/public/women.jpeg";
import prisma from "@/app/lib/db";
import { cache } from "react";


const getData = cache(async () => {
  const data = await prisma.productCategory.findMany({
    where: { isFeatured: true },
  });

  return data;
})

export async function CategoriesSelection() {
  const data = await getData();

  return (
    <div className="py-14 sm:py-14">
      <div className="flex justify-between items-center">
        <h2 className="trx-title relative z-1 text-2xl font-medium tracking-tight uppercase">
          Categorii
        </h2>

        <Link
          className="text-sm font-semibold text-primary hover:text-primary/80"
          href="/products/all"
        >
          Vezi toate produsele &rarr;
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 md:grid-cols-2 md:grid-rows-2 md:gap-x-6 lg:gap-8">
        <Link href="/products/all">
          <div className="group aspect-w-2 h-[280px] md:h-[320px] lg:h-[400px] rounded-[15px] overflow-hidden border-[2px] border-primary">
            {/* <div className="border-[2px] rounded-[15px] overflow-hidden border-primary"> */}
            <Image
              src={all}
              alt="All Products Image"
              className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110 border-[2px] rounded-[15px] overflow-hidden border-primary"
            />
            <div className="bg-gradient-to-b from-transparent to-primary opacity-10" />
            <div className="p-6 flex items-center justify-center">
              <h3 className="text-white font-semibold text-4xl custom-text-shadow bg-primary bg-opacity-30 px-2 rounded-lg" >
                Toate Bijuteriile
              </h3>
            </div>
            {/* </div>   */}
          </div>
        </Link>

        {data.length > 0 &&
          data.map((category) => (
            <Link href={`/products/${category.slug}`} key={category.id}>
              <div className="group aspect-w-2 h-[280px] md:h-[320px] lg:h-[400px] rounded-[14px] overflow-hidden border-[2px] border-primary">
                {/* <div className="border-[2px] rounded-[15px] overflow-hidden border-primary"> */}
                <Image
                  src={category?.image as string}
                  alt="All Products Image"
                  fill
                  className="object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110 border-[2px] rounded-[15px] overflow-hidden border-primary"
                />
                <div className="bg-gradient-to-b from-transparent to-primary opacity-10" />
                <div className="p-6 flex items-center justify-center">
                  <h3 className="text-white font-semibold text-4xl custom-text-shadow bg-primary bg-opacity-30 px-2 rounded-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
              {/* </div> */}
            </Link>
          ))}
      </div>
    </div>
  );
}
