"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormState } from "react-dom";

import { createProduct } from "@/app/actions/product";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { productSchema } from "@/app/lib/zodSchemas";
import { Submitbutton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import Inventory from "@/app/dashboard/products/_components/Inventory";
import Pricing from "@/app/dashboard/products/_components/Pricing";
import TitleMediaDescription from "@/app/dashboard/products/_components/TitleMediaDescription";
import Status from "@/app/dashboard/products/_components/Status";
import FeaturedProduct from "@/app/dashboard/products/_components/FeaturedProduct";
import Piatra from "@/app/dashboard/products/_components/Piatra";
import TipBujuterie from "@/app/dashboard/products/_components/TipBujuterie";
import TagsProduct from "@/app/dashboard/products/_components/TagsProduct";

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
  const [lastResult, action] = useFormState(createProduct, undefined);

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: productSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

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
            <TitleMediaDescription
              fields={fields}
              productCategories={productCategories}
            />

            <Pricing fields={fields} />

            <Inventory fields={fields} />
          </div>
          <div className="col-span-1 space-y-4">
            <Status fields={fields} />
            <FeaturedProduct fields={fields} />
            <Piatra fields={fields} />
            <TipBujuterie fields={fields} tipBijuterie={tipBijuterie} />
            <TagsProduct fields={fields} tags={tags} />
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
