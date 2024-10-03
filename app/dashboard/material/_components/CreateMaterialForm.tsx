"use client";

import * as z from "zod";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialCreateSchema, MaterialSchema, RegisterSchema } from "@/app/lib/zodSchemas";
import { createMaterial } from "../action/material";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Submitbutton } from "@/app/components/SubmitButtons";
import { CiLogout } from "react-icons/ci";
import { slugify } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormError } from "@/app/components/FormError";
import { error } from "console";
import { FormSuccess } from "@/app/components/FormSuccess";

interface iAppProps {
  data: {
    id: number;
    name: string;
    value: string;
  }[];
}

export default function CreateMaterialForm({ data }: iAppProps) {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof MaterialCreateSchema>>({
    resolver: zodResolver(MaterialCreateSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  // Observați modificările câmpului name și actualizați slug
  useEffect(() => {
    const name = form.watch("name");
    const generatedSlug = slugify(name); // transformă numele într-un slug
    form.setValue("value", generatedSlug);
  }, [form.watch("name")]);

  const onSubmit = (values: z.infer<typeof MaterialCreateSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createMaterial(values).then((data) => {
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
              <Button type="submit">Create Material</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
