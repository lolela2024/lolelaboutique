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
  country:z.string().min(1,{message:"Select a Country"}),
  firstName:z.string({ required_error: "Enter a first name"}),
  lastName:z.string({ required_error: "Enter a last name"}),
  company:z.string().optional(),
  address:z.string({ required_error: "Enter an address"}),
  address2:z.string().optional(),
  county:z.string({ required_error: "Select a state / province"}),
  city:z.string({ required_error: "Enter a city"}),
  postalCode:z.string().optional(),
  phone:z.string({ required_error: "Enter a phone number"})
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
  shipping:z.string().optional(),
  payment:z.string().optional(),
  billingAddress: z.enum(['same-address', 'different-address']),

  countryBilling:z.string().optional(),
  firstNameBilling:z.string().optional(),
  lastNameBilling:z.string().optional(),
  companyBilling:z.string().optional(),
  addressBilling:z.string().optional(),
  address2Billing:z.string().optional(),
  countyBilling:z.string().optional(),
  cityBilling:z.string().optional(),
  postalCodeBilling:z.string().optional(),
  phoneBilling:z.string().optional()
})
.superRefine((data, ctx) => {
  if (data.billingAddress === 'different-address') {
    if (!data.countryBilling) {
      ctx.addIssue({
        code: 'custom',
        path: ['countryBilling'],
        message: 'Country for billing address is required',
      });
    }
    if (!data.firstNameBilling) {
      ctx.addIssue({
        code: 'custom',
        path: ['firstNameBilling'],
        message: 'First name is required',
      });
    }
    if (!data.lastNameBilling) {
      ctx.addIssue({
        code: 'custom',
        path: ['lastNameBilling'],
        message: 'Last name is required',
      });
    }
    if (!data.addressBilling) {
      ctx.addIssue({
        code: 'custom',
        path: ['addressBilling'],
        message: 'Address is required',
      });
    }
    if (!data.cityBilling) {
      ctx.addIssue({
        code: 'custom',
        path: ['cityBilling'],
        message: 'City is required',
      });
    }
    if (!data.countyBilling) {
      ctx.addIssue({
        code: 'custom',
        path: ['countyBilling'],
        message: 'County is required',
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
  name:z.string().min(1,{
    message: "Name is required"
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