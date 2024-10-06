"use client";

import { AddresSchema } from "@/app/lib/zodSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { z } from "zod";
import { addAddress } from "../_actions/address";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormError } from "@/app/components/FormError";
import { FormSuccess } from "@/app/components/FormSuccess";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewAddressForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof AddresSchema>>({
    resolver: zodResolver(AddresSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof AddresSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      addAddress(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);

        router.push("/account");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <FormError message={error} />
            <FormSuccess message={success} />
          </CardHeader>
          <CardContent className="space-y-4">
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
                        className={error ? "border-red-500 bg-red-100" : ""}
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
                            className={error ? "border-red-500 bg-red-100" : ""}
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
                            className={error ? "border-red-500 bg-red-100" : ""}
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
                            className={error ? "border-red-500 bg-red-100" : ""}
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
                            className={error ? "border-red-500 bg-red-100" : ""}
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
                            className={error ? "border-red-500 bg-red-100" : ""}
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
                            className={error ? "border-red-500 bg-red-100" : ""}
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
                        className={error ? "border-red-500 bg-red-100" : ""}
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
                        className={error ? "border-red-500 bg-red-100" : ""}
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
                        className={error ? "border-red-500 bg-red-100" : ""}
                        id="codPostal"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end">
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit">Salveaza</Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
