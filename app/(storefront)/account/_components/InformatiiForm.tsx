"use client";

import { informatiiSchema } from "@/app/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { informatiiUpdate } from "../_actions/informatii";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { FormError } from "@/app/components/FormError";
import { FormSuccess } from "@/app/components/FormSuccess";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface InformatiiFormProps {
  user: {
    id: string;
    email: string;
    password: string | null;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    role: UserRole;
    isTwoFactorEnabled: boolean;
  } | null;
}

export default function InformatiiForm({ user }: InformatiiFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof informatiiSchema>>({
    resolver: zodResolver(informatiiSchema),
    defaultValues: {
      firstName: user?.firstName as string,
      lastName: user?.lastName as string,
      email: user?.email,
      password: "",
      newPassword: "",
      gender: user?.gender as string,
    },
  });

  const onSubmit = (values: z.infer<typeof informatiiSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      informatiiUpdate(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="mb-4">
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>
          <FormField
            control={form.control}
            name="gender"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="flex items-center gap-6 mb-6 ">
                  <Label>Mod de adresare</Label>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="masculin" id="r1" />
                        <Label htmlFor="r1">Dl.</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="feminin" id="r2" />
                        <Label htmlFor="r2">Dna.</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="grid">
                  <Label className="mb-2" htmlFor="nume">
                    Nume de familie
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
                  <Label className="mb-2" htmlFor="nume">
                    Prenume
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={error ? "border-red-500 bg-red-100" : ""}
                      id="nume"
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

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="grid">
                  <Label className="mb-2" htmlFor="parola">
                    Parola
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={error ? "border-red-500 bg-red-100" : ""}
                      id="parola"
                      type="password"
                      placeholder="******"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <div className="grid">
                  <Label className="mb-2" htmlFor="parola-noua">
                    Parola
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      className={error ? "border-red-500 bg-red-100" : ""}
                      id="parola-noua"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </span>
            ) : (
              "Salveaza"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
