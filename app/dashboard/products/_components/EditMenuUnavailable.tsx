import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaArrowRightLong } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";

interface EditMenuProps {
  value: number;
  available: number;
  setValue: (value: number) => void;
  setAvailable: (value: number) => void;
}

export default function EditMenuUnavailable({
  value,
  available,
  setValue,
  setAvailable,
}: EditMenuProps) {
  const handleAddInventory = () => setValue(value + 1);

  const handleDeleteInventory = () => setValue(value - 1);

  const handleAddToStock = () => {
    setAvailable(available + value);
    setValue(0)
  }
    

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
          <span>{value}</span>
          <ChevronDown size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]" align="start">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleAddInventory}
          >
            <AiOutlinePlusCircle />
            Add inventory
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={value === 0}
            className="w-full justify-start gap-2"
            onClick={handleAddToStock}
          >
            <FaArrowRightLong />
            Move to Available
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={value === 0}
            onClick={handleDeleteInventory}
            className="w-full justify-start text-red-600 bg-transparent hover:bg-red-200 gap-2"
          >
            <RiDeleteBin6Line />
            Delete inventory
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
