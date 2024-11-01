"use client"

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import React, { FormEvent, useState, useTransition } from "react";
import { LuAlertTriangle } from "react-icons/lu";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "sonner";
import { deleteFirma } from "../_actions/company";

export default function DeleteFirma({ firmaId }: { firmaId: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(() => {
      deleteFirma(firmaId).then((data) => {
        setError(data.error);
        setSuccess(data.success);
        if(data.success){
          toast("Firma a fost stearsa cu succes", {
        
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
