"use server"

import { parseWithZod } from "@conform-to/zod"
import { ceckoutSchema } from "../lib/zodSchemas"
import { cookies } from "next/headers"
import { Cart } from "../lib/interfaces"
import { redis } from "../lib/redis"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';
import { stripe } from "../lib/stripe"
import Stripe from "stripe";
import { createAddress, updateAddress } from "../lib/checkout"
import { Fulfilled, OrderStatus } from "@prisma/client"
import { auth } from "@/auth"
import prisma from '@/app/lib/db';
import { sentEmailOrder } from "@/lib/mail"


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

// Funcție pentru procesarea creării sau actualizării adresei
async function handleAddress(userData: any, formData: FormData) {
  const existingAddress = await prisma.address.findFirst({
    where: { userId: userData.id },
  });

  if (existingAddress) {
    await updateAddress(userData, formData);
  } else {
    await createAddress(userData, formData);
  }

  return prisma.address.findFirst({
    where: { userId: userData.id },
  });
}

// Functie pentru creare sau actualizare adresaFacturare
async function handleFacturareAddressUser(userData: any, formData: FormData) {
  
  const existingAddress = await prisma.adresaFacturare.findFirst({
    where: { userId: userData.id },
  });

  if (existingAddress) {
    await updateAddress(userData, formData);
  } else {
    await createAddress(userData, formData);
  }

  return prisma.address.findFirst({
    where: { userId: userData.id },
  });
}

// Functie pentru creare sau actualizare adresaFacturare
async function handleFacturareAddressCustomer(customerId: string, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const existingAddress = await prisma.adresaFacturare.findFirst({
    where: { customerId: customerId },
  });

  if (existingAddress) {
    await prisma.adresaFacturare.updateMany({
      where:{customerId:customerId},
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
        customerId:customerId
      }
    });
  }

  return prisma.adresaFacturare.findFirst({
    where: { customerId: customerId },
  });
}


// Funcție pentru creare sau actualizare Persoana Juridica
async function handlePersoanaJuridica(customerId: string, submission: any) {
  const existingPersoanaJuridica = await prisma.persoanaJuridica.findFirst({
    where: { customerId },
  });

  if (!existingPersoanaJuridica && submission.value.numeFirma) {
    await prisma.persoanaJuridica.create({
      data: {
        numeFirma: submission.value.numeFirma,
        CIF: submission.value.cif,
        nrRegComert: submission.value.nrRegComert,
        customerId,
      },
    });
  } else {
    await prisma.persoanaJuridica.update({
      where: { id: existingPersoanaJuridica?.id },
      data: {
        numeFirma: submission.value.numeFirma,
        CIF: submission.value.cif,
        nrRegComert: submission.value.nrRegComert,
      },
    });
  }
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
async function createStripeSession(cart: Cart | null, submission: any, cartId: string) {
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
    customer_email: submission.value.email,
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
export async function createCheckout(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, { schema: ceckoutSchema });
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

  
  if (user?.email) {
    const userData = await prisma.user.update({
      where: { email: user.email },
      data: { phone: submission.value.phone },
    });
    
    const address = await handleAddress(userData, formData);

    // Dacă plata este "ramburs"
    if (submission.value.payment === "ramburs") {
      const shippingMethod = submission.value.shipping ? submission.value.shipping : 'standard';

      await createOrder({ 
        verify, 
        orderNumber, 
        shippingMethod: shippingMethod, 
        payment: submission.value.payment, 
        amount: totalPrice, 
        userId: userData.id, 
        shippingAddressId: address?.id, 
        cart, 
        tipPersoana: submission.value.tipPersoana,
        
      });
      await redis.del(`cart-${cartId}`);
      return redirect(`/checkout/comenzi?verify=${verify}`);
    }

    // Dacă plata este "card"
    const url = await createStripeSession(cart, submission, cartId || '');
    return redirect(url as string);
  }

  // Procesare pentru clienți neînregistrați
  const customer = await prisma.customer.upsert({
    where: { email: submission.value.email },
    create: {
      email: submission.value.email,
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      mobilePhone: submission.value.mobilePhone,
    },
    update: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      mobilePhone: submission.value.mobilePhone,
    },
  });


  // Extrage datele necesare pentru adresa clientului din formData
  const addressData = {
    strada: formData.get('strada') as string,
    numar: formData.get('numar') as string,
    localitate: formData.get('localitate') as string,
    judet: formData.get('judet') as string,
    bloc: formData.get("bloc") as string,
    scara: formData.get("scara") as string,
    etaj: formData.get("etaj") as string,
    apartament: formData.get("apartament") as string,
    codPostal: formData.get("codPostal") as string,
    alteDetalii: formData.get("alteDetalii") as string
  };

  const customerId = customer.id;

  const existingAddress = await prisma.address.findFirst({
    where: { customerId: customerId },
  });

  const address = await prisma.address.upsert({
    where: { id: existingAddress ? existingAddress.id : 0 }, // Folosește id-ul unic sau 0 dacă nu există
    create: {
      customerId,
      ...addressData, // Asigură-te că adresa conține toate câmpurile necesare
    },
    update: {
      ...addressData, // Actualizează câmpurile obligatorii
    },
  });

  if (submission.value.tipPersoana === "persoana-juridica") {
    await handlePersoanaJuridica(customerId, submission);
  }

  if (submission.value.tipPersoana === "persoana-juridica" && submission.value.tipAdresaFactura === "different-address"){
    await handleFacturareAddressCustomer(customerId, formData)
  }

  const dateFacturare = await prisma.persoanaJuridica.findFirst({
    where:{customerId:customerId}
  })

  const dateAdresaFacturare = await prisma.adresaFacturare.findFirst({
    where:{customerId:customerId}
  })

  const dateFacturareId = dateFacturare?.id || undefined;

  const dateAdresaFacturareId = dateAdresaFacturare?.id || undefined;

  if (submission.value.payment === "ramburs") {
    const shippingMethod = submission.value.shipping ? submission.value.shipping : 'standard';
    await createOrder({ 
      verify, 
      orderNumber, 
      shippingMethod: shippingMethod, 
      payment: submission.value.payment, 
      amount: totalPrice, 
      customerId, 
      shippingAddressId: address?.id,
      cart, 
      tipPersoana: submission.value.tipPersoana, 
      dateFacturareId: dateFacturareId,
      adresaFacturareId: dateAdresaFacturareId,
      
    });

    await redis.del(`cart-${cartId}`);
    await sentEmailOrder(submission.value.email,orderNumber);
    return redirect(`/checkout/comenzi?verify=${verify}`);
  }

  if(submission.value.payment === "card") {
    const shippingMethod = submission.value.shipping ? submission.value.shipping : 'standard';

    await createOrder({
      verify,
      orderNumber,
      shippingMethod,
      payment:submission.value.payment,
      amount: totalPrice,
      customerId,
      shippingAddressId: address.id,
      dateFacturareId,
      adresaFacturareId:dateAdresaFacturareId,
      cart,
      tipPersoana:submission.value.tipPersoana
    })
  }

  const url = await createStripeSession(cart, submission, cartId || '');
  return redirect(url as string);
}