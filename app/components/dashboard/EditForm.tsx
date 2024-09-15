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
import { ArrowLeft, Check, ChevronLeft, ChevronsUpDown, XIcon } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { useFormState } from "react-dom";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { productSchema } from "@/app/lib/zodSchemas";
import { type $Enums } from "@prisma/client";
import { deleteImage, editProduct } from "@/app/actions/product";
import { UploadButton, UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";
import Tiptap from "@/components/Tiptap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  };
  categories: {
    name: string;
    id: number;
    slug: string;
  }[];
}

export function EditForm({ data, categories }: iAppProps) {
  const [images, setImages] = useState<string[]>(data.images);
  const [categoryId, setCategoryId] = useState(categories.find((cat) => cat.id === data.productCategoryId)?.id);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>();

  const [content, setContent] = useState(
    JSON.parse(JSON.stringify(data.description))
  );
  const [lastResult, action] = useFormState(editProduct, undefined);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
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
    
    const selectedCategory = categories.find(
      (cat) => cat.slug === (event as any)
    );
    if (selectedCategory) {
      setCategoryId(selectedCategory.id as any);
    }
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="productId" value={data.id} />
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
                      defaultValue={categories.find((cat) => cat.id === data.productCategoryId)?.id}
                    />
                    <Select
                      onValueChange={(event) =>
                        handleCategoryChange(event as any)
                      }
                      defaultValue={categories.find((cat) => cat.id === data.productCategoryId)?.slug}
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
                      defaultValue={data.originalPrice ? data.originalPrice : data.price}
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
          </div>
        </div>
       
        <div className="flex justify-end mt-4">
            <Submitbutton title="Edit Product" />
          </div>
      </div>
    </form>
  );
}



{/* <Card>
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

</Card> */}