import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { parse } from "json2csv";

// Funcția GET pentru a exporta CSV-ul
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        name: true,
        inventory: {
          select: {
            sku: true,
            available: true,
            onHand: true,
            unavailable: {
              select: {
                damaged: true,
                qualityControl: true,
                safetyStock: true,
                other: true,
              },
            },
          },
        },
      },
    });

    // Transformă datele în CSV
    const csv = parse(products);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=inventory.csv",
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return new NextResponse("Failed to export CSV", { status: 500 });
  }
}
