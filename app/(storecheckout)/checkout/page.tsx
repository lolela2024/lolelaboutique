import { stripe } from "@/app/lib/stripe";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import CheckoutForm from "@/app/components/storefront/CheckoutForm";
import Stripe from "stripe";
import StoreCheckoutForm from "@/app/components/storefront/StoreCheckoutForm";
import { cookies } from "next/headers";
import { User } from "@prisma/client";
import prisma from "@/app/lib/db";


export default async function CeckoutPage() {
  noStore();
  const {getUser} = getKindeServerSession();
  const user = await getUser();

  let userBazaDeDate = undefined

  if (user?.email) { 
    const userData = await prisma.user.findFirst({
      where: { email: user.email },
      select:{
        email:true,
        firstName:true,
        lastName:true,
        profileImage:true,
        address:true,
        billingAddress:true,
        phone:true || undefined
      }
    });
  
    if (userData) {
      // Redă utilizatorul din baza de date
      userBazaDeDate=userData
    } else {
      // Dacă utilizatorul nu a fost găsit în baza de date, gestionează eroarea
      console.log('User not found in the database.');
    }
  } else {
    // Dacă utilizatorul nu este autentificat sau nu are un email, aruncă o eroare sau redirecționează
    console.log('User is not authenticated or email is missing.');
  }


  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;

  const cart: Cart | null = await redis.get(`cart-${cartId}`);

  if (!cart) {
    return;
  }

  const totalAmount = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Colectarea ID-urilor produselor
  const productIds = cart.items.map((item) => item.id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "ron",
    metadata: {
      productIds: productIds.join(","),
    },
  });

  if (paymentIntent.client_secret === null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (

    <StoreCheckoutForm products={cart} user={userBazaDeDate}/>
    // <CheckoutForm
    //   user={user}
    //   products={cart}
    //   clientSecret={paymentIntent.client_secret}
    // />
  );
}
