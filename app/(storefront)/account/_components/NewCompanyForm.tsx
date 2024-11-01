"use client";

import { CompanySchema } from "@/app/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addCompany } from "../_actions/company";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormError } from "@/app/components/FormError";
import { FormSuccess } from "@/app/components/FormSuccess";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function NewCompanyForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof CompanySchema>>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      numeFirma: "",
      cif: "",
      nrRegComert: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CompanySchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      addCompany(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);

        router.push("/account");
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
              name="numeFirma"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <div className="grid">
                    <Label className="mb-2" htmlFor="numeFirma">
                      Nume Firma
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        className={error ? "border-red-500 bg-red-100" : ""}
                        id="numeFirma"
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
              name="cif"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <div className="grid">
                    <Label className="mb-2" htmlFor="cif">
                      CIF
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        className={error ? "border-red-500 bg-red-100" : ""}
                        id="cif"
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
              name="nrRegComert"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <div className="grid">
                    <Label className="mb-2" htmlFor="nrRegComert">
                      Nr. reg. comertului / An
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        className={error ? "border-red-500 bg-red-100" : ""}
                        id="nrRegComert"
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
