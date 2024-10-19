

import { editDateFirma } from "@/app/actions/firma";
import { DateFirmaSchema } from "@/app/lib/zodSchemas";
import { CheckoutFormProps } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function DialogEditDateJuridica({
  open,
  setOpen,
  persoanaJuridica,
}: {
  open: boolean;
  setOpen: any;
  persoanaJuridica: CheckoutFormProps["persoanaJuridica"];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof DateFirmaSchema>>({
    resolver: zodResolver(DateFirmaSchema),
    defaultValues: {
      numeFirma: persoanaJuridica?.[0]?.numeFirma || "",
      cif: persoanaJuridica?.[0]?.CIF || "",
      nrRegComert: persoanaJuridica?.[0]?.nrRegComert || "",
    },
  });

  // Obținem valorile formularului și le trimitem pentru actualizare
  const onSubmit = (values: z.infer<typeof DateFirmaSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      editDateFirma(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        
      });
      setOpen(false)
      
    });
  };

  // Verificăm dacă persoanaJuridica este definită
  if (!persoanaJuridica || persoanaJuridica.length === 0) {
    return <div>Datele companiei nu sunt disponibile.</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Editați date firma</DialogTitle>
              <DialogDescription>
                Faceți modificări companiei dvs. aici. Faceți clic pe Salvați
                când ați terminat.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="numeFirma"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Nume Firma *:</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage>{error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cif"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>CIF *:</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage>{error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nrRegComert"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>Nr. reg. comertului / An *:</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage>{error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <DialogFooter>
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
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
