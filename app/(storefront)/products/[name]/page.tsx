"use client";

import { ProductCard } from "@/app/components/storefront/ProductCard";
import CategoriesHeroHolder from "@/app/components/storefront/CategoriesHeroHolder";

import axios from "axios";
import { QueriesResults, useQuery } from "@tanstack/react-query";

import {  useState } from "react";
import { LoadingProductCard } from "@/app/components/ProductCard";

import PietrePretioaseSort from "@/app/components/storefront/sort/PietrePretioaseSort";
import PriceFilter from "@/app/components/storefront/sort/PriceFilter";
import CategoryFilter from "@/app/components/storefront/sort/CategoryFilter";
import SortFilter from "@/app/components/storefront/sort/SortFilter";

// async function getData(productCategory: string) {
//   const data = await prisma.product.findMany({
//     select: {
//       name: true,
//       images: true,
//       price: true,
//       id: true,
//       description: true,
//     },
//     where: {
//       status: "published",
//       productCategory: {
//         slug: productCategory,
//       },
//     },
//   });
//   switch (productCategory) {
//     case "all": {
//       const data = await prisma.product.findMany({
//         select: {
//           name: true,
//           images: true,
//           price: true,
//           id: true,
//           description: true,
//         },
//         where: {
//           status: "published",
//         },
//       });

//       return {
//         title: "All Products",
//         data: data,
//       };
//     }
//     case "cercei": {
//       const data = await prisma.product.findMany({
//         where: {
//           status: "published",
//           productCategory: {
//             slug: "cercei",
//           },
//         },
//         select: {
//           name: true,
//           images: true,
//           price: true,
//           id: true,
//           description: true,
//         },
//       });

//       return {
//         title: "",
//         data: data,
//       };
//     }
//     default: {
//       return notFound();
//     }
//   }
// }

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: [];
}[];

export default function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  // noStore();
  // const { data, title } = await getData(params.name);

  let title = "";

  switch (params.name) {
    case "all": {
      title = "All products";
      break;
    }

    case "cercei": {
      title = "Cercei";
      break;
    }
    default: {
      title = "All";
    }
  }

  const [filter, setFilter] = useState({
    sort: "none",
    sortType: "",
    categorySlug: "all",
    category: "",
    selectedPriceRange: "",
  });
  const [loading, setLoading] = useState(false);

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        setLoading(true);

        const { data } = await axios.post<QueriesResults<Product>>(
          "/api/products",
          {
            filter: {
              sort: filter.sort,
              sortType: filter.sortType,
              categorySlug: params.name,
              category: filter.category,
              selectedPriceRange: filter.selectedPriceRange,
            },
          }
        );

        return data;
      } catch (error) {
        throw new Error("Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section>
      <CategoriesHeroHolder />
      <div className="grid grid-cols-12">
        {/* filter */}
        <div className="hidden md:block md:col-span-2 pl-4">
          <div className="filter-group border-r border-b pb-6">
            <PriceFilter
              filter={filter}
              setFilter={setFilter}
              refetch={refetch}
            />
          </div>

          <div className="filter-group border-r border-b pb-6">
            <CategoryFilter
              filter={filter}
              setFilter={setFilter}
              refetch={refetch}
            />
          </div>
          <div className="filter-group border-r border-b pb-6">
            <PietrePretioaseSort />
          </div>
        </div>

        <div className="col-span-12 md:col-span-10 ml-4">
          <div className="flex items-baseline justify-between">
            <h1 className="font-semibold text-3xl my-5">{title}</h1>
            <SortFilter
              filter={filter}
              setFilter={setFilter}
              refetch={refetch}
            />
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading
              ? LoadingProductCard()
              : products &&
                products.map((item, index) => (
                  <ProductCard loading={loading} item={item} key={index} />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
