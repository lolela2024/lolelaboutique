import * as z  from "zod";


export const ceckoutSchemaUser = z.object({
  numeFirma:    z.string().optional(),
  cif:          z.string().optional(),
  nrRegComert:  z.string().optional(),

  shipping: z.string().optional(),
  payment:  z.string().optional(),

  tipPersoana:      z.enum(['persoana-fizica', 'persoana-juridica']),
  tipAdresaFactura: z.enum(['same-address','different-address']),

  stradaAdreseFacturare:      z.string().optional(),
  numarAdreseFacturare:       z.string().optional(),
  blocAdreseFacturare:        z.string().optional(),
  scaraAdreseFacturare:       z.string().optional(),
  etajAdreseFacturare:        z.string().optional(),
  apartamentAdreseFacturare:  z.string().optional(),
  localitateAdreseFacturare:  z.string().optional(),
  judetAdreseFacturare:       z.string().optional(),

  termeniSiConditii:  z.string({ required_error: "Required"}),
})
.superRefine((data, ctx) => {
  if(data.tipAdresaFactura === "different-address"){
    if(!data.stradaAdreseFacturare){
      ctx.addIssue({
        code: 'custom',
        path: ['stradaAdreseFacturare'],
        message: 'Required',
      });
    }
    if(!data.numarAdreseFacturare){
      ctx.addIssue({
        code: 'custom',
        path: ['numarAdreseFacturare'],
        message: 'Required',
      });
    }
    if(!data.localitateAdreseFacturare){
      ctx.addIssue({
        code: 'custom',
        path: ['localitateAdreseFacturare'],
        message: 'Required',
      });
    }
    if(!data.judetAdreseFacturare){
      ctx.addIssue({
        code: 'custom',
        path: ['judetAdreseFacturare'],
        message: 'Required',
      });
    }
  }
});
