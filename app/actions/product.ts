"use server"
import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod';
import { productSchema } from '../lib/zodSchemas';
import prisma from "../lib/db";
import { utapi } from "../server/uploadthing";
import { auth } from "@/auth";
// import { slugify } from '../../lib/utils';
import slugify from 'slugify'; 

function generateSKU(prefix: string = "LO", length: number = 5): string {
  // Generează un număr aleatoriu cu numărul de cifre specificat
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, "0");
  
  // Concatenăm prefixul cu numărul aleatoriu pentru a forma SKU-ul
  return `${prefix}${randomNumber}`;
}

// Funcție pentru a trunca textul la un număr maxim de caractere
function truncateDescription(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text; // Dacă textul este mai scurt sau egal cu limita, îl returnăm așa cum e
  }

  // Truncăm textul și adăugăm "..." la final
  return text.slice(0, maxLength) + "...";
}

// În logica de creare a produsului:
const maxSeoDescriptionLength = 160; // Limită SEO recomandată de Google


export async function createProduct(prevState: unknown, formData:FormData) {
  const session = await auth()
  const user = session?.user

  if(!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema
  })  

  if(submission.status !== "success") {
    return submission.reply()
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  let discountAmount = 0;
  let discountPercentage = 0;

  if (submission.value.salePrice) {
    discountAmount = submission.value.price - submission.value.salePrice 
    discountPercentage = Math.round(discountAmount / submission.value.price * 100)
  }

  const description = submission.value.description;

  const material = await prisma.material.findFirst({
    where:{value:submission.value.tipBijuterie}
  })

  // Generare slug unic
  let baseSlug = slugify(submission.value.name, { lower: true });
  let slug = baseSlug;

  // Verificăm dacă există deja un produs cu acest slug
  let existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  // Dacă există, adăugăm un sufix numeric pentru a genera un slug unic
  let counter = 1;
  while (existingProduct) {
    slug = `${baseSlug}-${counter}`;
    existingProduct = await prisma.product.findUnique({
      where: { slug },
    });
    counter++;
  }

  const truncatedDescription = truncateDescription(
    JSON.parse(JSON.stringify(description)),
    maxSeoDescriptionLength
  );

  const createSeo = await prisma.seo.create({
    data:{
      seoTitle: submission.value.name,
      seoDescription: truncatedDescription,
      seoLink: `https://lolelaboutique.ro/product/${slug}`
    }
  })

  // Creare produs nou
  const createdProduct = await prisma.product.create({
    data: {
      name: submission.value.name,
      slug: slug,
      description: JSON.parse(JSON.stringify(description)),
      status: submission.value.status,
      price: submission.value.salePrice ? submission.value.salePrice : submission.value.price,
      discountAmount: submission.value.salePrice ? discountAmount : undefined,
      discountPercentage: submission.value.salePrice ? discountPercentage : undefined,
      originalPrice: submission.value.salePrice ? submission.value.price : undefined,
      images: flattenUrls,
      productCategoryId: submission.value.productCategoryId,
      isFeatured: submission.value.isFeatured === true ? true : false,
      smallDescription: submission.value.smallDescription,
      materialId: material?.id,
      trackQuantity: submission.value.trackQuantity ? submission.value.trackQuantity : false,
      seoId: createSeo.id
    },
  });

  const productId = createdProduct.id; // Ia productId după creare
  let tags: string[] = [];
  // Asigură-te că `tags` este un string sau un array
  const tagInput = submission.value.tags;

  if (typeof submission.value.tags === "string") {
    // Dacă este un singur string, îl împărțim
    tags = (submission.value.tags as string).split(",").map(tag => tag.trim());
  } else if (Array.isArray(tagInput)) {
    // Dacă este un array, verificăm fiecare element
    tags = tagInput.flatMap((input) => {
      // Verificăm dacă input este definit
      if (input) {
        return input.split(",").map((tag) => tag.trim());
      }
      return []; // Returnează un array gol dacă input este undefined
    });
  }
  
  //Salvare tag-uri și relații cu produsul
  for (const tagName of tags) {
    let tag = await prisma.tag.findFirst({
      where: { name: tagName },
    });

    // Dacă tag-ul nu există, îl creăm
    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug: slugify(tagName),
        },
      });
    }

    // Creăm relația dintre produs și tag
    await prisma.productTag.create({
      data: {
        productId: productId,
        tagId: tag.id,
      },
    });
  }

  if(submission.value.trackQuantity){
    const createdInventory =  await prisma.inventory.create({
      data: {
        available: submission.value.available ? submission.value.available : 0,
        onHand: submission.value.onHand,
        sku: submission.value.sku ? submission.value.sku : "",
        product: { connect:{ id: productId } }
      }
    })

    await prisma.unavailable.create({
      data: {
        damaged: submission.value.damaged ? submission.value.damaged : 0,
        qualityControl: submission.value.qualityControl ? submission.value.qualityControl : 0,
        safetyStock: submission.value.safetyStock ? submission.value.safetyStock : 0,
        other: submission.value.other ? submission.value.other : 0,
        inventory: { connect: { id: createdInventory.id } } // Asociere cu inventarul prin id
      },
    })
  }
  


  // Redirecționează la dashboard sau altă pagină
  return redirect("/dashboard/products");
}

export async function editProduct(prevState: any, formData: FormData) {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const productId = formData.get("productId") as string;

  let discountAmount = 0;
  let discountPercentage = 0;

  if (submission.value.salePrice) {
    discountAmount = submission.value.price - submission.value.salePrice 
    discountPercentage = Math.round(discountAmount / submission.value.price * 100)
  }

  const material = await prisma.material.findFirst({
    where:{value:submission.value.tipBijuterie}
  })
  
  // Actualizare produs
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: submission.value.name,
      description: JSON.parse(JSON.stringify(submission.value.description)),
      smallDescription: submission.value.smallDescription,
      productCategoryId: submission.value.productCategoryId,
      price: submission.value.salePrice ? submission.value.salePrice : submission.value.price,
      discountAmount: submission.value.salePrice ? discountAmount : undefined,
      discountPercentage: submission.value.salePrice ? discountPercentage : undefined,
      originalPrice: submission.value.salePrice ? submission.value.price : undefined,
      isFeatured: submission.value.isFeatured === true,
      status: submission.value.status,
      images: flattenUrls,
      materialId: material?.id,
      trackQuantity:submission.value.trackQuantity ? submission.value.trackQuantity : false
    },
  });

  // 1. Ștergem relațiile vechi din `ProductTag`
  await prisma.productTag.deleteMany({
    where: {
      productId: productId,
    },
  });

  let tags: string[] = [];
  // Asigură-te că `tags` este un string sau un array
  const tagInput = submission.value.tags;

  if (typeof submission.value.tags === "string") {
    // Dacă este un singur string, îl împărțim
    tags = (submission.value.tags as string).split(",").map(tag => tag.trim());
  } else if (Array.isArray(tagInput)) {
    // Dacă este un array, verificăm fiecare element
    tags = tagInput.flatMap((input) => {
      // Verificăm dacă input este definit
      if (input) {
        return input.split(",").map((tag) => tag.trim());
      }
      return []; // Returnează un array gol dacă input este undefined
    });
  }

  for (const tagName of tags) {
    let tag = await prisma.tag.findFirst({
      where: { name: tagName },
    });

    // Dacă tag-ul nu există, îl creăm
    if (!tag) {
      tag = await prisma.tag.create({
        data: {
          name: tagName,
          slug: slugify(tagName), // Generează slug pentru tag
        },
      });
    }

    // Creăm relația dintre produs și tag
    await prisma.productTag.create({
      data: {
        productId: productId,
        tagId: tag.id,
      },
    });
  }

  const existingInventory = await prisma.inventory.findFirst({
    where: { product: { id: productId } }
  });

  // Verificăm dacă există inventarul pentru produsul curent
  if (existingInventory) {
    const existingUnavailable = await prisma.unavailable.findUnique({
      where: { inventoryId: existingInventory.id }
    });

    // Dacă trackQuantity este dezactivat, ștergem inventarul și unavailable
    if (!submission.value.trackQuantity) {
      // Șterge inventarul existent
      await prisma.inventory.delete({
        where: { id: existingInventory.id }
      });

      // Dacă există unavailable, ștergem și acesta
      if (existingUnavailable) {
        await prisma.unavailable.delete({
          where: { id: existingUnavailable.id }
        });
      }
    } 
    // Dacă trackQuantity este activat și există inventar, actualizăm inventarul și unavailable
    else {
      await prisma.inventory.update({
        where: { id: existingInventory.id },
        data: {
          available: submission.value.available ? submission.value.available : 0,
          onHand: submission.value.onHand,
        }
      });

      if (existingUnavailable) {
        // Actualizăm unavailable dacă există deja
        await prisma.unavailable.update({
          where: { inventoryId: existingInventory.id },
          data: {
            damaged: submission.value.damaged || 0,
            qualityControl: submission.value.qualityControl || 0,
            safetyStock: submission.value.safetyStock || 0,
            other: submission.value.other || 0
          }
        });
      } else {
        // Creăm unavailable dacă nu există deja
        await prisma.unavailable.create({
          data: {
            inventoryId: existingInventory.id,
            damaged: submission.value.damaged || 0,
            qualityControl: submission.value.qualityControl || 0,
            safetyStock: submission.value.safetyStock || 0,
            other: submission.value.other || 0
          }
        });
      }
    }
  } 
  // Dacă nu există inventar, creăm inventarul și unavailable
  else {
    const sku = generateSKU();

    const newInventory = await prisma.inventory.create({
      data: {
        product:{ connect: { id: productId } },
        available: submission.value.available ? submission.value.available : 0,
        onHand: submission.value.onHand,
        sku: sku
      }
    });

    // Creăm unavailable pentru noul inventar
    await prisma.unavailable.create({
      data: {
        inventoryId: newInventory.id,
        damaged: submission.value.damaged || 0,
        qualityControl: submission.value.qualityControl || 0,
        safetyStock: submission.value.safetyStock || 0,
        other: submission.value.other || 0
      }
    });
  }
  

  
  redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  const product = await prisma.product.findUnique({
    where:{id:formData.get("productId") as string},
    select:{images:true,id:true}
  }) 

  
  const productTags = await prisma.productTag.findFirst({
    where:{productId:product?.id}
  })

  if(productTags){
    await prisma.productTag.deleteMany({
      where:{productId:product?.id}
    })
  }

  const images = product?.images || [];

  // Extrage `imageKey` pentru fiecare imagine
  const imageKeys = images.map(image => image.split('/f/')[1]);

  if(imageKeys) {
    await utapi.deleteFiles(imageKeys);
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/products");
}

export async function deleteImage(image:string) {
  const imageKey = image.split('/f/')[1];
  
  try {
    await utapi.deleteFiles(imageKey);
    return {success:"Image deleted", status:200};

  } catch (error) {
    return {error:error, status:500}
  }
}

