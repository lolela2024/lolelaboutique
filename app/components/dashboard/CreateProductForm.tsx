"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Check, ChevronsUpDown, XIcon } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { UploadButton } from "@/app/lib/uploadthing";
import { createProduct, deleteImage } from "@/app/actions/product";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { productSchema } from "@/app/lib/zodSchemas";
import { Submitbutton } from "@/app/components/SubmitButtons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Tiptap from "@/components/Tiptap";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { FaXmark } from "react-icons/fa6";
import { AiFillGooglePlusCircle, AiOutlinePlusCircle } from "react-icons/ai";

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

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

interface iAppProps {
  productCategories: {
    name: string;
    id: number;
    slug: string;
  }[];
  tipBijuterie: {
    id: number;
    name: string;
    value: string;
  }[];
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export default function CreateProductForm({
  productCategories,
  tipBijuterie,
  tags,
}: iAppProps) {
  const [images, setImages] = useState<string[]>([]);
  const [lastResult, action] = useFormState(createProduct, undefined);

  const [open, setOpen] = React.useState(false);
  const [openTags, setOpenTags] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<string | undefined>();
  const [categoryId, setCategoryId] = useState(0);
  const [content, setContent] = useState<string>();
 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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

  // Funcție pentru a gestiona schimbarea valorii unui checkbox
  const handleCheckboxChange = (slug: string) => {
    setSelectedTags(
      (prev) =>
        prev.includes(slug)
          ? prev.filter((item) => item !== slug) // Dacă este deja selectat, îl eliminăm
          : [...prev, slug] // Dacă nu este selectat, îl adăugăm
    );
  };

  // Funcția pentru a adăuga un tag
  const handleAddItem = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(""); // Resetează input-ul după adăugare
    }
  };

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  const handleDeleteTags = (tagToRemove: string) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDelete = (index: number, image: string) => {
    deleteImage(image);

    setImages(images.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategory = productCategories.find(
      (cat) => cat.slug === (event as any)
    );
    if (selectedCategory) {
      setCategoryId(selectedCategory.id as any);
    }
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4 ">
        <Button
          className="text-gray-800 hover:bg-gray-200"
          variant="link"
          size="icon"
          asChild
        >
          <Link href="/dashboard/products">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Add Product</h1>
      </div>

      <div className="mt-5">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <Label>Title</Label>
                    <Input
                      type="text"
                      key={fields.name.key}
                      name={fields.name.name}
                      defaultValue={fields.name.initialValue}
                      className="w-full"
                      placeholder="Short sleeve t-shirt"
                    />
                    <p className="text-red-500">{fields.name.errors}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label>Description</Label>
                    <input
                      type="hidden"
                      key={fields.description.key}
                      name={fields.description.name}
                      value={content}
                    />
                    <Tiptap
                      content={content}
                      onChange={(newContent: string) =>
                        handleContentChange(newContent)
                      }
                    />
                    <p className="text-red-500">{fields.description.errors}</p>
                  </div>
                  <div className="flex flex-col gap-2 justify-start">
                    <Label>Media</Label>
                    <div className="flex flex-col p-4 border border-dashed rounded-lg">
                      <input
                        type="hidden"
                        value={images}
                        key={fields.images.key}
                        name={fields.images.name}
                        defaultValue={fields.images.initialValue as any}
                      />
                      {images.length > 0 ? (
                        <div className="flex gap-5">
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="relative w-[100px] h-[100px]"
                            >
                              <Image
                                height={100}
                                width={100}
                                src={image}
                                alt="Product Image"
                                className="w-full h-full object-cover rounded-lg border"
                              />

                              <button
                                onClick={() => handleDelete(index, image)}
                                type="button"
                                className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <UploadButton
                          className="trixtu-btn"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            setImages(res.map((r) => r.url));
                          }}
                          onUploadError={() => {
                            alert("Something went wrong");
                          }}
                        />
                      )}

                      <p className="text-red-500">{fields.images.errors}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label>Category</Label>
                    <input
                      type="hidden"
                      value={categoryId}
                      key={fields.productCategoryId.key}
                      name={fields.productCategoryId.name}
                    />
                    <Select
                      onValueChange={(event) =>
                        handleCategoryChange(event as any)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {productCategories.map((category: any) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <p className="text-red-500">
                      {fields.productCategoryId.errors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-sm font-semibold">Pricing</CardHeader>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-3">
                    <Label>Price</Label>
                    <Input
                      key={fields.price.key}
                      name={fields.price.name}
                      defaultValue={fields.price.initialValue}
                      type="number"
                      placeholder="$55"
                    />
                    <p className="text-red-500">{fields.price.errors}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label>Sale Price</Label>
                    <Input
                      key={fields.salePrice.key}
                      name={fields.salePrice.name}
                      defaultValue={fields.salePrice.initialValue}
                      type="number"
                      placeholder="$55"
                    />
                    <p className="text-red-500">{fields.salePrice.errors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 space-y-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col gap-3">
                  <Label>Status</Label>
                  <Select
                    key={fields.status.key}
                    name={fields.status.name}
                    defaultValue={fields.status.initialValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-red-500">{fields.status.errors}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col gap-3">
                  <Label>Featured Product</Label>
                  <Switch
                    key={fields.isFeatured.key}
                    name={fields.isFeatured.name}
                    defaultValue={fields.isFeatured.initialValue}
                  />
                  <p className="text-red-500">{fields.isFeatured.errors}</p>
                </div>
              </CardContent>
            </Card>

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
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === tag.value
                                      ? "opacity-100"
                                      : "opacity-0"
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

            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col gap-3">
                  <Label>Tip bijuterie</Label>
                  <Select
                    key={fields.tipBijuterie.key}
                    name={fields.tipBijuterie.name}
                    defaultValue={fields.tipBijuterie.initialValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tip bijuterie" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipBijuterie.map((tip) => (
                        <SelectItem key={tip.id} value={tip.value}>
                          {tip.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-red-500">{fields.status.errors}</p>
                </div>
              </CardContent>
            </Card>

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
                  onChange={(ev) => (setTagInput(ev.target.value),setOpenTags(false))}
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
                            onCheckedChange={() =>
                              handleCheckboxChange(item.slug)
                            }
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
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-6">
            {/* <div className="flex flex-col gap-3">
              <Label>Small description</Label>
              <Textarea
                key={fields.smallDescription.key} 
                name={fields.smallDescription.name}
                defaultValue={fields.smallDescription.initialValue}
                placeholder="Write your description right here..."
              />
              <p className="text-red-500">{fields.smallDescription.errors}</p>
            </div> */}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Submitbutton title="Create Product" />
        </div>
      </div>
    </form>
  );
}
