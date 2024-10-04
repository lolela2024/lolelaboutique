import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { TipBijuterieProps } from "../ProductFilter";
import { Label } from "@/components/ui/label";

interface iAppProps {
  filter: any;
  setFilter: any;
  refetch: () => void;
  tipBijuterii: TipBijuterieProps;
  params: string;
}

export default function TipBijuterieFilter({
  filter,
  setFilter,
  refetch,
  tipBijuterii,
  params
}: iAppProps) {
  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);

  const [selectedValue, setSelectedValue] = useState("");

  // Setăm selectedValue când params se schimbă
  useEffect(() => {
    if (tipBijuterii.find((item)=>item.value === params)) {
      setSelectedValue(params);
      handleSelectionChange(params)
    } else if (tipBijuterii.length > 0) {
      setSelectedValue(""); // Setează prima opțiune dacă params e null
    }

    
  }, [params, tipBijuterii]);

  // Function to handle the change in selection
  const handleSelectionChange = (value: string) => {
    const tipBijuterieName = tipBijuterii.find((item)=>item.value === value)?.name
    setSelectedValue(value);
    setFilter((prev: any) => ({
      ...prev,
      sortType: "tipBijuterie",
      tipBijuterieNume: tipBijuterieName,
      tipBijuterie: value
    }));

    _debouncedSubmit();

  };

  return (
    <div>
      <h4 className="text-base font-medium uppercase py-3">Bijuterii</h4>
      <RadioGroup
        value={selectedValue}
        onValueChange={handleSelectionChange}
        className="text-gray-800"
        defaultValue={params || tipBijuterii[0]?.value}
        
      >
        {tipBijuterii.length > 0 &&
          tipBijuterii.map((option) => (
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
    </div>
  );
}
