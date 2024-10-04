import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaXmark } from "react-icons/fa6";

interface iAppProps {
  fields: any;
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export default function TagsProduct({ fields, tags }: iAppProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openTags, setOpenTags] = React.useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    if (dropdownRef.current && !dropdownRef.current.contains(target)) {
      setOpenTags(false); // Închidem meniul
    }
  };

  useEffect(() => {
    if (openTags) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openTags]);

  // Funcția pentru a adăuga un tag
  const handleAddItem = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(""); // Resetează input-ul după adăugare
    }
  };

  // Funcție pentru a gestiona schimbarea valorii unui checkbox
  const handleCheckboxChange = (slug: string) => {
    setSelectedTags(
      (prev) =>
        prev.includes(slug)
          ? prev.filter((item) => item !== slug) // Dacă este deja selectat, îl eliminăm
          : [...prev, slug] // Dacă nu este selectat, îl adăugăm
    );
  };

  const handleDeleteTags = (tagToRemove: string) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Card>
      <CardContent className="py-4">
        {/* Dropdown pentru tagPietre */}
        <Label htmlFor="tags">Tags</Label>
        <input
          type="hidden"
          value={selectedTags}
          key={fields.tags.key}
          name={fields.tags.name}
          defaultValue={fields.tags.initialValue as any}
        />

        <Input
          className="relative"
          id="tags"
          type="text"
          value={tagInput}
          onClick={() => setOpenTags(!openTags)}
          onChange={(ev) => (setTagInput(ev.target.value), setOpenTags(false))}
        />

        <div
          className={cn(
            tagInput ? "block" : "hidden",
            "bg-white border px-2 py-2 rounded-lg shadow-md"
          )}
        >
          <button
            className="flex items-center gap-1 bg-gray-300 w-full rounded-lg px-2 py-1"
            type="button"
            onClick={handleAddItem}
          >
            <AiOutlinePlusCircle />
            Add {tagInput}
          </button>
        </div>

        <div
          ref={dropdownRef}
          className={cn(
            openTags ? "block" : "hidden",
            "border px-2 py-2 rounded-lg shadow-lg absolute bg-white w-[300px]"
          )}
        >
          {tags.length > 0 &&
            tags.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={item.slug}
                    checked={selectedTags.includes(item.slug)} // Verificăm dacă este selectat
                    onCheckedChange={() => handleCheckboxChange(item.slug)}
                  />
                  <label
                    htmlFor={item.slug}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 w-full">
          {selectedTags.length > 0 &&
            selectedTags.map((item, index) => (
              <p
                key={index}
                className="bg-gray-300 py-0 flex items-center gap-1 rounded-2xl pl-2 pr-[2px] text-sm whitespace-nowrap"
              >
                {item}
                <button
                  className="hover:bg-gray-400 p-[2px] rounded-full h-full w-full"
                  type="button"
                  onClick={() => handleDeleteTags(item)}
                >
                  <FaXmark className="text-gray-600" size={14} />
                </button>
              </p>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
