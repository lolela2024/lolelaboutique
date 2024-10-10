"use server"

import * as z from "zod";
import { auth } from "@/auth";
import prisma from "../lib/db";
import { v4 as uuidv4 } from 'uuid';
import { redis } from "../lib/redis";
import { cookies } from "next/headers";
import { Cart } from "../lib/interfaces";
import { parseWithZod } from "@conform-to/zod";
import { DateFirmaSchema } from "../lib/zodSchemas";
import { ceckoutSchemaUser } from "../lib/schemas/userSchemaCheckout";
import { notFound, redirect } from "next/navigation";
import { Fulfilled, OrderStatus } from "@prisma/client";
import { Resend } from "resend";
import EmailConfirmareOrder from "@/emails/ConfirmareOrder";
import { stripe } from "../lib/stripe";
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY);

async function getNextOrderNumber(): Promise<number> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: 'desc' },
  });
  return lastOrder ? lastOrder.orderNumber + 1 : 10000;
}

// Funcție pentru calcularea prețului total
function calculateTotalPrice(cart: Cart | null): number {
  let totalPrice = 0;
  cart?.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
}

export const editDateFirma = async (values:z.infer<typeof DateFirmaSchema>) => {
  const validatedFields = DateFirmaSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { numeFirma, cif, nrRegComert } = validatedFields.data

  console.log(numeFirma,cif,nrRegComert) 

  return { success: "cs" }
}

// Functie pentru creare sau actualizare adresaFacturare
async function handleFacturareAddressUser(userId: string, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchemaUser
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const existingAddress = await prisma.adresaFacturare.findFirst({
    where: { userId: userId },
  });

  if (existingAddress) {
    await prisma.adresaFacturare.updateMany({
      where:{userId:userId},
      data:{
        strada:submission.value.stradaAdreseFacturare as string,
        numar:submission.value.numarAdreseFacturare as string,
        localitate:submission.value.localitateAdreseFacturare as string,
        judet:submission.value.judetAdreseFacturare as string,
        bloc:submission.value.blocAdreseFacturare,
        scara:submission.value.scaraAdreseFacturare,
        etaj:submission.value.etajAdreseFacturare,
        apartament:submission.value.apartamentAdreseFacturare,
      }
    })
  } else {
    await prisma.adresaFacturare.create({
      data:{
        strada:submission.value.stradaAdreseFacturare as string,
        numar:submission.value.numarAdreseFacturare as string,
        localitate:submission.value.localitateAdreseFacturare as string,
        judet:submission.value.judetAdreseFacturare as string,
        bloc:submission.value.blocAdreseFacturare,
        scara:submission.value.scaraAdreseFacturare,
        etaj:submission.value.etajAdreseFacturare,
        apartament:submission.value.apartamentAdreseFacturare,
        userId:userId
      }
    });
  }

  return prisma.adresaFacturare.findFirst({
    where: { userId: userId },
  });
}

// Funcție pentru crearea comenzii
async function createOrder(data: {
  verify: string,
  orderNumber: number,
  shippingMethod: string,
  payment: string,
  amount: number,
  userId?: string,
  customerId?: string,
  shippingAddressId: number | undefined,
  dateFacturareId?: number | undefined,
  adresaFacturareId?: number | undefined,
  cart: Cart | null,
  tipPersoana?: string | null,
}) {
  const { 
    verify, 
    orderNumber, 
    shippingMethod, 
    payment, 
    amount, 
    userId, 
    customerId, 
    shippingAddressId, 
    cart, 
    tipPersoana, 
    dateFacturareId, 
    adresaFacturareId 
  } = data;
  return prisma.order.create({
    data: {
      verify,
      orderNumber,
      shippingMethod,
      payment,
      status: OrderStatus.pending,
      amount,
      userId,
      customerId,
      tipPersoana,
      shippingAddressId,
      adresaFacturareId: adresaFacturareId ? adresaFacturareId : undefined,
      dateFacturareId: dateFacturareId ? dateFacturareId : undefined,
      fulfilled: Fulfilled.Unfulfilled,
      products: {
        create: cart?.items.map((item) => ({
          Product: { connect: { id: item.id } },
          quantity: item.quantity,
        })),
      },
    },
    include: {
      products: true,
      shippingAddress: true,
    },
  });
}

// Funcție pentru crearea sesiunii Stripe
async function createStripeSession(cart: Cart | null, submission: any, userEmail:string, cartId: string) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart?.items.map((item) => ({
    price_data: {
      currency: "ron",
      unit_amount: item.price * 100,
      product_data: {
        name: item.name,
        images: [item.imageString],
      },
    },
    quantity: item.quantity,
  })) || [];

  const shippingCost = 2499;
  if (submission.value.shipping === "dhl") {
    lineItems.push({
      price_data: {
        currency: "ron",
        unit_amount: shippingCost,
        product_data: { name: "Cost de livrare" },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: userEmail,
    success_url: process.env.NODE_ENV === "development"
      ? "http://localhost:3000/payment/success"
      : "https://lolelaboutique.vercel.app/payment/success",
    cancel_url: process.env.NODE_ENV === "development"
      ? "http://localhost:3000/payment/cancel"
      : "https://lolelaboutique.vercel.app/payment/cancel",
    metadata: { cartId: cartId || '' },
  });

  return session.url;
}

// Funcție principală pentru crearea checkout-ului
export async function createCheckoutUser(prevState: unknown, formData: FormData){
  const submission = parseWithZod(formData, { schema: ceckoutSchemaUser });
  if (submission.status !== "success") {
    return submission.reply();
  }

  const orderNumber = await getNextOrderNumber();
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const cart: Cart | null = await redis.get(`cart-${cartId}`);
  const totalPrice = calculateTotalPrice(cart);
  const verify = uuidv4();
  const session = await auth();
  const user = session?.user;

  const userId = user?.id;

  if(!userId || !user?.email){
    return notFound();
  }

  let dateFacturare = null;
  let dateAdresaFacturare = null;


  // Extrage datele necesare pentru adresa clientului
  const addressData = await prisma.address.findFirst({
    where:{userId:userId}
  });

  if(submission.value.tipPersoana === "persoana-juridica"){
    dateFacturare = await prisma.persoanaJuridica.findFirst({
      where:{userId:userId}
    })
  }

  if (submission.value.tipAdresaFactura === "different-address"){
    await handleFacturareAddressUser(userId , formData)

    dateAdresaFacturare = await prisma.adresaFacturare.findFirst({
      where:{userId:userId}
    });
  }

  const dateFacturareId = dateFacturare?.id || undefined;
  const dateAdresaFacturareId = dateAdresaFacturare?.id || undefined;

  const userFirstname = user?.firstName
  const userLastname = user?.lastName;
  const userEmail = user.email;

  if(submission.value.payment === "ramburs"){
    const shippingMethod = submission.value.shipping ? submission.value.shipping : 'standard';

    await createOrder({
      verify,
      orderNumber,
      shippingMethod:     shippingMethod,
      payment:            submission.value.payment,
      amount:totalPrice,
      userId,
      shippingAddressId:  addressData?.id,
      cart,
      tipPersoana:        submission.value.tipPersoana,
      dateFacturareId:    dateFacturareId,
      adresaFacturareId:  dateAdresaFacturareId
    })

    await resend.emails.send({
      from:"LolelaBoutique <lolela.orders@lolelaboutique.ro>",
      to: user.email,
      subject:`Confirmarea comenzii tale LolelaBoutique ${orderNumber}`,
      react: EmailConfirmareOrder(
        {
          userFirstname,
          userLastname,
          strada:             addressData?.strada,
          bloc:               addressData?.bloc as string,
          scara:              addressData?.scara as string,  
          etaj:               addressData?.etaj as string,
          apartament:         addressData?.apartament as string,
          numar:              addressData?.numar,
          localitate:         addressData?.localitate,
          judet:              addressData?.judet,
          codPostal:          addressData?.codPostal as string,
          orderNumber
        }
      )
    });

    await redis.del(`cart-${cartId}`);
    return redirect(`/checkout/comenzi?verify=${verify}`);
  }

  if(submission.value.payment === "card"){
    const shippingMethod = submission.value.shipping ? submission.value.shipping : 'standard';
    

    await createOrder({
      verify,
      orderNumber,
      shippingMethod,
      payment:submission.value.payment,
      amount: totalPrice,
      userId,
      shippingAddressId: addressData?.id,
      dateFacturareId,
      adresaFacturareId:dateAdresaFacturareId,
      cart,
      tipPersoana:submission.value.tipPersoana
    })

  }

  const url = await createStripeSession(cart, submission, userEmail, cartId || '');
  return redirect(url as string);
}
