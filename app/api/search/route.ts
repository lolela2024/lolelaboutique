import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { categories } from '../../lib/categories';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json(); // Parsăm corpul cererii ca JSON
    
    if (!body || !body.filter || !body.filter.name) {
      // Dacă `filter` sau `name` nu există în corp, returnăm o eroare
      return new NextResponse(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const { name } = body.filter; // Extragem `name` din obiectul `filter`

    // Căutăm produsele în baza de date folosind Prisma (adaptat după structura ta)
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: name,
              mode: 'insensitive', // Face căutarea case insensitive
            },
          },
          {
            productCategory: {
              name: {
                contains: name,
                mode: 'insensitive'
              }
            },
          },
        ],
      },
      
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true, // Selectează orice câmpuri ai nevoie
      },
    });

    // Verificăm dacă au fost găsite produse
    if (products.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No products found" }), {
        status: 404,
      });
    }

    // Returnăm produsele găsite
    return new NextResponse(JSON.stringify(products), {
      status: 200,
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
    });
  }
};
