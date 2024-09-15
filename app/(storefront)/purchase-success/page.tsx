import { stripe } from '@/app/lib/stripe'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string }
}) {

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  )
  // if (paymentIntent.metadata.productId == null) return notFound()

  const isSuccess = paymentIntent.status === "succeeded"
  return (
    <div><h1>{isSuccess ? "Success!" : "Error!"}</h1></div>
  )
}
