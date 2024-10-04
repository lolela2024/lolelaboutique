"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { RegisterSchema } from "@/app/lib/zodSchemas";
import { CardWrapper } from "./CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/app/components/FormError";
import { FormSuccess } from "@/app/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { register } from "@/app/actions/register";
import { Loader2 } from "lucide-react";
import { Social } from "./Social";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Client nou</h1>
          <p className="text-balance text-muted-foreground">
            Inregistreaza-te si cumperi mai repede si mai simplu.
          </p>
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />

        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="grid">
                  <Label className="mb-2" htmlFor="nume">
                    Nume
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={error ? "border-red-500 bg-red-100" : ""}
                      id="nume"
                      type="text"
                      placeholder="Jacob"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="grid">
                  <Label className="mb-2" htmlFor="prenume">
                    Prenume
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={error ? "border-red-500 bg-red-100" : ""}
                      id="prenume"
                      type="text"
                      placeholder="Daniel"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="grid">
                  <Label className="mb-2" htmlFor="email">
                    Email
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={error ? "border-red-500 bg-red-100" : ""}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="grid gap-1">
            <div className="flex items-center">
              <Label htmlFor="password">Parola</Label>
              
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <div className="grid">
                    <FormControl>
                      <Input
                        {...field}
                        className={error ? "border-red-500 bg-red-100" : ""}
                        id="password"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </span>
            ) : (
              "Intra in cont"
            )}
          </Button>
          <Social />
        </div>
        <div className="mt-4 text-center text-sm">
          Esti deja inregistrat?{" "}
          <Link href="/auth/login" className="underline">
            Intra in cont
          </Link>
        </div>
      </form>
    </Form>
    
    // <CardWrapper
    //   headerLabel="Create an account"
    //   backButtonLabel="Already have an account?"
    //   backButtonHref="/auth/login"
    //   buttonLabel="Log in"
    //   showSocial
    // >
    //   <Form {...form}>
    //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //       <div className="space-y-4">
    //         <FormField
    //           control={form.control}
    //           name="firstName"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Nume:</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   {...field}
    //                   disabled={isPending}
    //                   type="text"
    //                   placeholder="Nume"
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="lastName"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Prenume:</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   {...field}
    //                   disabled={isPending}
    //                   type="text"
    //                   placeholder="Prenume"
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="email"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Email</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   {...field}
    //                   disabled={isPending}
    //                   placeholder="john.doe@example.com"
    //                   type="email"
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="password"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Password</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   {...field}
    //                   disabled={isPending}
    //                   type="password"
    //                   placeholder="******"
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //       </div>
    //       <FormError message={error} />
    //       <FormSuccess message={success} />
    //       <Button type="submit" className="w-full" disabled={isPending}>
    //         Sign Up
    //       </Button>
    //     </form>
    //   </Form>
    // </CardWrapper>
  );
};
