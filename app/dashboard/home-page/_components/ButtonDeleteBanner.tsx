"use client"

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";
import { handleDeleteBanner } from "../_actions/banner";

export default function ButtonDeleteBanner({id}:{id:number}) {
  return (
    <Button className="text-red-500" variant={"link"}>
      <Trash2 />
    </Button>
  );
}
