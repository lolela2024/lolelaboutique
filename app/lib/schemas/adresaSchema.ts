import * as z  from "zod";

export const AddresSchema = z.object({
  phone: z.string().min(10, { message: "Număr de telefon invalid" }),
  strada: z.string().min(1, { message: "Câmp obligatoriu" }),
  numar: z.string().min(1, { message: "Câmp obligatoriu" }),
  localitate: z.string().min(1, { message: "Câmp obligatoriu" }),
  judet: z.string().min(1, { message: "Câmp obligatoriu" }),
  codPostal: z.string().optional(),
  bloc: z.string().optional(),
  scara: z.string().optional(),
  etaj: z.string().optional(),
  apartament: z.string().optional(),
});