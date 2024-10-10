import { stripe } from "@/app/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req:Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK!
    )
  } catch (error) {
    return new NextResponse("invalid signature", {status:400})
  }

  const session = event.data.object as Stripe.Checkout.Session;

  
}