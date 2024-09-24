"use server"

import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';
import { Wishlist } from "../lib/interfaces";
import { redis } from "../lib/redis";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";

function getOrSetWishlistId() {
  const cookieStore = cookies();
  let wishlistId = cookieStore.get('wishlistId')?.value;

  if (!wishlistId) {
    wishlistId = uuidv4();
    cookieStore.set('wishlistId', wishlistId, { path: '/', maxAge: 7 * 24 * 60 * 60 });
  }

  return wishlistId;
}

async function deleteItem(updateWishlist: any, wishlistId: any) {
  await redis.set(`wishlist-${wishlistId}`, JSON.stringify(updateWishlist));
}

export async function addItem(productId: string) {
  const wishlistId = getOrSetWishlistId();

  // Obține wishlist-ul din Redis
  let wishlist: Wishlist | null = await redis.get(`wishlist-${wishlistId}`);
  wishlist = wishlist ? JSON.parse(JSON.stringify(wishlist)) : null; // Transformă din string în obiect

  const selectedProduct = await prisma.product.findUnique({
    where: {
      id: productId
    },
    select: {
      id: true,
      name: true,
      price: true,
      originalPrice: true,
      discountAmount: true,
      discountPercentage: true,
      images: true
    }
  });

  if (!selectedProduct) {
    throw new Error("No product with this id");
  }

  let myWishlist: Wishlist = {
    wishlistId: wishlistId,
    items: [], // Inițializăm lista de iteme
  };

  if (!wishlist || !wishlist.items) {
    // Dacă wishlist-ul nu există, adăugăm produsul
    myWishlist.items.push({
      price: selectedProduct.price,
      originalPrice: selectedProduct.originalPrice || 0,
      discountAmount: selectedProduct.discountAmount || 0,
      discountPercentage: selectedProduct.discountPercentage || 0,
      id: selectedProduct.id,
      imageString: selectedProduct.images[0],
      name: selectedProduct.name,
    });
  } else {
    let itemFound = false;

    // Verificăm dacă produsul există deja și actualizăm lista
    myWishlist.items = wishlist.items.filter((item) => {
      if (item.id === productId) {
        itemFound = true;
        return false; // Filtrăm produsul care trebuie șters
      }
      return true; // Păstrăm celelalte produse
    });

    if (itemFound) {
      // Dacă produsul a fost găsit și șters, actualizăm lista
      await deleteItem(myWishlist, wishlistId);
    } else {
      // Dacă produsul nu a fost găsit, adăugăm produsul nou
      myWishlist.items.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        imageString: selectedProduct.images[0],
        price: selectedProduct.price,
        originalPrice: selectedProduct.originalPrice || 0,
        discountAmount: selectedProduct.discountAmount || 0,
        discountPercentage: selectedProduct.discountPercentage || 0,
      });
    }
  }

  // Salvează wishlist-ul actualizat în Redis
  await redis.set(`wishlist-${wishlistId}`, JSON.stringify(myWishlist));

  // Revalidatează calea
  revalidatePath("/", "layout");
}

export async function deleteItemFromWishlist(productId:string) {
  const wishlistId = getOrSetWishlistId();

  let wishlist: Wishlist | null = await redis.get(`wishlist-${wishlistId}`);
  wishlist = wishlist ? JSON.parse(JSON.stringify(wishlist)) : null;

  let myWishlist: Wishlist = {
    wishlistId: wishlistId,
    items: [], // Inițializăm lista de iteme
  };

  let itemFound = false;

  if(!wishlist || !wishlist.items){
    return (console.log("Nu a fost gasit nici un produs"))
  }
    // Verificăm dacă produsul există deja și actualizăm lista
    myWishlist.items = wishlist.items.filter((item) => {
      if (item.id === productId) {
        itemFound = true;
        return false; // Filtrăm produsul care trebuie șters
      }
      return true; // Păstrăm celelalte produse
    });

    if (itemFound) {
      // Dacă produsul a fost găsit și șters, actualizăm lista
      await deleteItem(myWishlist, wishlistId);
    } 
  
   // Revalidatează calea
   revalidatePath("/", "layout");
}
