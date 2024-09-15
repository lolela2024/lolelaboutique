"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redis } from "../lib/redis"
import { redirect } from "next/navigation";
import { Cart } from "../lib/interfaces";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';
import { cookies } from "next/headers";

function getOrSetCartId(): string {
  const cookieStore = cookies();
  let cartId = cookieStore.get('cartId')?.value;

  if (!cartId) {
    cartId = uuidv4();
    // Setăm cookie-ul cu noul `cartId` pentru 7 zile
    cookieStore.set('cartId', cartId, { path: '/', maxAge: 7 * 24 * 60 * 60 });
  }

  return cartId;
}

export async function addItem(productId:string) {
  // const {getUser} = getKindeServerSession();
  // const user = await getUser();
  const cartId = getOrSetCartId()

  // if(!user){
  //   return redirect('/');
  // }

  let cart: Cart | null = await redis.get(`cart-${cartId}`)

  const selectedProduct = await prisma.product.findUnique({
    where:{
      id:productId
    },
    select:{
      id: true,
      name: true,
      price: true,
      originalPrice: true,
      discountAmount: true,
      discountPercentage: true,
      images: true
    }
  })

  if(!selectedProduct){
    throw new Error("No product with this id");
  }

  let myCart = {} as Cart;

  if(!cart || !cart.items) {
    myCart = {
      cartId: cartId,
      items:[
        {
          price:selectedProduct.price,
          originalPrice:selectedProduct.originalPrice ? selectedProduct.originalPrice : 0,
          discountAmount:selectedProduct.discountAmount || 0,
          discountPercentage:selectedProduct.discountPercentage || 0,
          id:selectedProduct.id,
          imageString:selectedProduct.images[0],
          name:selectedProduct.name,
          quantity:1
        }
      ]
    }
  } else {
    let itemFound = false;

    myCart.items = cart.items.map( (item)=> {
      if(item.id === productId) {
        itemFound = true
        item.quantity += 1
      }

      return item;
    })

    if(!itemFound) {
      myCart.items.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        imageString: selectedProduct.images[0],
        price: selectedProduct.price,
        originalPrice: selectedProduct.originalPrice || 0,
        discountAmount:selectedProduct.discountAmount || 0,
        discountPercentage:selectedProduct.discountPercentage || 0,
        quantity: 1
      })
    }

  }

  await redis.set(`cart-${cartId}`, myCart)

  revalidatePath("/","layout")
}

export async function delItem(formData: FormData) {
  const cartId = getOrSetCartId()

  const productId = formData.get("productId");

  let cart: Cart | null = await redis.get(`cart-${cartId}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      cartId: cartId,
      items: cart.items.filter((item) => item.id !== productId),
    };

    await redis.set(`cart-${cartId}`, updateCart);
  }

  revalidatePath("/bag");
}

export async function addQuantityItem(formData: FormData) {
  const cartId = getOrSetCartId()

  const productId = formData.get("productId");

  let cart: Cart | null = await redis.get(`cart-${cartId}`);

  if (cart && cart.items) {
    const updatedItems = cart.items.map((item) => {
      if (item.id === productId) {
        return {
          ...item,
          quantity: item.quantity + 1, // Mărește cantitatea cu 1
        };
      }
      return item;
    });

    const updatedCart: Cart = {
      cartId: cartId,
      items: updatedItems,
    };

    await redis.set(`cart-${cartId}`, updatedCart); // Salvează coșul actualizat în Redis
  }

  revalidatePath("/bag");
}

export async function removeQuantityItem(formData: FormData) {
  const cartId = getOrSetCartId()

  const productId = formData.get("productId");

  let cart: Cart | null = await redis.get(`cart-${cartId}`);

  if (cart && cart.items) {
    const updatedItems = cart.items.map((item) => {
      if (item.id === productId) {
        const newQuantity = item.quantity - 1;
        return {
          ...item,
          quantity: newQuantity < 1 ? 1 : newQuantity, // Asigură-te că cantitatea nu scade sub 1
        };
      }
      return item;
    });

    const updatedCart: Cart = {
      cartId: cartId,
      items: updatedItems,
    };

    await redis.set(`cart-${cartId}`, updatedCart); // Salvează coșul actualizat în Redis
  }

  revalidatePath("/bag");
}


// export async function checkOut() {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   if (!user) {
//     return redirect("/");
//   }

//   let cart: Cart | null = await redis.get(`cart-${user.id}`);

//   if (cart && cart.items) {
//     const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
//       cart.items.map((item) => ({
//         price_data: {
//           currency: "usd",
//           unit_amount: item.price * 100,
//           product_data: {
//             name: item.name,
//             images: [item.imageString],
//           },
//         },
//         quantity: item.quantity,
//       }));

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       line_items: lineItems,
//       success_url:
//         process.env.NODE_ENV === "development"
//           ? "http://localhost:3000/payment/success"
//           : "https://shoe-marshal.vercel.app/payment/success",
//       cancel_url:
//         process.env.NODE_ENV === "development"
//           ? "http://localhost:3000/payment/cancel"
//           : "https://shoe-marshal.vercel.app/payment/cancel",
//       metadata: {
//         userId: user.id,
//       },
//     });

//     return redirect(session.url as string);
//   }
// }

