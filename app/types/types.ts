import { UserRole } from "@prisma/client";
import { Cart } from "../lib/interfaces";


export type CheckoutFormProps = {
  products: Cart;
  user?: {
    email: string;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    address: {
      id: number;
      company:string | null;
      address: string;
      address2: string | null;
      postalCode: string | null;
      city: string;
      county: string;
      country: string;
      userId: string | null;
      customerId: string | null;
    }[];
    billingAddress: {
      id: number;
      address: string;
      address2: string | null;
      postalCode: string | null;
      company: string | null;
      city: string;
      county: string;
      userId: string | null;
      customerId: string | null;
    }[];
  } | null | undefined;
};