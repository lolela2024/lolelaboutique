import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

const tagsPietre = [
  { label: "Acvamarin", value: "acvamarin" },
  { label: "Agat", value: "agat" },
  { label: "Amazonit", value: "amazonit" },
  { label: "Ametist", value: "ametist" },
  { label: "Apatit", value: "apatit" },
  { label: "Calcedonie", value: "calcedonie" },
  { label: "Carneol", value: "carneol" },
  { label: "Charoit", value: "charoit" },
  { label: "Citrin", value: "citrin" },
] as const;

export default function Piatra({fields}:{fields:any}) {
  const [value, setValue] = React.useState<string | undefined>();
  const [open, setOpen] = React.useState(false);

  return (
    <Card>
      <CardContent className="py-4">
        {/* Dropdown pentru tagPietre */}
        <div className="flex flex-col gap-3">
          <Label>Piatra</Label>
          <input
            type="hidden"
            value={value}
            name={fields.tagPiatra.name}
            key={fields.tagPiatra.key}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {value
                  ? tagsPietre.find((tag) => tag.value === value)?.label
                  : "Selec piatra..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search tag..." />
                <CommandList>
                  <CommandEmpty>No tag found.</CommandEmpty>
                  <CommandGroup>
                    {tagsPietre.map((tag) => (
                      <CommandItem
                        key={tag.value}
                        value={tag.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === tag.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
