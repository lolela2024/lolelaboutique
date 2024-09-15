import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";

const SORT_OPTIONS = [
  { name: "Inele", value: "inele" },
  { name: "Cercei", value: "cercei" },
  { name: "Pandantive", value: "pandantive" },
  { name: "Brățări", value: "brățări" },
  { name: "Broşă", value: "broşă" },
  { name: "Coliere", value: "coliere" },
] as const;

interface iAppProps {
  filter: any;
  setFilter: any;
  refetch: () => void;
}

export default function CategoryFilter({
  filter,
  setFilter,
  refetch,
}: iAppProps) {
  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  const [selectedValue, setSelectedValue] = useState("");

  // Function to handle the change in selection
  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    setFilter((prev: any) => ({
      ...prev,
      sortType: "category",
      category: value,
    }));

    _debouncedSubmit();
  };

  return (
    <div>
      <h4 className="text-base font-medium uppercase py-3">Categorie</h4>
      <RadioGroup value={selectedValue} onValueChange={handleSelectionChange} className="text-gray-800">
        {SORT_OPTIONS.map((option) => (
          <div key={option.name} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              onChange={() => {
                setFilter((prev: any) => ({
                  ...prev,
                  sort: option.value,
                }));

                _debouncedSubmit();
              }}
            />
            <Label htmlFor={option.value}>{option.name}</Label>
          </div>
        ))}
      </RadioGroup>
      {selectedValue && (
        <button
          className="mt-2 text-xs py-1 px-2 rounded-lg hover:bg-gray-200/90 bg-gray-200 "
          onClick={() => {
            setSelectedValue("");
            setFilter((prev: any) => ({
              ...prev,
              category:"",
            }));
            _debouncedSubmit();
          }}
        >
          Șterge
        </button>
      )}
    </div>
  );
}
