"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Fulfilled } from '@prisma/client'


export default function MenuFulfilled({fulfill,orderId}:{fulfill:Fulfilled | undefined, orderId:string | undefined}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  variant="ghost" size={'sm'}><Ellipsis /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="justify-start" align='end'>
        {fulfill === "Fulfilled" && (
          <Button  variant="destructive" size={"sm"} className='w-full text-red-600 bg-transparent hover:bg-red-200'>Cancel fulfillment</Button>
        )}
        {fulfill === "Unfulfilled" && (
          <Button variant="ghost" size={"sm"} className='w-full'>Hold fulfillment</Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
