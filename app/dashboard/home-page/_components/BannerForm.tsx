"use client";

import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import React, { useState } from "react";
import { useFormState } from "react-dom";
import { createBanner, deleteImageBanner } from "../_actions/banner";
import { Banner } from "@/app/lib/zodSchemas";
import { Label } from "@/components/ui/label";
import CustomImage from "@/components/CustomImage";
import { XIcon } from "lucide-react";
import { UploadButton } from "@/app/lib/uploadthing";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Tiptap from "@/components/Tiptap";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Submitbutton } from "@/app/components/SubmitButtons";
import { BannerTop } from "@prisma/client";
import { useRouter } from "next/navigation";

interface iPropsBannerForm {
  data?: BannerTop | null;
}

export default function BannerForm({ data }: iPropsBannerForm) {
  const [image, setImage] = useState<string | "">(data?.image as string);
  const [lastResult, action] = useFormState(createBanner, undefined);
  const [content, setContent] = useState<JSON>(
    data?.description ? JSON.parse(JSON.stringify(data?.description)) : ""
  );
  const { push } = useRouter();

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: Banner });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  const handleDelete = (image: string) => {
    deleteImageBanner(image);

    setImage("");
  };

  return (
    <form id={form.id} action={action} onSubmit={form.onSubmit}>
      <div className="space-y-4">
        <h1>{data ? "Edit Banner" : "Create a Banner"}</h1>
        <Card>
          <CardContent className="mt-4">
            <input
              type="hidden"
              name={fields.id.name}
              key={fields.id.key}
              defaultValue={data?.id}
            />
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
                    <CustomImage
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
            <Separator className="my-4" />
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <input
                type="hidden"
                key={fields.description.key}
                name={fields.description.name}
                value={JSON.parse(JSON.stringify(content))}
              />
              <Tiptap
                content={content}
                onChange={(newContent: string) =>
                  handleContentChange(newContent)
                }
              />
              <p className="text-red-500">{fields.description.errors}</p>
            </div>
            <div className="flex flex-col gap-3">
              <Label>On</Label>
              <Switch
                key={fields.on.key}
                name={fields.on.name}
                defaultChecked={data?.on}
              />
              <p className="text-red-500">{fields.on.errors}</p>
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button type="button" variant={"secondary"} onClick={() => push("/dashboard/home-page")}>
              Back
            </Button>
            <Submitbutton image={image} title={data ? "Edit" : "Add"} />
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
