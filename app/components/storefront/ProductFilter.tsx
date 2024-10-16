"use client";

import React, { useState } from "react";
import CategoriesHeroHolder from "./CategoriesHeroHolder";
import PriceFilter from "./sort/PriceFilter";
import CategoryFilter from "./sort/CategoryFilter";
import SortFilter from "./sort/SortFilter";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { QueriesResults, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Wishlist } from "@/app/lib/interfaces";
import TipBijuterieFilter from './sort/TipBijuterieFilter';
import TagsSort from "./sort/TagsSort";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: [];
}[];

export type TipBijuterieProps = {
  name: string;
  value: string;
}[]

export default function ProductFilter({
  params,
  wishlist,
  tipBijuterii,
}: {
  params: { name: string };
  wishlist: Wishlist | null;
  tipBijuterii: TipBijuterieProps
}) {
  let title = "";
  if(params.name){
    switch (params.name) {
      case "all": {
        title = "All products";
        break;
      }
     
      default: {
        title = "All";
      }
    }
  }
 

  const [filter, setFilter] = useState({
    sort: "none",
    sortType: "",
    categorySlug: "all",
    category: "",
    selectedPriceRange: "",
    tipBijuterie: "",
    tipBijuterieNume: ""
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
              tipBijuterie: filter.tipBijuterie,
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

  if (filter.sortType === "category") {
    title = filter.category;
  }

  if (filter.sortType === "tipBijuterie"){
    title = filter.tipBijuterieNume
  }
  
  return (
    <section>
      <CategoriesHeroHolder />
      <div className="grid grid-cols-12">
        {/* filter */}
        <div className="hidden md:block md:col-span-3 pl-4">
          <div className="filter-group border-r border-b pb-6">
            <TipBijuterieFilter
              filter={filter}
              setFilter={setFilter}
              refetch={refetch}
              tipBijuterii={tipBijuterii}
              params={params.name}
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
            <PriceFilter
              filter={filter}
              setFilter={setFilter}
              refetch={refetch}
            />
          </div>

          {/* <div className="filter-group border-r border-b pb-6">
            <PietrePretioaseSort />
          </div> */}

          <div className="filter-group border-r border-b pb-6">
            <TagsSort />
          </div>
        </div>

        <div className="col-span-12 md:col-span-9 md:ml-4">
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
                  <ProductCard
                    loading={loading}
                    item={item}
                    key={index}
                    wishlist={wishlist}
                  />
                ))}
          </div>


        </div>
      </div>
    </section>
  );
}
