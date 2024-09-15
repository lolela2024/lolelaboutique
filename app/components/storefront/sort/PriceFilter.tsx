import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";

const priceRanges = [
  { label: "0 - 100 Lei", min: 0, max: 100 },
  { label: "100 Lei - 200 Lei", min: 100, max: 200 },
  { label: "200 Lei - 500 Lei", min: 200, max: 500 },
  { label: "500 Lei - 1.000 Lei", min: 500, max: 1000 },
  { label: "1.000 Lei - 2.000 Lei", min: 1000, max: 2000 },
  { label: "Peste 2.000 Lei", min: 2000, max: Number.MAX_SAFE_INTEGER },
] as const;

interface iAppProps {
  filter: any;
  setFilter: any;
  refetch: () => void;
}

export default function PriceFilter({
  filter,
  setFilter,
  refetch,
}: iAppProps) {
  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  const [selectedValue, setSelectedValue] = useState("");

  // Function to handle the change in selection
  const handleSelectionChange = (rangeLabel: string) => {
    setSelectedValue(rangeLabel);
    setFilter((prev: any) => ({
      ...prev,
      selectedPriceRange: rangeLabel,
    }));

    _debouncedSubmit();
  };

  return (
    <div>
      <h4 className="text-base font-medium uppercase py-3">Preț:</h4>
      <RadioGroup value={selectedValue} onValueChange={handleSelectionChange} className="text-gray-800 ">
        {priceRanges.map((range) => (
          <div key={range.label} className="flex items-center space-x-2">
            <RadioGroupItem
              value={range.label}
              id={range.label}
              onChange={() => {
                setFilter((prev: any) => ({
                  ...prev,
                  sort: range.label,
                }));

                _debouncedSubmit();
              }}
            />
            <Label htmlFor={range.label}>{range.label}</Label>
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
              selectedPriceRange: "",
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
