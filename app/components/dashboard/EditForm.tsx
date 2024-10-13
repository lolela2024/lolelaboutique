"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { productSchema } from "@/app/lib/zodSchemas";
import { Inventory, Unavailable, type $Enums } from "@prisma/client";
import { deleteImage, editProduct } from "@/app/actions/product";
import { UploadButton, UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";
import Tiptap from "@/components/Tiptap";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Checkbox } from "@/components/ui/checkbox";
import { FaXmark } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import StockProductsEdit from "@/app/dashboard/products/_components/StockProductsEdit";


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


interface iAppProps {
  data: {
    id: string;
    name: string;
    description: JSON;
    smallDescription: string | null;
    status: $Enums.ProductStatus;
    price: number;
    originalPrice: number | null;
    images: string[];
    productCategoryId: number | null;
    isFeatured: boolean;
    materialId: number | null;
    productTags: [tagId: any];
    inventory: Inventory | undefined;
    trackQuantity: boolean;
  };
  categories: {
    name: string;
    id: number;
    slug: string;
  }[];
  tipMaterial: {
    id: number;
    name: string;
    value: string;
  }[];
  allTags: {
    id: number;
    name: string;
    slug: string;
  }[];
  unavailable: Unavailable | null;
}

export function EditForm({
  data,
  categories,
  tipMaterial,
  allTags,
  unavailable,
}: iAppProps) {
  const [images, setImages] = useState<string[]>(data.images);
  const [categoryId, setCategoryId] = useState(
    categories.find((cat) => cat.id === data.productCategoryId)?.id
  );
  const [tipBijuterie, setTipBijuterie] = useState(
    tipMaterial.find((material) => material.id === data.materialId)?.value
  );

  const [trackQuantity, setTrackQuantity] = useState<boolean>(
    data.trackQuantity
  );

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [openTags, setOpenTags] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Funcția pentru a adăuga un tag
  const handleAddItem = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(""); // Resetează input-ul după adăugare
    }
  };

  useEffect(() => {
    const tags = data.productTags.map((tag) => {
      const foundTag = allTags.find((t) => t.id === tag.tagId);
      return foundTag ? foundTag.name : "Unknown"; // Returnează 'Unknown' dacă tagul nu este găsit
    });

    setSelectedTags(tags);
  }, [data.productTags]); // Se va rula de fiecare dată când productTags se schimbă

  const [content, setContent] = useState(
    JSON.parse(JSON.stringify(data.description))
  );
  const [lastResult, action] = useFormState(editProduct, undefined);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
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
    const selectedCategory = categories.find(
      (cat) => cat.slug === (event as any)
    );
    if (selectedCategory) {
      setCategoryId(selectedCategory.id as any);
    }
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="productId" defaultValue={data.id} />
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
        <h1 className="text-xl font-semibold tracking-tight">Edit Product</h1>
      </div>

      <div className="mt-5">
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      key={fields.name.key}
                      name={fields.name.name}
                      defaultValue={data.name}
                      className="w-full"
                      placeholder="Product Name"
                    />
                    <p className="text-red-500">{fields.name.errors}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label>Description</Label>
                    <input
                      type="hidden"
                      key={fields.description.key}
                      name={fields.description.name}
                      defaultValue={content}
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
                        defaultValue={images}
                        key={fields.images.key}
                        name={fields.images.name}
                        // defaultValue={fields.images.initialValue as any}
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
                      // value={categoryId}
                      key={fields.productCategoryId.key}
                      name={fields.productCategoryId.name}
                      defaultValue={
                        categories.find(
                          (cat) => cat.id === data.productCategoryId
                        )?.id
                      }
                    />
                    <Select
                      onValueChange={(event) =>
                        handleCategoryChange(event as any)
                      }
                      defaultValue={
                        categories.find(
                          (cat) => cat.id === data.productCategoryId
                        )?.slug
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category: any) => (
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
                      defaultValue={
                        data.originalPrice ? data.originalPrice : data.price
                      }
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
                      defaultValue={data.originalPrice ? data.price : 0}
                      type="number"
                      placeholder="$55"
                    />
                    <p className="text-red-500">{fields.salePrice.errors}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-sm font-semibold">
                Inventory
              </CardHeader>
              <CardContent className="py-4">
                <div>
                  <div className="flex flex-col gap-3">
                    <Label>SKU (Stock Keeping Unit)</Label>
                    <Input
                      className="max-w-sm"
                      type="text"
                      name={fields.sku.name}
                      key={fields.sku.key}
                      defaultValue={ data.inventory?.sku }
                      disabled
                    />
                    <p className="text-red-500">{fields.salePrice.errors}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trackQuantity"
                      checked={trackQuantity}
                      name={fields.trackQuantity.name}
                      key={fields.trackQuantity.key}
                      onCheckedChange={() => setTrackQuantity(!trackQuantity)}
                    />
                    <label
                      htmlFor="trackQuantity"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Track quantity
                    </label>
                  </div>
                </div>
              </CardContent>
              <div>
                <Separator />
                <CardContent className="py-4">
                  {trackQuantity ? (
                    <StockProductsEdit
                      fields={fields}
                      unavailableValues={unavailable}
                      availableValue={data.inventory?.available || 0}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>Shop location</span>
                      <span>Not tracked</span>
                    </div>
                  )}
                </CardContent>
              </div>
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
                    defaultValue={data.status}
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
                    defaultChecked={data.isFeatured}
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
                    defaultValue={value}
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
                    defaultValue={
                      tipMaterial.find(
                        (material) => material.id === data.materialId
                      )?.value
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipMaterial.map((material) => (
                        <SelectItem key={material.id} value={material.value}>
                          {material.name}
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
                  defaultValue={selectedTags}
                  key={fields.tags.key}
                  name={fields.tags.name}
                  // defaultValue={fields.tags.initialValue as any}
                />

                <Input
                  className="relative"
                  id="tags"
                  type="text"
                  value={tagInput}
                  onClick={() => setOpenTags(!openTags)}
                  onChange={(ev) => (
                    setTagInput(ev.target.value), setOpenTags(false)
                  )}
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
                  {allTags.length > 0 &&
                    allTags.map((item, index) => (
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

        <div className="flex justify-end mt-4">
          <Submitbutton title="Edit Product" />
        </div>
      </div>
    </form>
  );
}

{
  /* <Card>
<CardContent>
  <div className="flex flex-col gap-6">
    
    <div className="flex flex-col gap-3">
      <Label>Name</Label>
      <Input
        type="text"
        key={fields.name.key}
        name={fields.name.name}
        defaultValue={data.name}
        className="w-full"
        placeholder="Product Name"
      />
      <p className="text-red-500">{fields.name.errors}</p>
    </div>


    <div className="flex flex-col gap-3">
      <Label>Short Description</Label>
      <Textarea
        key={fields.smallDescription.key}
        name={fields.smallDescription.name}
        defaultValue={data.smallDescription || ""}
        placeholder="Write your description right here..."
      />
      <p className="text-red-500">{fields.smallDescription.errors}</p>
    </div>


    <div className="flex flex-col gap-3">
      <Label>Description</Label>
      <input
        type="hidden"
        name={fields.description.name}
        value={content as any}
      />
      <Tiptap
        content={content}
        onChange={handleContentChange}
        immediatelyRender={false}
      />
      <p className="text-red-500">{fields.description.errors}</p>
    </div>

    {data.originalPrice ? (
      <>
        <div className="flex flex-col gap-3">
          <Label>Price</Label>
          <Input
            key={fields.price.key}
            name={fields.price.name}
            defaultValue={data.originalPrice || 0}
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
            defaultValue={data.price}
            type="number"
            placeholder="$55"
          />
          <p className="text-red-500">{fields.salePrice.errors}</p>
        </div>
      </>
    ) : (
      <>
        <div className="flex flex-col gap-3">
          <Label>Price</Label>
          <Input
            key={fields.price.key}
            name={fields.price.name}
            defaultValue={data.price}
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
            defaultValue={undefined}
            type="number"
            placeholder=""
          />
          <p className="text-red-500">{fields.price.errors}</p>
        </div>
      </>
    )}

    <div className="flex flex-col gap-3">
      <Label>Featured Product</Label>
      <Switch
        key={fields.isFeatured.key}
        name={fields.isFeatured.name}
        defaultChecked={data.isFeatured}
      />
      <p className="text-red-500">{fields.isFeatured.errors}</p>
    </div>

    <div className="flex flex-col gap-3">
      <Label>Status</Label>
      <Select
        key={fields.status.key}
        name={fields.status.name}
        defaultValue={data.status}
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

    <div className="flex flex-col gap-3">
      <Label>Category</Label>
      <select
        key={fields.productCategoryId.key}
        name={fields.productCategoryId.name}
        defaultValue={data.productCategoryId?.toString()}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <p className="text-red-500">
        {fields.productCategoryId.errors}
      </p>
    </div>

    <div className="flex flex-col gap-3">
      <Label>Images</Label>
      <input
        type="hidden"
        value={images}
        key={fields.images.key}
        name={fields.images.name}
      />
      {images.length > 0 ? (
        <div className="flex gap-5">
          {images.map((image, index) => (
            <div key={index} className="relative w-[100px] h-[100px]">
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
        <UploadDropzone
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
</CardContent>

</Card> */
}
