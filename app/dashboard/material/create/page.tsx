import React from 'react'
import prisma from '@/app/lib/db';
import CreateMaterialForm from '../_components/CreateMaterialForm';

async function getData() {
  const data = await prisma.material.findMany({
    select: {
      id: true,
      name: true,
      value: true
    },
  });

  return data;
}

export default async function CreatePage() {
  const data = await getData();
  return (
    <CreateMaterialForm data={data}/>
  )
}
