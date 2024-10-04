"use client";

import { deleteImage } from "@/app/actions/product";
import { UploadButton } from "@/app/lib/uploadthing";
import Tiptap from "@/components/Tiptap";
import { Card, CardContent } from "@/components/ui/card";
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
import { XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface IAppProps {
  fields: any;
  productCategories: {
    name: string;
    id: number;
    slug: string;
  }[];
}

export default function TitleMediaDescription({
  fields,
  productCategories,
}: IAppProps) {
  const [content, setContent] = useState<string>();
  const [images, setImages] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState(0);

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

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
              onChange={(newContent: string) => handleContentChange(newContent)}
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
              onValueChange={(event) => handleCategoryChange(event as any)}
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
            <p className="text-red-500">{fields.productCategoryId.errors}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
