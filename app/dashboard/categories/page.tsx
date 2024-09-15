import React, { Fragment } from "react";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Minus, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item } from "@radix-ui/react-dropdown-menu";
import PaginationControls from "@/app/components/PaginationControls";

async function getData() {
  const data = await prisma.productCategory.findMany({
    orderBy: {
      parentCategoryId: "desc",
    },
    include: {
      _count: {
        select: {
          products: true,
          subcategories: true,
        },
      },
      parentCategory: true,
      subcategories: true,
    },
  });

  return data;
}

export default async function CategoriesRoot({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  noStore();
  const data = await getData();

  // Create a nested structure
  const categoriesMap = new Map();
  data.forEach((category: any) => {
    if (category.parentCategoryId === null) {
      categoriesMap.set(category.id, { ...category, subcategories: [] });
    } else {
      const parentCategory = categoriesMap.get(category.parentCategoryId);
      if (parentCategory) {
        parentCategory.subcategories.push(category);
      } else {
        categoriesMap.set(category.parentCategoryId, {
          subcategories: [category],
        });
      }
    }
  });

  // Convert map to an array
  const hierarchicalCategories = Array.from(categoriesMap.values());

  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "5";

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries = hierarchicalCategories.slice(start, end);

  return (
    <>
      <div className="flex items-center justify-end">
        <Button asChild className="flex items-center gap-x-2">
          <Link href="/dashboard/categories/create">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </Link>
        </Button>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage your categories and subcategories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((item) => (
                <Fragment key={item.id}>
                  <TableRow key={item.id}>
                    <TableCell>
                      <Image
                        alt="Product Image"
                        src={item.image || "/no-photo.jpg"}
                        height={64}
                        width={64}
                        className="rounded-md object-cover h-16 w-16"
                      />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.slug}</TableCell>
                    <TableCell>{item.parentCategoryId}</TableCell>
                    <TableCell>{item._count.products}</TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/categories/${item.id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/categories/${item.id}/delete`}
                            >
                              Delete
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {item.subcategories.length > 0 &&
                    item.subcategories.map((subcat: any, key: number) => (
                      <TableRow key={key}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Minus />
                            <Image
                              alt="Product Image"
                              src={subcat.image || "/no-photo.jpg"}
                              height={64}
                              width={64}
                              className="rounded-md object-cover h-16 w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{subcat.name}</TableCell>
                        <TableCell>{subcat.slug}</TableCell>
                        <TableCell>{subcat.parentCategory.name}</TableCell>
                        <TableCell>{subcat._count.products}</TableCell>
                        <TableCell className="text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/categories/${subcat.id}`}
                                >
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/categories/${subcat.id}/delete`}
                                >
                                  Delete
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end">
          <PaginationControls
            entries={data.length}
            hasNextPage={end < data.length}
            hasPrevPage={start > 0}
          />
        </CardFooter>
      </Card>
    </>
  );
}
