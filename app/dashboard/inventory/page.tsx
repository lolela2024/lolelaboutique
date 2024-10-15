import React from "react";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import PaginationControls from "@/app/components/PaginationControls";
import ExportCSV from "./_components/ExportCSV";


async function getData(page: number, per_page: number) {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true, // Asigură-te că aduci ID-ul produsului
      name: true, // Dacă dorești să aduci numele
      inventory: {
        select: {
          id: true,
          sku: true,
          available: true,
          onHand: true,
          unavailable: {
            select: {
              id: true,
              damaged: true,
              qualityControl: true,
              safetyStock: true,
              other: true,
            },
          },
        },
      },
    },
    skip: (page - 1) * per_page, // Sar peste produsele anterioare paginii curente
    take: per_page, // Returnează doar numărul de produse dorit
  });

  return data;
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  noStore();

  const page = Number(searchParams["page"] ?? "1");
  const per_page = Number(searchParams["per_page"] ?? "5");

  const data = await getData(page, per_page);

  const totalEntries = await prisma.product.count();

  if (!data) {
    return (
      <div>
        <p>No data</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <ExportCSV />
      
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Description!!!</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Damaged</TableHead>
                <TableHead>Quality Control</TableHead>
                <TableHead>Safety Stock</TableHead>
                <TableHead>Other</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead>On Hand</TableHead>
                {/* <TableHead className="text-end">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.inventory?.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.inventory?.unavailable?.damaged}</TableCell>
                  <TableCell>
                    {item.inventory?.unavailable?.qualityControl}
                  </TableCell>
                  <TableCell>
                    {item.inventory?.unavailable?.safetyStock}
                  </TableCell>
                  <TableCell>{item.inventory?.unavailable?.other}</TableCell>
                  <TableCell className="text-center">
                    <span className="bg-gray-200 px-4 py-1 rounded-xl">
                      {item.inventory?.available}
                    </span>
                  </TableCell>
                  <TableCell>{item.inventory?.onHand}</TableCell>

                  {/* <TableCell className="text-end">
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
                        <Link href={`/dashboard/products/${item.id}`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/products/${item.id}/delete`}>
                          Delete
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="justify-end">
          <PaginationControls
            entries={totalEntries} // Totalul produselor pentru paginare
            hasNextPage={page * per_page < totalEntries} // Verifică dacă există o pagină următoare
            hasPrevPage={page > 1} // Verifică dacă există o pagină anterioară
            currentPage={page} // Pagina curentă pentru a putea evidenția
            perPage={per_page} // Numărul de produse pe pagină
          />
        </CardFooter>
      </Card>
    </>
  );
}
