"use client";

import CustomImage from "@/components/CustomImage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { Fragment, useEffect, useState, useTransition } from "react";
import ButtonAddRemoveItem from "./ButtonAddRemoveItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { Order, OrderProduct } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fulfilledSchema } from "../../../lib/schemas/fulfilledSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fulfilled } from "../../../actions/fulfilled";
import { Submitbutton } from "@/app/components/SubmitButtons";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FulfilledForm({
  data,
  fulfilledOrder,
  quantityTotal,
  orderId,
}: {
  fulfilledOrder: string;
  data: any | null;
  quantityTotal: number;
  orderId: string;
}) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const router = useRouter();

  const remainingQuantities = data.products.reduce(
    (acc: { [key: string]: number }, product: any) => {
      const totalFulfilledQuantity = product.Fulfillments.reduce(
        (sum: number, fulfillment: any) =>
          sum + (fulfillment.fulfilledQuantity || 0),
        0
      );
      acc[product.id] = product.quantity - totalFulfilledQuantity; // Calculăm cantitatea rămasă
      return acc;
    },
    {}
  );

  // Inițializează quantities cu valorile inițiale din data.products

  useEffect(() => {
    if (data?.products && fulfilledOrder === "Unfulfilled") {
      const initialQuantities = data.products.reduce(
        (acc: { [key: string]: number }, product: any) => {
          acc[product.id] = product.quantity;
          return acc;
        },
        {}
      );
      setQuantities(initialQuantities);
    } else if (data?.products && fulfilledOrder === "PartialFulfilled") {
      const remainingQuantities = data.products.reduce(
        (acc: { [key: string]: number }, product: any) => {
          const totalFulfilledQuantity = product.Fulfillments.reduce(
            (sum: number, fulfillment: any) =>
              sum + (fulfillment.fulfilledQuantity || 0),
            0
          );
          acc[product.id] = product.quantity - totalFulfilledQuantity; // Calculăm cantitatea rămasă
          return acc;
        },
        {}
      );
      setQuantities(remainingQuantities);
    }
  }, [data?.products, fulfilled, fulfilledOrder]);

  const form = useForm<z.infer<typeof fulfilledSchema>>({
    resolver: zodResolver(fulfilledSchema),
    defaultValues: {
      trackingNumber: "",
      shippingCarrier: "",
      notifyCustomerOfShipment: false,
      orderId: orderId,
    },
  });

  const handleSetQuantity = (productId: string, newQuantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  function onSubmit(values: z.infer<typeof fulfilledSchema>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      fulfilled(values, quantities).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
        
        if (data?.success) {
          // Redirecționează către pagina comenzii după ce procesul de fulfillment a avut succes
          router.push(`/dashboard/orders/${values.orderId}`);
        }
      });
    });
  }

  const total = Object.values(quantities).reduce(
    (acc: number, quantity: number) => acc + quantity,
    0
  );


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracking number</FormLabel>
                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card>
                <div className="px-4 pb-4">
                  <CardHeader className="p-0 py-4 text-sm font-light">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            data?.fulfilled === "Unfulfilled" &&
                              "bg-yellow-300",
                            data?.fulfilled === "PartialFulfilled" &&
                              "bg-[#ffd6a5]",
                            "py-1 px-2 rounded-md"
                          )}
                        >
                          {data?.fulfilled}
                        </div>
                        <span className="ml-4">#{data?.orderNumber}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border rounded">
                      <div className="p-2">
                        {data?.User?.firstName || data?.Customer?.firstName}{" "}
                        {data?.User?.lastName || data?.Customer?.lastName}
                      </div>
                      <Separator />
                      <div>
                        {data?.products.map((product: any, index: number) => (
                          <Fragment key={product.id}>
                            <div className="p-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                  <div className=" h-16 w-16 border bg-cover rounded-lg overflow-hidden">
                                    <CustomImage
                                      className="w-full h-full"
                                      src={product.Product.images[0]}
                                      alt={product.Product.name}
                                      width={60}
                                      height={60}
                                    />
                                  </div>
                                  <p>{product.Product.name}</p>
                                </div>
                                <ButtonAddRemoveItem
                                  productQuantity={
                                    fulfilledOrder === "Unfulfilled"
                                      ? product.quantity
                                      : fulfilledOrder === "PartialFulfilled"
                                      ? remainingQuantities[product.id]
                                      : null
                                  }
                                  setQuantity={(newQuantity: any) =>
                                    handleSetQuantity(product.id, newQuantity)
                                  }
                                  quantity={
                                    quantities[product.id] ?? product.quantity
                                  }
                                />
                              </div>
                            </div>
                            {index !== data.products.length - 1 && (
                              <Separator />
                            )}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold text-sm">
                        Tracking information
                      </h3>
                      <Alert className="my-4" variant={"info"}>
                        <IoMdInformationCircleOutline />
                        <AlertTitle className="font-semibold">
                          Add tracking to improve customer satisfaction
                        </AlertTitle>
                        <AlertDescription>
                          Orders with tracking let customers receive delivery
                          updates and reduce support requests.
                        </AlertDescription>
                      </Alert>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="trackingNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tracking number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="shippingCarrier"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Shipping carrier</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </div>
                <Separator />
                <CardContent>
                  <div className="my-4">
                    <h3 className="font-semibold text-sm pb-2">
                      Notify customer of shipment
                    </h3>
                    <FormField
                      control={form.control}
                      name="notifyCustomerOfShipment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-light">
                              Send shipment details to your customer now
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className="px-4 py-4">
                  <h3 className="text-sm font-semibold p-0">
                    Shipping address
                  </h3>
                </CardHeader>
                <CardContent className="px-4 py-0">
                  <div className="mb-4">
                    <p className="p-0">
                      {data?.User?.firstName || data?.Customer?.firstName}{" "}
                      {data?.User?.lastName || data?.Customer?.lastName}
                      <br />
                      {data?.shippingAddress?.strada}{" "}
                      {data?.shippingAddress?.numar}
                      {data?.shippingAddress?.bloc ||
                      data?.shippingAddress?.scara ||
                      data?.shippingAddress?.etaj ||
                      data?.shippingAddress?.apartament ? (
                        <Fragment>
                          <br />
                          {data?.shippingAddress?.bloc &&
                            "Bloc:" + data?.shippingAddress?.bloc + ","}
                          {data?.shippingAddress?.scara &&
                            " Scara:" + data?.shippingAddress?.scara + ","}
                          {data?.shippingAddress?.etaj &&
                            " Etaj:" + data?.shippingAddress?.etaj + ","}
                          {data?.shippingAddress?.apartament &&
                            " Apartament" + data?.shippingAddress?.apartament}
                          <br />
                        </Fragment>
                      ) : (
                        <br />
                      )}
                      {data?.shippingAddress?.codPostal}{" "}
                      {data?.shippingAddress?.localitate}
                      <br />
                      {data?.shippingAddress?.judet
                        ? "Judet:" + data?.shippingAddress?.judet
                        : null}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="px-4 py-4">
                  <h3 className="text-sm font-semibold p-0">Summary</h3>
                </CardHeader>
                <CardContent className="px-4 text-sm">
                  <p className="p-0">Fulfilling from Shop location</p>
                  <p className="p-0 font-semibold">
                    {total} from {quantityTotal}{" "}
                    {quantityTotal > 1 ? "items" : "item"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className={"w-full"}
                    disabled={isPending}
                    variant={"dashboard"}
                    size={"sm"}
                    type="submit"
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isPending ? "Please Wait" : "Fulfill item"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
