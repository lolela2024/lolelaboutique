import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import LinkSidebar from './LinkSidebar'

export default function SidebarAccount() {
  return (
    <div className='hidden md:block md:col-span-3'>
      <Card className='shadow-lg'>
        <CardHeader className='py-2'><h2 className='font-semibold text-lg'>CONTUL TAU</h2></CardHeader>
        <Separator />
        <CardContent className='py-1 px-2'>
          <LinkSidebar />
        </CardContent>
      </Card>
    </div>
  )
}
