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
import PaginationControls from "@/app/components/PaginationControls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Link from "next/link";

async function getData() {
  const queryOptions: any = {
    select: {
      id: true,
      name: true,
      value: true,
    },
  };

  const data = await prisma.material.findMany(queryOptions);

  return data;
}

export default async function MaterialPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  noStore();
  const data = await getData();

  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "5";

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries = data.slice(start, end);

  return (
    <>
      <div className="flex items-center justify-end mb-4">
        <Button asChild className="flex items-center gap-x-2">
          <Link href="/dashboard/material/create">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Material</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="px-7">
          <CardTitle>Material Products</CardTitle>
          <CardDescription>All material from your store!</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="overflow-x-scroll">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
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
                          <Link href={`/dashboard/material/${item.id}`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/material/${item.id}/delete`}>
                            Delete
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
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
