"use client";

import { Button } from "@/components/ui/button";
import React, { FormEvent, useState, useTransition } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteAddress } from "../_actions/address";
import { FormSuccess } from "@/app/components/FormSuccess";
import { FormError } from "@/app/components/FormError";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuAlertTriangle } from "react-icons/lu";
import { IoCloseOutline } from "react-icons/io5";
import { redirect } from "next/navigation";

export default function DeleteAddress({ addressId }: { addressId: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(() => {
      deleteAddress(addressId).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if(data.success){
          toast("Adresa a fost stearsa cu succes", {
        
            position:"top-right",
           
            closeButton:false,
            style: {
              backgroundColor: 'rgb(255 235 235)',
              borderBottom: "4px solid #ff4343",
              borderBottomColor: "#ff4343",
              borderLeftColor: "rgb(255 180 180)",
              borderRightColor: "rgb(255 180 180)",
              borderTopColor: "rgb(255 180 180)",
            },
            duration: 5000, // Durată în milisecunde
            icon: <LuAlertTriangle />
          });
        }
        window.location.reload();
      });
      

      redirect("/account/address")
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <Button className="gap-1 " variant={"ghost"} size={"sm"} type="submit">
        <RiDeleteBin5Line />
        Sterge
      </Button>
    </form>
  );
}
