"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CardWrapper } from "./CardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/app/actions/login";
import { LoginSchema } from "@/app/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/app/components/FormError";
import { FormSuccess } from "@/app/components/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Label } from "@/components/ui/label";
import { Social } from "./Social";
import { Submitbutton } from "@/app/components/SubmitButtons";
import { Loader2 } from "lucide-react";

export const LoginForm = () => {
  const searchParamas = useSearchParams();
  const callbackUrl = searchParamas.get("callbackUrl");
  const urlError =
    searchParamas.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with diferent provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { update } = useSession();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            update();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Contul tau</h1>
          <p className="text-balance text-muted-foreground">
            Ai mai cumparat de la noi sau esti deja inregistrat?
          </p>
        </div>
        {error && <FormError message={error} />}
        {urlError && <FormError message={urlError} />}
        <FormSuccess message={success} />

        {showTwoFactor && (
          <div className="mb-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="123456"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid gap-4">
          {!showTwoFactor && (
            <>
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
                  <Link
                    href="/auth/reset"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Ai uitat parola?
                  </Link>
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
            </>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? (
              "Confirma"
            ) : isPending ? (
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
          Client nou?{" "}
          <Link href="/auth/register" className="underline">
            Inregistreaza-te
          </Link>
        </div>
      </form>
    </Form>
  );
};
