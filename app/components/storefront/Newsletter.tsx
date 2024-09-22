import { newsletterEmail } from "@/app/actions/newsletter";
import { newsletterSchema } from "@/app/lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import React from "react";
import { useFormState } from "react-dom";
import { NewsletterButton } from "../SubmitButtons";
import { FormError } from "../FormError";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AiFillWarning } from "react-icons/ai";

export const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});

export default function Newsletter() {
  const [lastResult, action] = useFormState(newsletterEmail, undefined);

  const [form, fields] = useForm({
    // Configure when each field should be validated
    shouldValidate: "onBlur",
    // Optional: Required only if you're validating on the server
    lastResult,
    // Optional: Client validation. Fallback to server validation if not provided
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
  });

  console.log(form.errors);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <h3 className="font-semibold mb-2">BULETIN INFORMATIV</h3>
      <div className="flex items-center">
        <Input
          className="py-6 rounded-r-none"
          placeholder="Adresa ta de e-mail"
          name={fields.email.name}
          key={fields.email.key}
        />
        <NewsletterButton />
      </div>
      <span className="text-xs">
        Intra in lumea lolelaboutique si stai la curent cu ultimele noutati si
        promotii.
      </span>
      <br />
      <span className="text-red-500">{fields.email.errors}</span>
      {form.errors && (
        <Alert variant="warning">
          <AiFillWarning className="h-4 w-4" />
          <AlertDescription>
          <strong>{form.value?.email}</strong>{form.errors}
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
