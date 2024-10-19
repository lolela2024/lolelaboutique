import { addFirma } from "@/app/actions/firma";
import { FirmaSchema } from "@/app/lib/schemas/firmaSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Submitbutton } from "../../SubmitButtons";
import { Loader2 } from "lucide-react";

export default function AdaugaFirma({ tipPersoana }: { tipPersoana: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof FirmaSchema>>({
    resolver: zodResolver(FirmaSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof FirmaSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      addFirma(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
      setOpen(false);
    });
  };
  return (
    <Card
      className={cn(
        "",
        tipPersoana === "persoana-juridica" && "border-t-0 rounded-t-none"
      )}
    >
      <CardContent className="py-4 ">
        <div className="flex items-center justify-between w-full">
          <span>Nu ai adaugat firma</span>
          <Button variant={"outline"} size={"sm"} onClick={() => setOpen(true)}>
            Adauga firma
          </Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adauga firma</DialogTitle>
              <DialogDescription>
                Completeaza câmpurile obligatorii *. Apasă pe adaugă când totul
                este gata.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 mb-4">
                  <FormField
                    control={form.control}
                    name="numeFirma"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="telefon">
                            Nume firma
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
                  <FormField
                    control={form.control}
                    name="cif"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="telefon">
                            CIF
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
                  <FormField
                    control={form.control}
                    name="nrRegComert"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <div className="grid">
                          <Label className="mb-2" htmlFor="telefon">
                            Nr. reg. comertului / An:
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
      </CardContent>
    </Card>
  );
}
