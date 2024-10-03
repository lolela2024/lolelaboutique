"use client";

import { MaterialSchema } from "@/app/lib/zodSchemas";
import { slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateMaterial } from "../action/material";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FormError } from "@/app/components/FormError";
import { FormSuccess } from "@/app/components/FormSuccess";
import { Input } from "@/components/ui/input";

interface iAppProps {
  data: {
    id: number;
    name: string;
    value: string;
  } | null;
}

export default function EditMaterialForm({ data }: iAppProps) {
  const [isPending, startTransition] = useTransition();
  console.log(data?.name);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [slug, setSlug] = useState<string>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof MaterialSchema>>({
    resolver: zodResolver(MaterialSchema),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      value: data?.value,
    },
  });

  // Observați modificările câmpului name și actualizați slug
  useEffect(() => {
    const name = form.watch("name");
    const generatedSlug = slugify(name); // transformă numele într-un slug
    form.setValue("value", generatedSlug);
  }, [form.watch("name")]);

  const onSubmit = (values: z.infer<typeof MaterialSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      updateMaterial(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);

        if (data.success) {
          form.reset();

          router.push("/dashboard/material");
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 ">
          <Button
            className="text-gray-800 hover:bg-gray-200"
            variant="link"
            size="icon"
            asChild
          >
            <Link href="/dashboard/material">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">Add Material</h1>
        </div>
        <div className="mt-4">
          <div className="col-span-2 space-y-4">
            <Card>
              {error && <FormError message={error} />}
              {success && <FormSuccess message={success} />}
              <CardContent className="py-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormLabel>Id:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            type="text"
                            placeholder="id"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            type="text"
                            placeholder="Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value:</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            type="text"
                            placeholder="Value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end mt-4">
              <Button type="submit">Update Material</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
