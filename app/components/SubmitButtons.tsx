"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Loader,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { error } from "console";
import { MdEmail } from "react-icons/md";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { Wishlist } from "../lib/interfaces";

interface buttonProps {
  title: string;
  image?: string;
  error?: any;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function Submitbutton({ title, image, variant, error }: buttonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled variant={variant}>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button
          disabled={error || image === ""}
          variant={variant}
          type="submit"
        >
          {title}
        </Button>
      )}
    </>
  );
}

export function BuyButton({ price }: { price: number }) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-10">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-10">
          Buy for ${price}
        </Button>
      )}
    </>
  );
}

export function ShoppingBagButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5 bg-buttonColor">
          <Loader2 className="mr-4 h-5 w-5 animate-spin" /> Please Wait
        </Button>
      ) : (
        <Button
          size="lg"
          className="w-full mt-5 bg-buttonColor hover:bg-buttonColor/90"
          type="submit"
        >
          <ShoppingBag className="mr-4 h-5 w-5" /> Add to Cart
        </Button>
      )}
    </>
  );
}

export function DeleteItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button disabled className="font-medium text-gray-700 text-end">
          <Loader className="animate-spin" />
        </button>
      ) : (
        <button
          type="submit"
          className="font-medium text-gray-700 hover:text-primary text-end"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

export function AddQuantityItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button
          disabled
          className="bg-gray-100 border-r border-y px-2 py-[4px] rounded-r-md  font-medium text-gray-700 text-end"
        >
          <Loader className="animate-spin w-5 h-5" />
        </button>
      ) : (
        <button
          type="submit"
          className="bg-gray-100 border-r border-y px-2 py-[4px] rounded-r-md  font-medium text-gray-700 hover:text-primary text-end"
        >
          <Plus className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

export function RemoveQuantityItem() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <button
          disabled
          className="bg-gray-100 border-l border-y px-2 py-[4px] rounded-l-md  font-medium text-gray-700 text-end"
        >
          <Loader className="animate-spin w-5 h-5" />
        </button>
      ) : (
        <button
          type="submit"
          className="bg-gray-100 border-l border-y px-2 py-[4px] rounded-l-md  font-medium text-gray-700 hover:text-primary text-end"
        >
          <Minus className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

export function ChceckoutButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5 bg-buttonColor hover:bg-buttonColor/90">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Va rugam asteptati
        </Button>
      ) : (
        <Button type="submit" size="lg" className="w-full mt-5 bg-buttonColor hover:bg-buttonColor/90">
          Complete order
        </Button>
      )}
    </>
  );
}

export function ChceckoutButtonRedirect({transport}:{transport:string}) {
  const { push } = useRouter();
  return (
    <Button
      size="default"
      className=" w-full mt-5"
      onClick={() => push(`/checkout?transport=${transport}`)}
    >
      Finalizeaza comanda <ChevronRight className="w-5 h-5" />
    </Button>
  );
}

export const AuthButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className={`${
        pending ? "bg-gray-600" : "bg-blue-600"
      } rounded-md w-full px-12 py-3 text-sm font-medium text-white`}
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
};

export const NewsletterButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      className="px-8 text-base gap-2 py-6 rounded-l-none border border-primary"
      type="submit"
      disabled={pending}
    >
      <MdEmail />
      Aboneaza-te
    </Button>
  );
};

export const WishlistButton = ({itemFound}:{itemFound:boolean}) => {
  const { pending } = useFormStatus();

  
  return (
    <button 
      type="submit"
      disabled={pending}
    >
      {itemFound ? <FaHeart size={24}/> : <FaRegHeart size={24} />}
    </button>
  )
}