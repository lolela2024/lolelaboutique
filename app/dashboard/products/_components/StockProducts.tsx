import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import EditMenuUnavailable from "./EditMenuUnavailable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Component principal
export default function StockProducts({ fields }: { fields: any }) {
  const [unavailable, setUnavailable] = useState({
    damaged: 0,
    qualityControl: 0,
    safetyStock: 0,
    other: 0,
  });
  const [available, setAvailable] = useState(0);
  const [newStock, setNewStock] = useState(0);
  const [openNew, setOpenNew] = useState(false);

  const totalUnavailable = Object.values(unavailable).reduce(
    (acc, val) => acc + val,
    0
  );
  const onHand = totalUnavailable + available;

  const handleUnavailableChange = (
    key: keyof typeof unavailable,
    value: number
  ) => {
    setUnavailable((prev) => ({ ...prev, [key]: value }));
  };

  const handleInventoryChange = () => {
    setAvailable((prev) => prev + newStock);
    setOpenNew(false);
    setNewStock(0);
  };

  return (
    <Table>
      <input
        type="hidden"
        name={fields.damaged.name}
        key={fields.damaged.key}
        defaultValue={unavailable.damaged}
      />
      <input
        type="hidden"
        name={fields.qualityControl.name}
        key={fields.qualityControl.key}
        defaultValue={unavailable.qualityControl}
      />
      <input
        type="hidden"
        name={fields.safetyStock.name}
        key={fields.safetyStock.key}
        defaultValue={unavailable.safetyStock}
      />
      <input
        type="hidden"
        name={fields.other.name}
        key={fields.other.key}
        defaultValue={unavailable.other}
      />
      <input
        type="hidden"
        name={fields.available.name}
        key={fields.available.key}
        defaultValue={available}
      />
      <input
        type="hidden"
        name={fields.onHand.name}
        key={fields.onHand.key}
        defaultValue={onHand}
      />

      <TableHeader>
        <TableRow>
          <TableHead className="bg-white border-none font-semibold text-gray-800">
            Location
          </TableHead>
          <TableHead className="bg-white border-none text-right font-semibold text-gray-800">
            Unavailable
          </TableHead>
          <TableHead className="bg-white border-none text-right font-semibold text-gray-800">
            Committed
          </TableHead>
          <TableHead className="bg-white border-none text-right font-semibold text-gray-800">
            Available
          </TableHead>
          <TableHead className="bg-white border-none text-right font-semibold text-gray-800">
            On hand
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-white">
          <TableCell className="border-none">Shop location</TableCell>
          <TableCell className="border-none relative">
            <div className="flex justify-end absolute top-[15px] right-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} type="button">
                    <span>{totalUnavailable}</span>
                    <ChevronDown size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[16.25rem]" align="end">
                  <DropdownMenuLabel>Unavailable inventory</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {["damaged", "qualityControl", "safetyStock", "other"].map(
                      (key) => (
                        <div
                          key={key}
                          className="flex items-center justify-between px-2"
                        >
                          <span>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                          <EditMenuUnavailable
                            setAvailable={setAvailable}
                            available={available}
                            value={unavailable[key as keyof typeof unavailable]}
                            setValue={(val) =>
                              handleUnavailableChange(
                                key as keyof typeof unavailable,
                                val
                              )
                            }
                          />
                        </div>
                      )
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>

          {/* Committed */}
          <TableCell className="border-none relative">
            <div className="flex justify-end absolute top-[15px] right-0">
              <Button variant={"ghost"} type="button">
                <span>0</span>
                <ChevronDown size={18} />
              </Button>
            </div>
          </TableCell>

          {/* Available */}
          <TableCell className="border-none relative">
            <div className="flex justify-end absolute top-[15px] right-0">
              <DropdownMenu open={openNew} onOpenChange={setOpenNew}>
                <DropdownMenuTrigger>
                  <Button
                    variant={"ghost"}
                    type="button"
                    onClick={() => setOpenNew(!openNew)}
                  >
                    <span>{available}</span>
                    <ChevronDown size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Label>New</Label>
                  <Input
                    type="number"
                    value={newStock}
                    onChange={(ev) => setNewStock(parseFloat(ev.target.value))}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => setOpenNew(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={handleInventoryChange}
                    >
                      Save
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>

          {/* on hand */}
          <TableCell className="border-none relative">
            <div className="flex justify-end absolute top-[15px] right-0">
              <Button variant={"ghost"} type="button">
                <span>{onHand}</span>
                <ChevronDown size={18} />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
