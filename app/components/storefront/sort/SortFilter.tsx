"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Product } from "@prisma/client";
import { QueriesResults, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import React, { useCallback, useState } from "react";
import debounce from "lodash.debounce";

const SORT_OPTIONS = [
  { sortType:"", name: "None", value: "none" },
  { sortType: "name", name: "Alfabetic, A-Z", value: "asc" },
  { sortType: "name", name: "Alfabetic, Z-A", value: "desc" },
  { sortType: "price", name: "Price: Low to High", value: "asc" },
  { sortType: "price", name: "Price: High to Low", value: "desc" },
] as const;

interface iAppProps {
  filter: any;
  setFilter: any;
  refetch: () => void;
}

export default function SortFilter({ filter, setFilter, refetch }: iAppProps) {
  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium">
          Sort
          <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.name}
              className={cn("text-left w-full block px-4 py-1 text-sm", {
                "text-gray-900 bg-gray-100": option.value === filter.sort && option.sortType === filter.sortType,
                "text-gray-500": option.value === filter.sort && option.sortType === filter.sortType,
              })}
              onClick={() => {
                setFilter((prev: any) => ({
                  ...prev,
                  sort: option.value,
                  sortType: option.sortType
                }));

                _debouncedSubmit();
              }}
            >
              {option.name}
            </button>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
