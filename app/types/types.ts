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
      phone: string | null;
      strada: string | null;
      numar: string | null;
      bloc: string | null;
      scara: string | null;
      etaj: string | null;
      apartament: string | null; // Permitem și valoarea null
      localitate: string;
      judet: string | null;
      codPostal: string | null;
      userId: string | null;
      customerId: string | null;    
    }[];
  } | null | undefined;
};