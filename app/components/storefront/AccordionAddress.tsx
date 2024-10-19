"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState, useTransition } from "react";
import ShippingForm from "./ShippingForm";
import { Cart } from "@/app/lib/interfaces";
import { CheckoutFormProps } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { AddresSchema } from "@/app/lib/schemas/adresaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { editAddress } from "@/app/actions/address";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { Submitbutton } from "../SubmitButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function AccordionAddress({
  user,
  fields,
  address,
}: {
  user: CheckoutFormProps["user"];
  address: CheckoutFormProps["address"];
  fields: any;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof AddresSchema>>({
    resolver: zodResolver(AddresSchema),
    defaultValues: {
      phone: address?.phone || "",
      strada: address?.strada,
      numar: address?.numar,
      bloc: address?.bloc || "",
      scara: address?.scara || "",
      etaj: address?.etaj || "",
      apartament: address?.apartament || "",
      judet: address?.judet,
      localitate: address?.localitate,
      codPostal: address?.codPostal || "",
    },
  });

  const onSubmit = (values: z.infer<typeof AddresSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      editAddress(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
      setOpen(false)
    });
  };

  return (
    <>
      <div className="text-md text-gray-700 hover:no-underline py-4 ">
        <div className=" flex flex-col items-start space-y-2">
          <h4 className="font-normal">Expediază către</h4>
          <div className="text-sm text-secondary-foreground ">
            {user && user.address.length > 0 ? (
              <p className="text-xs md:text-sm font-semibold">
                {user.firstName}, {user?.address[0].strada}{" "}{user?.address[0].numar},{user.address[0].localitate},
                {user.address[0].codPostal}, {user.address[0].judet},{" "}
                {user.address[0].phone}
              </p>
            ) : (
              <p>no address</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant={"outline"}
            size={"sm"}
            type="button"
            onClick={() => setOpen(true)}
          >
            Editați adresa
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit adresa</DialogTitle>
              <DialogDescription>
                Completeaza câmpurile obligatorii *. Apasă pe salveaza când
                totul este gata.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormError message={error} />
                <FormSuccess message={success} />

                <div className="grid gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="telefon">
                            Telefon
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              className={
                                error ? "border-red-500 bg-red-100" : ""
                              }
                              id="telefon"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9">
                      <FormField
                        control={form.control}
                        name="strada"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <div className="grid">
                              <Label className="mb-2" htmlFor="strada">
                                Strada *
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  className={
                                    error ? "border-red-500 bg-red-100" : ""
                                  }
                                  id="strada"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <FormField
                        control={form.control}
                        name="numar"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <div className="grid">
                              <Label className="mb-2" htmlFor="numar">
                                Numar *
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  className={
                                    error ? "border-red-500 bg-red-100" : ""
                                  }
                                  id="numar"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="bloc"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <div className="grid">
                              <Label className="mb-2" htmlFor="bloc">
                                Bloc
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  className={
                                    error ? "border-red-500 bg-red-100" : ""
                                  }
                                  id="bloc"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="scara"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <div className="grid">
                              <Label className="mb-2" htmlFor="scara">
                                Scara
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  className={
                                    error ? "border-red-500 bg-red-100" : ""
                                  }
                                  id="scara"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="etaj"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <div className="grid">
                              <Label className="mb-2" htmlFor="etaj">
                                Etaj
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  className={
                                    error ? "border-red-500 bg-red-100" : ""
                                  }
                                  id="etaj"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="apartament"
                        render={({ field, fieldState: { error } }) => (
                          <FormItem>
                            <div className="grid">
                              <Label className="mb-2" htmlFor="apartament">
                                Ap
                              </Label>
                              <FormControl>
                                <Input
                                  {...field}
                                  className={
                                    error ? "border-red-500 bg-red-100" : ""
                                  }
                                  id="apartament"
                                  type="text"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="localitate"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="localitate">
                            Localitate *
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              className={
                                error ? "border-red-500 bg-red-100" : ""
                              }
                              id="localitate"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="judet"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="judet">
                            Judet *
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              className={
                                error ? "border-red-500 bg-red-100" : ""
                              }
                              id="judet"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codPostal"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="codPostal">
                            Cod Postal
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              className={
                                error ? "border-red-500 bg-red-100" : ""
                              }
                              id="codPostal"
                              type="text"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                {isPending ? (
                  <Button disabled variant={"default"}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </Button>
                ) : (
                  <Button
                    disabled={isPending}
                    variant={"default"}
                    type="submit"
                  >
                    Adauga
                  </Button>
                )}
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* <ShippingForm user={user} address={address} fields={fields} /> */}
    </>
  );
}
