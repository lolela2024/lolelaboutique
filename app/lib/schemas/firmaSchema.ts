import { z } from "zod";

export const FirmaSchema = z.object({
  numeFirma:    z.string().min(1, { message: "Câmp obligatoriu" }),
  cif:          z.string().min(1, { message: "Câmp obligatoriu" }),
  nrRegComert:  z.string().min(1, { message: "Câmp obligatoriu" }),
})