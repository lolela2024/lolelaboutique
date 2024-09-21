"use client";

import { createCategory } from "@/app/actions/categories";
import { deleteImage } from "@/app/actions/product";
import { UploadButton } from "@/app/lib/uploadthing";
import { categorySchema } from "@/app/lib/zodSchemas";
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
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { useForm, useInputControl } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Submitbutton } from "../SubmitButtons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface CategoryFormProps {
  data: any;
}

export default function CategoryForm({ data }: CategoryFormProps) {
  const [image, setImage] = useState<string | "">();
  const [slug, setSlug] = useState<string>("");

  const [lastResult, action] = useFormState(createCategory, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: categorySchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const inputRef = useRef("");
  const slugValue = useInputControl(fields.slug);

  useEffect(() => {
    if (fields.name && fields.name.value) {
      let generatedSlug = slugify(fields.name.value);
      setSlug(generatedSlug);
    }
  }, [fields.name.value]);

  useEffect(() => {
    if (slug) {
      slugValue.change(slug);
      inputRef.current = slug;
    }
  }, [slug]);

  const handleDelete = (image: string) => {
    deleteImage(image);

    setImage("");
  };

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/categories">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">New Category</h1>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>
                In this form you can create your category
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <Label>Name *</Label>
                  <Input
                    type="text"
                    key={fields.name.key}
                    name={fields.name.name}
                    defaultValue={fields.name.initialValue}
                    className="w-full"
                    placeholder="Category Name"
                  />
                  <p className="text-red-500">{fields.name.errors}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Slug *</Label>
                  <Input
                    disabled
                    type="text"
                    className="w-full"
                    placeholder="Category Slug"
                    defaultValue={inputRef.current}
                  />
                  <p className="text-red-500">{fields.slug.errors}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Parent Category</Label>
                  <select
                    key={fields.parentCategoryId.key}
                    name={fields.parentCategoryId.name}
                    defaultValue={"0"}
                  >
                    <option value={"0"}>No parent category</option>
                    {data.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500">
                    {fields.parentCategoryId.errors}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Description</Label>
                  <Textarea
                    key={fields.description.key}
                    name={fields.description.name}
                    defaultValue={fields.description.initialValue}
                    placeholder="Write your description right here..."
                  />
                  <p className="text-red-500">{fields.description.errors}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Label>Image</Label>
                  <input
                    type="hidden"
                    value={image}
                    key={fields.image.key}
                    name={fields.image.name}
                    defaultValue={fields.image.initialValue as any}
                  />
                  {image ? (
                    <div className="flex gap-5">
                      <div className="relative w-[100px] h-[100px]">
                        <Image
                          height={100}
                          width={100}
                          src={image}
                          alt="Category Image"
                          className="w-full h-full object-cover rounded-lg border"
                        />

                        <button
                          onClick={() => handleDelete(image)}
                          type="button"
                          className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <UploadButton
                      endpoint="oneImageUploader"
                      onClientUploadComplete={(res) => {
                        setImage(res[0].url);
                      }}
                      onUploadError={() => {
                        alert("Something went wrong");
                      }}
                    />
                  )}

                  <p className="text-red-500">{fields.image.errors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
        <Card>
              <CardContent className="py-4">
                <div className="flex flex-col gap-3">
                  <Label>Featured Category</Label>
                  <Switch
                    key={fields.isFeatured.key}
                    name={fields.isFeatured.name}
                    defaultValue={fields.isFeatured.initialValue}
                  />
                  <p className="text-red-500">{fields.isFeatured.errors}</p>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
      <div className="float-right mt-4">
        <Submitbutton title="Create Category" />
      </div>
    </form>
  );
}
