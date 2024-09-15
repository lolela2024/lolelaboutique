import { Cart } from "../lib/interfaces";

export type CheckoutFormProps = {
  products: Cart;
  user:
    | {
        email: string;
        firstName: string;
        lastName: string;
        profileImage: string;
        phone: string | null;
        address: {
          id: number;
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
          city: string;
          county: string;
          userId: string | null;
          customerId: string | null;
        }[];
      }
    | undefined;
};