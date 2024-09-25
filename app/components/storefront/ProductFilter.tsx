"use client";


import React, { useState } from "react";
import CategoriesHeroHolder from "./CategoriesHeroHolder";
import PriceFilter from "./sort/PriceFilter";
import CategoryFilter from "./sort/CategoryFilter";
import PietrePretioaseSort from "./sort/PietrePretioaseSort";
import SortFilter from "./sort/SortFilter";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { QueriesResults, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Wishlist } from "@/app/lib/interfaces";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: [];
}[];

export default function ProductFilter({
  params,
  wishlist
}: {
  params: { name: string };
  wishlist:Wishlist | null
}) {
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

    case "coliere": {
      title = "Coliere";
      break;
    }

    case "bratari": {
      title = "Brățări";
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

  if (filter.category) {
    title = filter.category;
  }
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
            <h1 className="font-semibold text-3xl my-5 capitalize">{title}</h1>
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
                  <ProductCard loading={loading} item={item} key={index} wishlist={wishlist}/>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
