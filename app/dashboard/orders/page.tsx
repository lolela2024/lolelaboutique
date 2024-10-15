import prisma from "@/app/lib/db";
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
import { unstable_noStore as noStore } from "next/cache";
import { formatCurrency } from "../../lib/formatters";
import Link from "next/link";
import TableRowTrx from "./_components/TableRowTrx";
import PaginationControls from "@/app/components/PaginationControls";

async function getData(page: number, per_page: number) {
  const queryOptions: any = {
    select: {
      orderNumber: true,
      amount: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      fulfilled: true,
      id: true,
      User: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          profileImage: true,
        },
      },
      Customer: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (page - 1) * per_page, // Sar peste produsele anterioare paginii curente
    take: per_page, // Returnează doar numărul de produse dorit
  };

  // Facem query-ul cu opțiunile construite
  const data = await prisma.order.findMany(queryOptions);

  return data;
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  noStore();

  const page = Number(searchParams["page"] ?? "1");
  const per_page = Number(searchParams["per_page"] ?? "5");

  const data = await getData(page, per_page);

  const totalEntries = await prisma.order.count();

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Orders</CardTitle>
        <CardDescription>Recent orders from your store!</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="overflow-x-scroll">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Fulfillment status</TableHead>
              <TableHead>Delivery status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRowTrx key={item.id} item={item} />
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
  ); 
}
