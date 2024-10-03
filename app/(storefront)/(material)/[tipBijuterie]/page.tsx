import React from 'react'
import prisma from '@/app/lib/db';
import { unstable_noStore as noStore } from "next/cache";
import { notFound } from 'next/navigation';
import { ProductCard } from '@/app/components/storefront/ProductCard';

async function getTipMaterial(tipBijuterie:string) {
  const queryOptions: any = {
    where:{value:tipBijuterie},
    select:{
      id:true
    }
  }

  const data = await prisma.material.findFirst(queryOptions)

  return data
}

async function getData (tipBijuterieId: number) {
  const queryOptions: any = {
    where:{
      materialId:tipBijuterieId
    },
    orderBy: {
      createdAt: "desc",
    },
  };

  // Facem query-ul cu opțiunile construite
  const data = await prisma.product.findMany(queryOptions);

  return data;
}

export default async function TipBijuterie({
  params,
}: {
  params: { tipBijuterie: string };
}) {
  noStore();
  const material = await getTipMaterial(params.tipBijuterie);
  const materialId = material?.id;

  if(!materialId){
    return notFound();
  }

  const data = await getData(materialId)

  return (
    <div className='grid grid-cols-12'>
      <div className='hidden md:block md:col-span-3'>
        sidebar
      </div>
      <div className='col-span-12 md:col-span-9'>
        {data.length >0 && data.map((item)=>(
          <div  key={item.id}  className='grid grid-cols-3'>
             <ProductCard item={item} loading={false}/>
          </div>
           
        ))}
      </div>
    </div>
  )
}
