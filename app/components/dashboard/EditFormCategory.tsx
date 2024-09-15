"use client"

import { editCategory } from "@/app/actions/categories";
import { deleteImage } from "@/app/actions/product";
import { UploadDropzone } from "@/app/lib/uploadthing";
import { categorySchema } from "@/app/lib/zodSchemas";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ChevronLeft, XIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { Submitbutton } from "../SubmitButtons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface iAppProps {
  data: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentCategoryId: number | null;
  };
}

export default function EditFormCategory({ data }: iAppProps) {
  const [image, setImage] = useState<string | undefined>(data.image as string);
  const [lastResult, action] = useFormState(editCategory, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: categorySchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDelete = (image: string) => {
    deleteImage(image);
    setImage("");
  };
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <input type="hidden" name="categoryId" value={data.id} />
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/categories">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">Edit Product</h1>
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            In this form you can update your product
          </CardDescription>
        </CardHeader>
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
                placeholder="Category Name"
              />

              <p className="text-red-500">{fields.name.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Slug</Label>
              <Input
                type="text"
                key={fields.slug.key}
                name={fields.slug.name}
                defaultValue={data.slug}
                className="w-full"
                placeholder="Category Slug"
              />

              <p className="text-red-500">{fields.name.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                key={fields.description.key}
                name={fields.description.name}
                defaultValue={data.description as string}
                placeholder="Write your description right here..."
              />
              <p className="text-red-500">{fields.description.errors}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Images</Label>
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
                <UploadDropzone
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
        <CardFooter>
          <Submitbutton title="Edit Category" />
        </CardFooter>
      </Card>
    </form>
  );
}
