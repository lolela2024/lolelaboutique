"use client";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type JSONContent } from "@tiptap/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { SelectCategory } from "../SelectCategory";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "../Editor";
import { UploadButton, UploadDropzone } from "@/app/lib/uploadthing";
import { Submitbutton } from "../SubmitButtons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CircleX, Loader } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { imageRemove } from "@/app/actions/imageRemove";

export function SellForm() {
  const [json, setJson] = useState<null | JSONContent>(null);
  const [images, setImages] = useState<null | string[]>(null);
  const [productFile, SetProductFile] = useState<null | string>(null);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);

  const handleImageDelete = async (image: string) => {
    setImageIsDeleting(true);

    // Extrage cheia imaginii
    const imageKey = image.split("/f/")[1];

    // Apelează funcția pentru a șterge imaginea
    const res = await imageRemove(imageKey);

    if (res.success) {
      // Filtrează imaginea ștearsă din array-ul images
      const updatedImages = images?.filter((img) => img !== image) || [];

      // Actualizează starea cu noul array de imagini
      setImages(updatedImages);

      alert("Image has been removed");
    } else {
      // Gestiunea cazurilor în care ștergerea nu a reușit
      alert("Failed to remove image");
    }

    setImageIsDeleting(false);
  };

  return (
    <form>
      {/* <CardHeader>
        <CardTitle>Sell your product with ease</CardTitle>
        <CardDescription>
          Please describe your product here in detail so that it can be sold
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-10">
        <div className="flex flex-col gap-y-2">
          <Label>Name</Label>
          <Input
            name="name"
            type="text"
            placeholder="Name of your Product"
            required
            minLength={3}
          />
          {state?.errors?.["name"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["name"]?.[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Category</Label>
          <SelectCategory />
          {state?.errors?.["category"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["category"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Price</Label>
          <Input
            placeholder="29$"
            type="number"
            name="price"
            required
            min={1}
          />
          {state?.errors?.["price"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["price"]?.[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Small Summary</Label>
          <Textarea
            name="smallDescription"
            placeholder="Pleae describe your product shortly right here..."
            required
            minLength={10}
          />
          {state?.errors?.["smallDescription"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["smallDescription"]?.[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <input
            type="hidden"
            name="description"
            value={JSON.stringify(json)}
          />
          <Label>Description</Label>
          <TipTapEditor json={json} setJson={setJson} />
          {state?.errors?.["description"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["description"]?.[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="images" value={JSON.stringify(images)} />
          <Label>Product Images</Label>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImages(res.map((item) => item.url));

              toast.success("Your images have been uploaded");
            }}
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["images"]?.[0] && (
            <p className="text-destructive">{state?.errors?.["images"]?.[0]}</p>
          )}
          <div className="flex overflow-hidden gap-4">
            {images &&
              images?.map((image, index) => (
                <div key={index} className="relative border rounded-lg max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                <Image src={image} alt="" fill className="object-cover" />
                  <Button
                    onClick={() => handleImageDelete(image)}
                    type="button"
                    size={"icon"}
                    variant={"link"}
                    className="absolute right-[0px] top-0 text-red-500"
                  >
                    <CircleX />
                  </Button>
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-y-2">
          <input type="hidden" name="productFile" value={productFile ?? ""} />
          <Label>Product File</Label>
          <UploadDropzone
            onClientUploadComplete={(res) => {
              SetProductFile(res[0].url);
              toast.success("Your Product file has been uplaoded!");
            }}
            endpoint="productFileUpload"
            onUploadError={(error: Error) => {
              toast.error("Something went wrong, try again");
            }}
          />
          {state?.errors?.["productFile"]?.[0] && (
            <p className="text-destructive">
              {state?.errors?.["productFile"]?.[0]}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-5">
        <Submitbutton title="Create your Product" />
      </CardFooter> */}
    </form>
  );
}
