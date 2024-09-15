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

async function getData(cursor?: string, take: number = 2) {
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
  const data = await getData();

  const page = searchParams["page"] ?? "1";
  const per_page = searchParams["per_page"] ?? "5";

  const start = (Number(page) - 1) * Number(per_page);
  const end = start + Number(per_page);

  const entries = data.slice(start, end);

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
            {entries.map((item) => (
              <TableRowTrx key={item.id} item={item} />
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
  );
}
