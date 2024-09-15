import prisma from "@/app/lib/db";
import { NextRequest } from "next/server";

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const priceRanges: PriceRange[] = [
  { label: "0 - 100 Lei", min: 0, max: 100 },
  { label: "100 Lei - 200 Lei", min: 100, max: 200 },
  { label: "200 Lei - 500 Lei", min: 200, max: 500 },
  { label: "500 Lei - 1.000 Lei", min: 500, max: 1000 },
  { label: "1.000 Lei - 2.000 Lei", min: 1000, max: 2000 },
  { label: "Peste 2.000 Lei", min: 2000, max: Number.MAX_SAFE_INTEGER },
];


export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { sort, sortType, categorySlug, category, selectedPriceRange } = body.filter;

  async function filterAndSortProducts(
    options: {
      where?: any;
      orderBy?: any;
    }
  ) {
    return prisma.product.findMany(options);
  }

  let options: {
    where?: any;
    orderBy?: any;
  } = {};

  // Filtering
  if (categorySlug && categorySlug !== "all") {
    options.where = {
      productCategory: { slug: categorySlug },
    };
  }

  if (selectedPriceRange) {
    const range = priceRanges.find(range => range.label === selectedPriceRange);
    if (range) {
      options.where = {
        ...options.where,
        price: {
          gte: range.min,
          lte: range.max,
        },
      };
    }
  }

  // Sorting
  if (sortType === "price" && sort) {
    options.orderBy = {
      price: sort, // 'asc' or 'desc'
    };
  } else if (sortType === "name" && sort) {
    options.orderBy = {
      name: sort, // 'asc' for A-Z or 'desc' for Z-A
    };
  }

  // Additional filtering based on category (if needed)
  if (category) {
    options.where = {
      ...options.where,
      productCategory: { slug: category },
    };
  }

  try {
    const products = await filterAndSortProducts(options);
    return new Response(JSON.stringify(products));
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
};