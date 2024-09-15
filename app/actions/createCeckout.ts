"use server"

import { parseWithZod } from "@conform-to/zod"
import { ceckoutSchema } from "../lib/zodSchemas"
import prisma from "../lib/db"
import { cookies } from "next/headers"
import { Cart } from "../lib/interfaces"
import { redis } from "../lib/redis"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { stripe } from "../lib/stripe"
import Stripe from "stripe";
import { createAddress, createBillingAddress, createCustomerAddress, createCustomerBillingAddress, updateAddress, updateBillingAddress, updateCustomerAddress, updateCustomerBillingAddress } from "../lib/checkout"
import { Fulfilled, OrderStatus } from "@prisma/client"
// sau altă metodă de a obține user-ul logat
async function getNextOrderNumber(): Promise<number> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: 'desc' },
  });
  return lastOrder ? lastOrder.orderNumber + 1 : 10000;
}



export async function createCeckout(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const orderNumber = await getNextOrderNumber();
  const cookieStore = cookies();
  const cartId = cookieStore.get('cartId')?.value;
  const cart: Cart | null = await redis.get(`cart-${cartId}`);
  let totalPrice = 0;
  const verify = uuidv4();

  cart?.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  const {getUser} = getKindeServerSession()
  const user = await getUser()

  
  if (user?.email) {
    // Procesare pentru utilizatori autentificați
    
    await prisma.user.update({
      where:{ email: user.email },
      data:{
        phone:submission.value.phone
      }
    })

    const userData = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (userData) {
      const existingAddress = await prisma.address.findFirst({
        where: { userId: userData.id },
      });

      const existingBillingAddress = await prisma.billingAddress.findFirst({
        where: { userId: userData.id },
      });

      if(existingAddress){
        updateAddress(userData,formData)
      }else if(!existingAddress){
        createAddress(userData,formData)
      }

      if(existingBillingAddress && submission.value.billingAddress === "different-address"){
        updateBillingAddress(userData,formData)
      }else if(!existingBillingAddress && submission.value.billingAddress === "different-address"){
        createBillingAddress(userData,formData)
      }

      const address = await prisma.address.findFirst({
        where: { userId: userData.id },
      });

      const billingAddress = await prisma.billingAddress.findFirst({
        where: { userId: userData.id },
      });

      if(submission.value.payment === "ramburs"){

        await prisma.order.create({
          data: {
            verify,
            orderNumber,
            shippingMethod: submission.value.shipping || '',
            payment: submission.value.payment as string,
            status: OrderStatus.pending,
            amount: totalPrice,
            userId: userData.id,
            shippingAddressId: address?.id,
            billingAddressId: billingAddress?.id,
            fulfilled:Fulfilled.Unfulfilled,
            products: {
              create: cart?.items.map(item => ({
                Product: { connect: { id: item.id } },
                quantity: item.quantity,
              })),
            },
          },
          include: {
            products: true,
            shippingAddress: true,
            billingAddress: true,
          },
        });
  
        await redis.del(`cart-${cartId}`);
        redirect(`/checkout/comenzi?verify=${verify}`);
      }else if(submission.value.payment === "card") {
        await prisma.order.create({
          data: {
            verify,
            orderNumber,
            shippingMethod: submission.value.shipping || '',
            payment: submission.value.payment as string,
            status: OrderStatus.pending,
            amount: totalPrice,
            userId: userData.id,
            shippingAddressId: address?.id,
            billingAddressId: billingAddress?.id,
            fulfilled:Fulfilled.Unfulfilled,
            products: {
              create: cart?.items.map(item => ({
                Product: { connect: { id: item.id } },
                quantity: item.quantity,
              })),
            },
          },
          include: {
            products: true,
            shippingAddress: true,
            billingAddress: true,
          },
        });

        if(cart && cart.items) {
          const shippingCost = 2499;

          const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => (
            {
                price_data:{
                  currency: "ron",
                  unit_amount: item.price * 100,
                  product_data: {
                    name: item.name,
                    images: [item.imageString]
                  }
                },
                quantity: item.quantity
            }
          ))

          if(submission.value.shipping === "dhl"){
            lineItems.push({
              price_data: {
                currency: "ron",
                unit_amount: shippingCost, // Înmulțește suma cu 100 pentru a o converti în bani
                product_data: {
                  name: "Cost de livrare",
                }
              },
              quantity: 1
            });
          }
      
          const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: lineItems,
            customer_email:submission.value.email,
            success_url:
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/payment/success"
                : "https://shoe-marshal.vercel.app/payment/success",
            cancel_url:
              process.env.NODE_ENV === "development"
                ? "http://localhost:3000/payment/cancel"
                : "https://shoe-marshal.vercel.app/payment/cancel",
            metadata: {
              cartId:cartId || ''
            },
          });
      
          return redirect(session.url as string) 
        }
      }
    }

  }
  
    // Procesare pentru customers neregistrați
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: submission.value.email },
    });
  
    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          email: submission.value.email,
          firstName: submission.value.firstName,
          lastName: submission.value.lastName,
          phone: submission.value.phone,
        },
      });
    } else {
      await prisma.customer.update({
        where: { email: submission.value.email },
        data: {
          firstName: submission.value.firstName,
          lastName: submission.value.lastName,
          phone: submission.value.phone,
        },
      });
    }
  
    const customer = await prisma.customer.findUnique({
      where: { email: submission.value.email },
    });
  
    const customerId = customer?.id;
  
    const existingAddress = await prisma.address.findFirst({
      where: { customerId },
    });
  
    const existingBillingAddress = await prisma.billingAddress.findFirst({
      where: { customerId },
    });
  
    if (!existingAddress) {
      if(!customerId){
        return null
      }
      createCustomerAddress(customerId,formData)
    } else if (existingAddress) {
      updateCustomerAddress(existingAddress,formData);
    }
  
    if (!existingBillingAddress && submission.value.billingAddress === "different-address") {
      if(!customerId){
        return null
      }
      createCustomerBillingAddress(customerId,formData)
    } else if (existingBillingAddress && submission.value.billingAddress === "different-address") {
      updateCustomerBillingAddress(existingBillingAddress,formData)
    }
  
    const address = await prisma.address.findFirst({
      where: { customerId },
    });
  
    const billingAddress = await prisma.billingAddress.findFirst({
      where: { customerId },
    });
  

  if(submission.value.payment === "ramburs") {
    await prisma.order.create({
      data: {
        verify,
        orderNumber,
        shippingMethod: submission.value.shipping || '',
        payment: submission.value.payment as string,
        status: OrderStatus.pending,
        amount: totalPrice,
        customerId,
        shippingAddressId: address?.id,
        billingAddressId: billingAddress?.id,
        fulfilled:Fulfilled.Unfulfilled,
        products: {
          create: cart?.items.map(item => ({
            Product: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        products: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });
  
    await redis.del(`cart-${cartId}`);
  
    redirect(`/checkout/comenzi?verify=${verify}`);
  }else if (submission.value.payment === "card") {
    await prisma.order.create({
      data: {
        verify,
        orderNumber,
        shippingMethod: submission.value.shipping || '',
        payment: submission.value.payment as string,
        status: OrderStatus.pending,
        amount: totalPrice,
        customerId,
        shippingAddressId: address?.id,
        billingAddressId: billingAddress?.id,
        fulfilled:Fulfilled.Unfulfilled,
        products: {
          create: cart?.items.map(item => ({
            Product: { connect: { id: item.id } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        products: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if(cart && cart.items) {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => (
        {
            price_data:{
              currency: "ron",
              unit_amount: item.price * 100,
              product_data: {
                name: item.name,
                images: [item.imageString]
              }
            },
            quantity: item.quantity
        }
      ))



      const shippingCost = 2499;

      if(submission.value.shipping === "dhl"){
        lineItems.push({
          price_data: {
            currency: "ron",
            unit_amount: shippingCost, // Înmulțește suma cu 100 pentru a o converti în bani
            product_data: {
              name: "Cost de livrare",
            }
          },
          quantity: 1
        });
      }
      
  
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        customer_email:submission.value.email,
        success_url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/payment/success"
            : "https://shoe-marshal.vercel.app/payment/success",
        cancel_url:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/payment/cancel"
            : "https://shoe-marshal.vercel.app/payment/cancel",
        metadata: {
          cartId:cartId || ''
        },
      });
  
      return redirect(session.url as string) 
    }
  }

  
}
