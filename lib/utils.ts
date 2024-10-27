import prisma from "@/app/lib/db";
import { OrderStatus } from '@prisma/client';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// import { Product } from '../app/components/storefront/Search';

export type Order = {
  id: string;
  orderNumber: number;
  status: OrderStatus; // Asigură-te că ai definit `OrderStatus`
  amount: number;
  shippingMethod: string;
  payment: string;
  verify: string;
  tipPersoana: string | null;
  userId: string | null;
  adresaFacturareId: number | null;
  fulfilled: string; // sau un tip adecvat
  products?: Product[];  // Asigură-te că `products` este definit aici
};

type Product = {
  id: string;
  orderId: string;
  fulfilledQuantity: number | null;
  quantity: number;
  Product: {
    name: string;
    price: number;
    images: any;
  };
  
};

// Definirea tipului pentru produsele grupate
interface GroupedProduct {
  productName: string;
  productImage: string; // Asigură-te că tipul este corect
  productPrice: number; // Asigură-te că tipul este corect
  fulfilledQuantity: number;
  totalQuantity: number;
}

interface GroupedProductDetails {
  orderNumber: number;
  products: Product[]; // Asumând că ai definit deja un tip Product
  productName?:string;
}

interface UnfulfilledProductsGroupDetails {
  orderNumber: number;
  orderId:string;
  productName?: string;
  remainingQuantity: number;
  products: Product[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ț/g, 't')             // Înlocuiește toate aparițiile lui "ț" cu "t"
    .replace(/ă/g, 'a')
    .replace(/ș/g, 's')             // Înlocuiește toate aparițiile lui "ț" cu "t"
    .replace(/ţ/g, 't')             // Înlocuiește toate aparițiile lui "ț" cu "t"
    .replace(/\s+/g, '-')           // Înlocuiește spațiile cu "-"
    .replace(/\-\-+/g, '-')         // Înlocuiește multiple "-" cu unul singur
    .replace(/^-+/, '')             // Elimină "-" de la început
    .replace(/-+$/, '');            // Elimină "-" de la sfârșit
}

export async function checkFulfillmentStatus(orderId: string) {
  // Obține toate produsele din comandă
  const orderProducts = await prisma.orderProduct.findMany({
    where: { orderId },
  });

  // Verifică starea fiecărui produs
  let allFulfilled = true; // Verifică dacă toate sunt complet fulfilled
  let noneFulfilled = true; // Verifică dacă niciunul nu este fulfilled
  let fulfilledAt = null

  for (const product of orderProducts) {
    if (product.fulfilledQuantity === 0 || product.fulfilledQuantity === null) {
      allFulfilled = false; // Dacă vreun produs nu este îndeplinit deloc
    } else if (product.fulfilledQuantity < product.quantity) {
      noneFulfilled = false; // Dacă vreun produs este parțial îndeplinit
      allFulfilled = false;  // Setează pe false, nu este complet fulfilled
      fulfilledAt = product.fulfilledAt
    } else if (product.fulfilledQuantity === product.quantity) {
      noneFulfilled = false; // Dacă un produs este complet fulfilled
      fulfilledAt = product.fulfilledAt
    }
  }

  // Returnează starea
  if (noneFulfilled) {
    return { status: "Unfulfilled", fulfilledAt: null }; // Niciun produs nu este îndeplinit
  } else if (!allFulfilled) {
    return { status: "Partially Fulfilled", fulfilledAt: fulfilledAt }; // Produsele sunt parțial îndeplinite
  } else {
    return { status: "Fully Fulfilled", fulfilledAt: fulfilledAt }; // Toate produsele sunt complet îndeplinite
  }
}

export async function getOrderFulfillmentDetails2(orderId: string) {
  // Găsim comanda din baza de date
  const order = await prisma.order.findUnique({
    where: { id:orderId },
    include: {
      shippingAddress: true,
      adresaFacturare: true,
      dateFacturare: true,
      User: true,
      Customer: true,
      _count: {
        select: {
          products: true,
        },
      },
      products: {
        include: {
          Product: true,
          Fulfillments: true, // Include Fulfillments pentru a accesa fulfilledQuantity
        },
      },
    },
  });

  if (!order) {
    throw new Error(`Order with ID ${orderId} not found`);
  }
 
  // Grupăm produsele după newFulfillmentId
  const groupedByFulfillmentId: { [fulfillmentId: string]: { date: string, products: any[] } } = {};
  const unfulfilledProducts: { ["Unfulfilled"]: { products: any[] } } = {
    Unfulfilled: { products: [] }
  };

  order.products.forEach((product) => {
    const fulfilledQuantities = product.Fulfillments.map((fulfilled) => fulfilled.fulfilledQuantity || 0);
    const totalFulfilledQuantity = fulfilledQuantities.reduce((sum, qty) => sum + qty, 0); // Total cantitate îndeplinită
    const remainingQuantity = product.quantity - totalFulfilledQuantity; // Calculăm diferența

    product.Fulfillments.forEach((fulfillment) => {
      const { newFulfillmentId } = fulfillment;
      const date = fulfillment.createdAt ? new Date(fulfillment.createdAt).toISOString().split('T')[0] : "No date available";

      // Inițializăm grupul pentru newFulfillmentId dacă nu există
      if (!groupedByFulfillmentId[newFulfillmentId]) {
        groupedByFulfillmentId[newFulfillmentId] = {
          date: date,
          products: []
        };
      }

      // Adăugăm detaliile produsului la grupul respectiv de Fulfillment
      groupedByFulfillmentId[newFulfillmentId].products.push({
        productName: product.Product.name,
        productImage: product.Product.images[0],
        productPrice: product.Product.price,
        fulfilledQuantity: fulfillment.fulfilledQuantity,
        trackingNumber: fulfillment.trackingNumber,
        shippingCarrier: fulfillment.shippingCarrier,
        fulfilledAt: fulfillment.createdAt,
      });
    });

    // Dacă există cantitate neîndeplinită, o adăugăm în grupul unfulfilledProducts
    if (remainingQuantity > 0) {
      unfulfilledProducts["Unfulfilled"].products.push({
        productName: product.Product.name,
        productImage: product.Product.images[0],
        productPrice: product.Product.price,
        unfulfilledQuantity: remainingQuantity,
      });
    }
  });

  return { groupedByFulfillmentId, unfulfilledProducts };
};




export function checkOrderStatus2(orders:Order[]) {
  return orders.map(order => {
    // Verificăm dacă comanda are produse
    if (!order.products || order.products.length === 0) {
      return { orderId: order.id, status: 1 }; // Comanda nu are produse
    }

    let totalFulfilledQuantity = 0;
    let totalProducts = order.products.reduce( (acc,product) => acc + product.quantity,0); // Numărul total de produse

    // Verificăm fiecare produs din comandă
    order.products.forEach(product => {
      totalFulfilledQuantity += product.fulfilledQuantity || 0; // Dacă fulfilledQuantity este null sau undefined, adăugăm 0
    });

    // Determinăm starea comenzii
    if (totalFulfilledQuantity === 0) {
      return { orderId: order.id, status: 1 , fulfilledAt: null}; // Comanda nu are produse îndeplinite
    } else if (totalFulfilledQuantity < totalProducts) {
      return { orderId: order.id, status: 2, fulfilledAt: new Date() }; // Comanda este parțial îndeplinită
    } else if (totalFulfilledQuantity === totalProducts){
      return { orderId: order.id, status: 3, fulfilledAt: new Date() }; // Comanda este complet îndeplinită
    }
  });
}


export function checkOrderStatus(orders:Order[]) {

  return Promise.all(
    orders.map(async (order) => {
      if(!order.products){
        return;
      }
      // Găsim fulfillment pentru fiecare produs din comandă
      const fulfillments = await prisma.fulfillment.findMany({
        where: { 
          orderProductId: { in: order.products.map(p => p.id) } },
          select: { 
            orderProductId:true,
            fulfilledQuantity:true
          }
      });

      // Grupăm cantitățile fulfilled pentru fiecare produs
      const fulfilledQuantities = fulfillments.reduce((acc, f) => {
        acc[f.orderProductId] = (acc[f.orderProductId] || 0) + (f.fulfilledQuantity || 0);
        return acc;
      }, {} as Record<string, number>);

      let totalFulfilledQuantity = 0;
      let totalProducts = order.products.reduce((acc, product) => acc + product.quantity, 0);

      // Calculăm totalul fulfilled pentru fiecare produs
      order.products.forEach((product) => {
        totalFulfilledQuantity += fulfilledQuantities[product.id] || 0;
      });

      // Determinăm starea comenzii
      if (totalFulfilledQuantity === 0) {
        return { orderId: order.id, status: 1, fulfilledAt: null }; // Comanda nu are produse îndeplinite
      } else if (totalFulfilledQuantity < totalProducts) {
        return { orderId: order.id, status: 2, fulfilledAt: new Date() }; // Comanda este parțial îndeplinită
      } else if (totalFulfilledQuantity === totalProducts) {
        return { orderId: order.id, status: 3, fulfilledAt: new Date() }; // Comanda este complet îndeplinită
      }
    })
  );

}