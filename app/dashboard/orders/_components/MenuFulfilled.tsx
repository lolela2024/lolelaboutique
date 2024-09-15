"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import React from 'react'
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { link } from 'fs'
import { Fulfilled } from '@prisma/client'

type Checked = DropdownMenuCheckboxItemProps["checked"]

export default function MenuFulfilled({fulfill}:any) {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  variant="ghost" size={'sm'}><Ellipsis /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="justify-start" align='end'>
        {fulfill === "Fulfilled" && (
          <Button variant="destructive" size={"sm"} className='w-full text-red-600 bg-transparent hover:bg-red-200'>Cancel fulfillment</Button>
        )}
        {fulfill === "Unfulfilled" && (
          <Button variant="ghost" size={"sm"} className='w-full'>Fulfill</Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
