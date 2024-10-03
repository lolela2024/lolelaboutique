import React from 'react'
import EditMaterialForm from '../_components/EditMaterialForm';
import prisma from '@/app/lib/db';

async function getData(id:number) {
  const data = await prisma.material.findUnique({
    where:{id:id},
    select: {
      id: true,
      name: true,
      value: true
    },
  });

  return data;
}

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getData(parseFloat(params.id));

  return (
    <EditMaterialForm data={data}/>
  )
}
