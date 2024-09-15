import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import React from "react";

export default function MenuCustomer() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[220px]" align="end">
        <div>
          <Button variant="ghost" size={"sm"} className="w-full justify-start">
            Edit contact information
          </Button>
          <Button variant="ghost" size={"sm"} className="w-full justify-start">
            Edit shipping address
          </Button>
          <Button
            variant="destructive"
            size={"sm"}
            className="w-full justify-start text-red-600 bg-transparent hover:bg-red-200"
          >
            Remove customer
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
