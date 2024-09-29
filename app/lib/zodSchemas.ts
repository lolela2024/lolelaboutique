import { z } from "zod";
const jsonSchema = z.union([z.string(), z.object({}).passthrough(), z.array(z.any())]);

export const productSchema = z.object({
  name: z.string(),
  description: jsonSchema,
  status: z.enum(["draft", "published", "archived"]),
  price: z.number().min(1),
  salePrice: z.number().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
  productCategoryId: z.number(),
  isFeatured: z.boolean().optional(),
  smallDescription: z.string().optional(),
  tagPiatra: z.string().optional(),
}).refine(data => !data.salePrice || data.salePrice < data.price, {
  message: "Sale price must be less than the regular price",
  path: ["salePrice"],
});

export const categorySchema = z.object({
  name:z.string(),
  image:z.string().optional(),
  slug:z.string(),
  description:z.string().optional(),  
  parentCategoryId:z.number().optional(),
  isFeatured: z.boolean().optional(),
})

export const userSettingsSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),

  lastName: z
    .string()
    .min(3, { message: "Minimum length of 3 required" })
    .or(z.literal(""))
    .optional(),
});

export const dateLivrare = z.object({
  email: z.string().email()
})

export const ceckoutSchema = z.object({
  email: z.string( { required_error: "Enter an email" } ).email(),
  firstName:z.string({ required_error: "Enter a first name" }),
  lastName:z.string({ required_error: "Enter a last name" }),
  mobilePhone:z.string({ required_error: "Enter a mobile phone" })
    .regex(
      /^[\d+\-() ]+$/,
      'Phone number must contain only digits, plus, minus, parentheses, and spaces'
    )
    .min(7, 'Phone number must be at least 7 characters long')
    .max(15, 'Phone number cannot exceed 15 characters')
    .refine(
      (phone) => {
        const cleanedPhone = phone.replace(/[\s()-]/g, '');
        return cleanedPhone.length >= 7 && cleanedPhone.length <= 15;
      },
      'Phone number must have at least 7 digits after removing non-numeric characters'
    ),

  numeFirma:z.string().optional(),
  cif:z.string().optional(),
  nrRegComert:z.string().optional(),

  phone:z.string().optional(),
  strada:z.string({ required_error: "Enter an address"}),
  numar:z.string({ required_error: "Enter an address"}),

  bloc:z.string().optional(),
  scara:z.string().optional(),
  etaj:z.string().optional(),
  apartament:z.string().optional(),
  localitate:z.string({ required_error: "Enter an address"}),
  judet:z.string({ required_error: "Enter an address"}),
  codPostal:z.string().optional(),
  alteDetalii:z.string().optional(),

  shipping:z.string().optional(),
  payment:z.string().optional(),
  
  tipPersoana: z.enum(['persoana-fizica', 'persoana-juridica']),
  tipAdresaFactura: z.enum(['same-address','different-address']),

  stradaAdreseFacturare: z.string().optional(),
  numarAdreseFacturare: z.string().optional(),
  blocAdreseFacturare: z.string().optional(),
  scaraAdreseFacturare: z.string().optional(),
  etajAdreseFacturare: z.string().optional(),
  apartamentAdreseFacturare: z.string().optional(),
  localitateAdreseFacturare: z.string().optional(),
  judetAdreseFacturare: z.string().optional(),


  termeniSiConditii:z.string({ required_error: "Required"}),
})
.superRefine((data, ctx) => {
  if(data.tipPersoana === "persoana-juridica" && (data.numeFirma || data.cif || data.nrRegComert)) {
    if(!data.numeFirma){
      ctx.addIssue({
        code: 'custom',
        path: ['numeFirma'],
        message: 'Dați un nume de firma',
      });
    }
    if(!data.cif){
      ctx.addIssue({
        code: 'custom',
        path: ['cif'],
        message: 'Se cere CIF',
      });
    }
    if(!data.nrRegComert){
      ctx.addIssue({
        code: 'custom',
        path: ['nrRegComert'],
        message: 'Se cere Nr. reg. comertului / An',
      });
    }
  }
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

export const informatiiSchema = z.object({
  name:z.string({ required_error: "Enter a name"}),
  email: z.string( { required_error: "Enter an email" } ).email(),
  gender:z.string().optional(),
  password:z.string({ required_error: "Enter an password" }),
  newPassword:z.string().optional()
})

export const LoginSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  code:z.optional(z.string())
})

export const RegisterSchema = z.object({
  email:z.string().email(),
  password:z.string().min(6,{
    message: "Minimum 6 characters required"
  }),
  firstName:z.string().min(1,{
    message: "Firstname is required"
  }),
  lastName:z.string().min(1,{
    message: "Lastname is required"
  })
})

export const NewPasswordSchema = z.object({
  password:z.string().min(6,{
    message:"Minimum 6 characters required"
  }),
})

export const Banner = z.object({
  id:z.number().optional(),
  image:z.string().optional(),
  description: jsonSchema,
  on:z.boolean().optional()
})

export const newsletterSchema = z.object({
  email: z.string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
})